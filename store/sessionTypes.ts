// sessionTypes.ts

type role = "system" | "assistant" | "user";
export interface Message {
  role: role;
  content: Content[];
  timestamp: number;
}

type ContentType =
  | "text"
  | "image_url"
  | "image-base64"
  | "video_url"
  | "audio_url"
  | "file_url"
  | "custom";
export interface Content {
  type: ContentType;
  text: string;
}

export const Model = {
  Gpt3_5Turbo: "gpt-3.5-turbo",
  Gpt4: "gpt-4",
  GeminiPro: "gemini-pro",
  GeminiProVision: "gemini-pro-vision",
} as const;

export type ModelKeys = keyof typeof Model;

export type ModelValues = (typeof Model)[ModelKeys];
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
