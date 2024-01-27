// CreateSessionComponent.tsx
import React from "react";
import useSessionStore from "../store/sessionStore";

const NewSession: React.FC = () => {
  const createSession = useSessionStore((state) => state.createSession);

  const handleCreateSession = () => {
    const newSession = {
      id: Date.now().toString(), // 使用字符串 ID
      model: "your-model",
      settings: {}, // 定义具体的设置
      messages: [],
    };
    createSession(newSession);
  };

  return <button onClick={handleCreateSession}>Create New Session</button>;
};

export default NewSession;
