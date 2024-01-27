// sessionTypes.ts
export interface Message {
  from: "user" | "model";
  content: string;
  timestamp: string;
}

export interface Session {
  id: string;
  model: string;
  settings: any; // 根据需要定义更具体的类型
  messages: Message[];
}
