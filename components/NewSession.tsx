// CreateSessionComponent.tsx
import React from "react";
import useSessionStore from "../store/sessionStore";
import { Button } from "@rneui/themed";

const NewSession: React.FC = () => {
  const createSession = useSessionStore((state) => state.createSession);

  const handleCreateSession = () => {
    const newSession = {
      id: Date.now().toString(), // 使用字符串 ID
      model: "your-model",
      name: "闲聊",
      settings: {}, // 定义具体的设置
      messages: [],
    };
    createSession(newSession);
  };

  return <Button onPress={handleCreateSession}>Create New Session</Button>;
};

export default NewSession;
