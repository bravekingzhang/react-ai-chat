import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { ListItem, makeStyles, useTheme } from "@rneui/themed";
import InputPanel from "../components/InputPanel"; // 确保正确导入 InputPanel 组件
import { useLocalSearchParams } from "expo-router";
import useSessionStore from "../store/sessionStore";
import { ImageBackground } from "react-native";

import { fetchOpenAiCompletion } from "../query/completion";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-root-toast";
import RenderHtml from "react-native-render-html";
import * as showdown from "showdown";
import { useMarkdownStyles } from "../styles/markdown";
import { SessionSetting } from "../store/sessionTypes";

const ChatScreen = () => {
  const { currentSessionId } = useLocalSearchParams<{
    currentSessionId?: string;
  }>();

  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const { setCurrentSessionId, addMessageToSession } = useSessionStore();

  // 取出当前会话的session
  const session = useSessionStore((state) =>
    state.sessions.find((session) => session.id === currentSessionId)
  );
  const sessionSetting = useMemo(
    () =>
      session?.settings || {
        model: "gpt-3.5-turbo" as SessionSetting["model"],
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
    console.log("Sending Text: ", text);
    addMessageToSession(currentSessionId, {
      role: "user",
      content: [{ type: "text", text }],
      timestamp: Date.now(),
    });
    // 大模型处理消息逻辑
    // 调用 mutate 来发送消息给大模型
    mutate({
      message: text,
      model: sessionSetting.model as SessionSetting["model"],
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
      message: text,
      image_url: imageUrl,
      model: sessionSetting.model as SessionSetting["model"],
    });
    flatListRef.current?.scrollToEnd();
  };

  const styles = useStyles();
  const markdownStyles = useMarkdownStyles();
  type ItemType = (typeof messages)[0];

  function buildHtmlMessage(
    content: import("../store/sessionTypes").Content[]
  ): string {
    let result = "";
    for (const item of content) {
      if (item.type === "text") {
        result += item.text;
      } else if (item.type === "image_url") {
        result += `![image](${item.text})`;
      }
    }
    const converter = new showdown.Converter();
    const html = converter.makeHtml(result);
    return html;
  }

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
          <ListItem.Content>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{ height: "100%", width: "100%" }}
            >
              <RenderHtml
                tagsStyles={markdownStyles}
                source={{ html: buildHtmlMessage(item.content) }}
                contentWidth={width * 0.8}
              ></RenderHtml>
            </ScrollView>
          </ListItem.Content>
        </View>
      </View>
    );
  };

  const Loading = () => {
    const theme = useTheme();
    const spinValue = new Animated.Value(0);

    // 在组件挂载后开始动画
    React.useEffect(() => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }, []);

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <View style={styles.messageReceiveBubble}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <ActivityIndicator size="small" color={theme.theme.colors.white} />
        </Animated.View>
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
          ListFooterComponent={isPending ? Loading : null}
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
    backgroundColor: theme.colors.success,
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
}));

export default ChatScreen;
