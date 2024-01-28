// 对话列表页面

import React from "react";
import { FlatList, View } from "react-native";
import { ListItem, makeStyles, Text } from "@rneui/themed";
import useSessionStore from "../store/sessionStore";
import NewSession from "../components/NewSession";
import { router } from "expo-router";

const Sessions = () => {
  const sessions = useSessionStore((state) => state.sessions);
  const styles = useStyles();

  return sessions.length > 0 ? (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            key={item.id}
            onPress={() => {
              router.navigate({ pathname: "/chat", params: { id: item.id } });
            }}
          >
            <ListItem.Content>
              <ListItem.Title>
                <Text>{item.name}</Text>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
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
