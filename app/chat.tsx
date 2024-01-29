import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList, ScrollView } from "react-native";
import { ListItem, makeStyles } from "@rneui/themed";
import InputPanel from "../components/InputPanel"; // 确保正确导入 InputPanel 组件
import { useLocalSearchParams } from "expo-router";
import useSessionStore from "../store/sessionStore";
import { ImageBackground } from "react-native";

import { fetchOpenAiCompletion } from "../query/completion";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-root-toast";
import Markdown from "react-native-markdown-display";

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

  // 设置 useMutation 钩子
  const { mutate, isPending, error } = useMutation({
    mutationFn: fetchOpenAiCompletion,
    onSuccess: (data) => {
      // 处理响应数据，例如将响应的消息添加到会话中
      if (currentSessionId) {
        addMessageToSession(currentSessionId, {
          role: "assistant",
          content: data.choices[0].message.content, // 根据响应结构调整
          timestamp: new Date().getTime(),
        });
        // queryClient.invalidateQueries(['messages']);
      }
    },
    onError(error) {
      // 处理错误
      console.log("error", error);
      Toast.show("请求出错，请稍后再试:" + error.message, {
        duration: Toast.durations.SHORT,
      });
    },
    // 可以根据需要添加更多的配置，如 onError 来处理错误
  });

  const onSendMessage = (text: string) => {
    // 发送消息逻辑
    if (!currentSessionId) return;
    console.log("Sending Text: ", text);
    addMessageToSession(currentSessionId, {
      role: "user",
      content: text,
      timestamp: Date.now(),
    });
    // 大模型处理消息逻辑
    // 调用 mutate 来发送消息给大模型
    mutate(text);
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
        <View
          style={
            isUserMessage
              ? styles.messageSendBubble
              : styles.messageReceiveBubble
          }
        >
          <ListItem.Content style={styles.messageText}>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{ height: "100%", width: "100%" }}
            >
              <Markdown>{item.content}</Markdown>
            </ScrollView>
          </ListItem.Content>
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
  messageReceiveBubble: {
    backgroundColor: theme.colors.grey2,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "90%",
  },
  messageSendBubble: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "90%",
  },
  messageText: {
    color: "white",
  },
}));

export default ChatScreen;
