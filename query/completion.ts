import useSettingsStore from "../store/settingsStore";

import { ModelValues } from "../store/sessionTypes";

import * as FileSystem from "expo-file-system";

export const fetchOpenAiCompletion = async ({
  message,
  image_url,
  model = "gpt-3.5-turbo",
}: {
  message: string;
  image_url?: string;
  model?: ModelValues;
}) => {
  const baseURL = useSettingsStore.getState().baseURL;
  const apiKey = useSettingsStore.getState().apiKey;
  const body = await buildBody({ message, image_url, model });
  console.log(body);
  const response = await fetch(`${baseURL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: body,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

const buildBody = async ({
  message,
  image_url,
  model = "gpt-3.5-turbo",
}: {
  message: string;
  image_url?: string;
  model?: ModelValues;
}) => {
  if (image_url) {
    return JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message,
            },
            {
              type: "image_url",
              image_url: {
                url: await getImageBase64(image_url),
              },
            },
          ],
        },
      ],
    });
  }
  return JSON.stringify({
    model: model,
    messages: [{ role: "user", content: message }],
    temperature: 0.7,
  });
};

/**
 * react native 上 从本地获取图像的base64编码
 * @param url 图像的url
 * @returns
 */
const getImageBase64 = async (filePath: string) => {
  return new Promise<string>((resolve, reject) => {
    FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    })
      .then((base64) => {
        console.log(base64);
        resolve(`data:image/png;base64,${base64}`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
