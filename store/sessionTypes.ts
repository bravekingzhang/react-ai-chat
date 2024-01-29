// sessionTypes.ts

type role = "system" | "assistant" | "user";
export interface Message {
  role: role;
  content: string;
  timestamp: number;
}

export const Model = {
  Gpt3_5Turbo: "gpt-3.5-turbo",
  Gpt3_5: "gpt-3.5",
  Gpt3: "gpt-3",
  Gpt4: "gpt-4",
  GeminiPro: "gemini-pro",
  GeminiProVision: "gemini-pro-vision",
} as const;

export type ModelKeys = keyof typeof Model;
export interface SessionSetting {
  model: ModelKeys;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export function getModelOptions(): { label: string; value: string }[] {
  return Object.values(Model).map((model) => ({ label: model, value: model }));
}
export interface Session {
  id: string;
  name: string;
  settings: SessionSetting; // 根据需要定义更具体的类型
  messages: Message[];
}
