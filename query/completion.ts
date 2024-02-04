import useSettingsStore from "../store/settingsStore";

import { Message, ModelValues } from "../store/sessionTypes";

import * as FileSystem from "expo-file-system";

import { Content } from "../store/sessionTypes";
import useSessionStore from "../store/sessionStore";

export const fetchOpenAiCompletion = async ({
  id,
  message,
  image_url,
}: {
  id: string;
  message: string;
  image_url?: string;
}) => {
  const baseURL = useSettingsStore.getState().baseURL;
  const apiKey = useSettingsStore.getState().apiKey;
  const session = useSessionStore.getState().sessions.find((s) => s.id === id);
  const model = session?.settings.model ?? "gpt-3.5-turbo";
  const history = session?.messages ?? [];
  const historyCopy = JSON.parse(JSON.stringify(history)) as Message[];
  historyCopy.pop();
  const temperature = session?.settings.temperature ?? 0.5;
  const body = await buildBody({
    message,
    history: historyCopy,
    image_url,
    model,
    temperature,
  });
  console.log("fetchOpenAiCompletion body", body);
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
  if (!session?.name)
    renameSession(
      id,
      convertHistoryToMessages(history),
      model,
      baseURL,
      apiKey
    );
  return await response.json();
};

const buildBody = async ({
  message,
  image_url,
  history,
  model,
  temperature,
}: {
  message: string;
  image_url?: string;
  history: Message[];
  model: ModelValues;
  temperature: number;
}) => {
  if (image_url) {
    return JSON.stringify({
      model: model,
      messages: [
        // 仅在非gemini-pro-vision模型下，将历史消息转换为文本，貌似 gpt4-vision 支持历史消息?
        ...(model != "gemini-pro-vision"
          ? convertHistoryToMessages(history)
          : []),
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
    messages: [
      ...convertHistoryToMessages(history),
      { role: "user", content: message },
    ],
    temperature,
  });
};

const convertHistoryToMessages = (history: Message[]) => {
  //
  return history.map((message) => {
    return {
      role: message.role,
      content: buildRoleContent(message.content),
    };
  });
};

function buildRoleContent(content: Content[]): string {
  return content.map((item) => item.text).join("\n");
}

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
        resolve(`data:image/png;base64,${base64}`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const renameSession = async (
  id: string,
  renameMessageContext: { role: string; content: string }[],
  model: string,
  baseURL: string,
  apiKey: string
) => {
  console.log("renameSession", id, renameMessageContext, model);
  const response = await fetch(`${baseURL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: `你擅长给对话取主题，请基于以下内容，取个8字左右的主题`,
        },
        ...renameMessageContext,
      ],
    }),
  });
  if (response.ok) {
    const name = (await response.json()).choices[0].message.content as string;
    // console.log name
    console.log("renameSession name", name);
    const session = useSessionStore
      .getState()
      .sessions.find((session) => session.id === id);
    if (!session) {
      return;
    }
    session.name = name.replace(/\"/g, "");
    useSessionStore.setState({
      sessions: useSessionStore
        .getState()
        .sessions.map((s) => (s.id === id ? session : s)),
    });
  }
};
