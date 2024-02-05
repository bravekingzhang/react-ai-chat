// 对话列表页面

import React from "react";
import { FlatList, View } from "react-native";
import { Button, ListItem, makeStyles, Text } from "@rneui/themed";
import useSessionStore from "../store/sessionStore";
import NewSession from "../components/NewSession";
import { router } from "expo-router";
import { ListItemSubtitle } from "@rneui/base/dist/ListItem/ListItem.Subtitle";
import { ListItemContent } from "@rneui/base/dist/ListItem/ListItem.Content";
import { Message } from "../store/sessionTypes";

const Sessions = () => {
  const sessions = useSessionStore((state) => state.sessions);
  const styles = useStyles();

  const deleteSession = (id: string) => () => {
    useSessionStore.getState().deleteSession(id);
  };

  return sessions.length > 0 ? (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={({ item }) => (
          <ListItem.Swipeable
            bottomDivider
            key={item.id}
            onPress={() => {
              router.navigate({
                pathname: "/chat",
                params: { currentSessionId: item.id },
              });
            }}
            leftWidth={0}
            rightContent={(reset) => (
              <Button
                title="Delete"
                onPress={deleteSession(item.id)}
                icon={{ name: "delete", color: "white" }}
                buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
              />
            )}
          >
            <ListItem.Content>
              <View style={styles.model}>
                <Text>{item.settings.model}</Text>
              </View>
              <ListItem.Title>
                <Text style={{ fontWeight: "bold" }}>
                  {item.name ? item.name : "未命名对话"}
                </Text>
              </ListItem.Title>
              <ListItemContent>
                <View style={styles.content}>
                  <Text>{item.messages.length} 条消息</Text>
                  <Text>{getLastMessageTimestamp(item.messages)}</Text>
                </View>
              </ListItemContent>
            </ListItem.Content>
          </ListItem.Swipeable>
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <NewSession />
    </View>
  ) : (
    <NewSession />
  );
};

const getLastMessageTimestamp = (messages: Message[]): string => {
  if (messages.length === 0) {
    return "未开始";
  }
  const lastMessage = messages[messages.length - 1];
  return new Date(lastMessage?.timestamp).toLocaleString();
};

const useStyles = makeStyles((theme, props: { model: string }) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  model: {
    position: "absolute",
    right: 0,
    top: 0,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  content: {
    width: "100%",
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  list: {
    flex: 1,
  },
}));

export default Sessions;
