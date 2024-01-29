import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList } from "react-native";
import { ListItem, makeStyles } from "@rneui/themed";
import InputPanel from "../components/InputPanel"; // 确保正确导入 InputPanel 组件
import { useLocalSearchParams } from "expo-router";
import useSessionStore from "../store/sessionStore";
import { ImageBackground } from "react-native";

const ChatScreen = () => {
  const { currentSessionId } = useLocalSearchParams<{
    currentSessionId?: string;
  }>();

  const { setCurrentSessionId, addMessageToSession } = useSessionStore();

  // 取出当前会话的session
  const session = useSessionStore((state) =>
    state.sessions.find((session) => session.id === currentSessionId)
  );

  const messages = useMemo(() => session?.messages || [], [session?.messages]);

  useEffect(() => {
    if (currentSessionId) setCurrentSessionId(currentSessionId);
  }, [currentSessionId]);

  const onSendMessage = (text: string) => {
    // 发送消息逻辑
    if (!currentSessionId) return;
    console.log("Sending Text: ", text);
    addMessageToSession(currentSessionId, {
      role: "user",
      content: text,
      timestamp: Date.now(),
    });
  };

  const styles = useStyles();

  type ItemType = (typeof messages)[0];
  const renderItem = ({ item }: { item: ItemType }) => {
    const isUserMessage = item.role === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessage : styles.receivedMessage,
        ]}
      >
        <View style={styles.messageBubble}>
          <ListItem.Title style={styles.messageText}>
            {item.content}
          </ListItem.Title>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/splash.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.timestamp.toLocaleString()}
          style={styles.list}
        />
        <InputPanel onSendMessage={onSendMessage} />
      </ImageBackground>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  list: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  receivedMessage: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "80%",
  },
  messageText: {
    color: "white",
  },
}));

export default ChatScreen;
