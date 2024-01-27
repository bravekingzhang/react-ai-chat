import useSettingsStore from "../store/settingsStore";

export const fetchOpenAiCompletion = async (message: string) => {
  const baseURL = useSettingsStore.getState().baseURL;
  const apiKey = useSettingsStore.getState().apiKey;
  console.log("fetchOpenAiCompletion", message);
  console.log("baseURL", baseURL, "apiKey", apiKey);
  const response = await fetch(`${baseURL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
