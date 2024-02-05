import React, { useEffect, useMemo, useRef } from "react";
import { View, FlatList, ScrollView, useWindowDimensions } from "react-native";
import { Icon, ListItem, makeStyles, Text } from "@rneui/themed";
import InputPanel from "../components/InputPanel"; // 确保正确导入 InputPanel 组件
import { useLocalSearchParams, useNavigation } from "expo-router";
import useSessionStore from "../store/sessionStore";
import { ImageBackground } from "react-native";

import { fetchOpenAiCompletion } from "../query/completion";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-root-toast";

import { SessionSetting } from "../store/sessionTypes";
import HtmlView from "../components/HtmlView";
import MessageLoading from "../components/MessageLoading";

const ChatScreen = () => {
  const { currentSessionId } = useLocalSearchParams<{
    currentSessionId?: string;
  }>();

  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const { setCurrentSessionId, addMessageToSession } = useSessionStore();
  const navigation = useNavigation();
  // 取出当前会话的session
  const session = useSessionStore((state) =>
    state.sessions.find((session) => session.id === currentSessionId)
  );
  const sessionSetting = useMemo(
    () =>
      session?.settings || {
        model: "gpt-3.5-turbo" as SessionSetting["model"],
        temperature: 0.7 as SessionSetting["temperature"],
      },
    [session?.settings]
  );
  const messages = useMemo(() => session?.messages || [], [session?.messages]);

  const showAttachment = useMemo(() => {
    return (
      sessionSetting.model === "gemini-pro-vision" ||
      sessionSetting.model === "gpt-4-vision"
    );
  }, [sessionSetting]);

  useEffect(() => {
    if (currentSessionId) setCurrentSessionId(currentSessionId);
    navigation.setOptions({
      title:
        session?.name + "(" + session?.settings.model + ")" ||
        "与" + session?.settings.model + "对话",
    });
  }, [currentSessionId]);

  // 设置 useMutation 钩子
  const { mutate, isPending } = useMutation({
    mutationFn: fetchOpenAiCompletion,
    onSuccess: (data) => {
      // 处理响应数据，例如将响应的消息添加到会话中
      console.log("data", data.choices[0].message.content);
      if (currentSessionId) {
        addMessageToSession(currentSessionId, {
          role: "assistant",
          content: [{ type: "text", text: data.choices[0].message.content }],
          timestamp: new Date().getTime(),
        });
        flatListRef.current?.scrollToEnd();
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
    addMessageToSession(currentSessionId, {
      role: "user",
      content: [{ type: "text", text }],
      timestamp: Date.now(),
    });
    // 大模型处理消息逻辑
    // 调用 mutate 来发送消息给大模型
    mutate({
      id: currentSessionId,
      message: text,
    });
    flatListRef.current?.scrollToEnd();
  };

  const onSendMessageWithImage = (imageUrl: string, text: string) => {
    // 发送消息逻辑
    if (!currentSessionId) return;
    addMessageToSession(currentSessionId, {
      role: "user",
      content: [
        { type: "image_url", text: imageUrl },
        { type: "text", text },
      ],
      timestamp: Date.now(),
    });
    // 大模型处理消息逻辑
    // 调用 mutate 来发送消息给大模型
    mutate({
      id: currentSessionId,
      message: text,
      image_url: imageUrl,
    });
    flatListRef.current?.scrollToEnd();
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
        <View style={styles.messageAvatar}>
          {item.role === "user" ? (
            <Icon
              name="user"
              type="font-awesome-5"
              color={styles.userMessage.color}
            />
          ) : (
            <Icon
              name="robot"
              type="font-awesome-5"
              color={styles.receivedMessage.color}
            />
          )}
        </View>

        <View
          style={
            isUserMessage
              ? styles.messageSendBubble
              : styles.messageReceiveBubble
          }
        >
          <ListItem.Content>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{ height: "100%", width: "100%" }}
            >
              <HtmlView
                contents={item.content}
                width={width * 0.8}
                color={styles.messageColor.color}
              />
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
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.timestamp.toLocaleString()}
          ListFooterComponent={isPending ? <MessageLoading /> : null}
          ListFooterComponentStyle={{
            height: 50,
            width: "20%",
            justifyContent: "center",
            alignItems: "center",
          }}
          style={styles.list}
        />
        <InputPanel
          onSendMessage={onSendMessage}
          showAttachment={showAttachment}
          onSendAttachmentMessage={onSendMessageWithImage}
        />
      </ImageBackground>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  list: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
  },
  messageAvatar: {
    width: 30,
    height: 30,
    marginHorizontal: 3,
    borderRadius: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  messageColor: {
    color: theme.colors.black,
  },
  userMessage: {
    flexDirection: "row-reverse",
    color: theme.colors.primary,
  },
  receivedMessage: {
    flexDirection: "row",
    color: theme.colors.secondary,
  },
  messageReceiveBubble: {
    borderColor: theme.colors.greyOutline,
    backgroundColor: theme.colors.background,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    maxWidth: "90%",
  },
  messageSendBubble: {
    borderColor: theme.colors.greyOutline,
    backgroundColor: theme.colors.success,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    maxWidth: "90%",
  },
}));

export default ChatScreen;
