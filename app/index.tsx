// 对话列表页面

import React from "react";
import { FlatList, View } from "react-native";
import { Button, ListItem, makeStyles, Text } from "@rneui/themed";
import useSessionStore from "../store/sessionStore";
import NewSession from "../components/NewSession";
import { router } from "expo-router";
import { ListItemSubtitle } from "@rneui/base/dist/ListItem/ListItem.Subtitle";
import { ListItemContent } from "@rneui/base/dist/ListItem/ListItem.Content";

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
              <ListItem.Title>
                <Text>{item.name}</Text>
              </ListItem.Title>
              <ListItemContent>
                <Text>{item.messages[0].content}</Text>
              </ListItemContent>
              <ListItemSubtitle>
                <Text>{item.messages.length} messages</Text>
              </ListItemSubtitle>
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

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    flex: 1,
  },
}));

export default Sessions;
