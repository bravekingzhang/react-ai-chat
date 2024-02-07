// CreateSessionComponent.tsx
import React from "react";
import useSessionStore from "../store/sessionStore";
import { FAB, makeStyles } from "@rneui/themed";
import { ModelValues } from "../store/sessionTypes";
import { router } from "expo-router";

const NewSession: React.FC = () => {
  const createSession = useSessionStore((state) => state.createSession);

  const styles = useStyles();

  const handleCreateSession = () => {
    const currentSessionId = Date.now().toString(); // 使用字符串 ID
    const newSession = {
      id: currentSessionId,
      name: "",
      settings: {
        model: "gpt-3.5-turbo" as ModelValues,
        temperature: 0.9,
        top_p: 1,
        max_tokens: 150,
        frequency_penalty: 0,
        presence_penalty: 0,
        auto_press: true,
        max_length_history_message: 4,
      }, // 定义具体的设置
      messages: [],
    };
    createSession(newSession);
    router.navigate({
      pathname: "/chat",
      params: { currentSessionId },
    });
  };

  return (
    <FAB
      icon={{ name: "add", color: styles.container.backgroundColor }}
      onPress={handleCreateSession}
      color={styles.fabStyle.color}
      style={styles.fabStyle}
    />
  );
};

export default NewSession;

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  fabStyle: {
    position: "absolute",
    margin: 16,
    color: theme.colors.primary,
    right: 0,
    bottom: 0,
  },
  list: {
    flex: 1,
  },
}));
