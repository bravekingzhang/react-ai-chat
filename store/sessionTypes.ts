// sessionTypes.ts

type role = "system" | "assistant" | "user";
export interface Message {
  role: role;
  content: string;
  timestamp: string;
}

type Mode =
  | "gpt-3.5-turbo"
  | "gpt-3.5"
  | "gpt-3"
  | "gpt-4"
  | "gemini-pro"
  | "gemini-pro-vision";

export interface SessionSetting {
  model: Mode;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}
export interface Session {
  id: string;
  name: string;
  settings: SessionSetting; // 根据需要定义更具体的类型
  messages: Message[];
}
