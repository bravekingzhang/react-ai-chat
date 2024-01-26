import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { ListItem, makeStyles } from "@rneui/themed";
import InputPanel from "../components/InputPanel"; // 确保正确导入 InputPanel 组件

const ChatScreen = () => {
  const styles = useStyles();
  const [messages, setMessages] = useState([
    // 测试数据，实际开发中应从后端获取
    { id: "1", text: "Hello there!" },
    { id: "2", text: "Hi! How can I help you?" },
    { id: "3", text: "I'd like to know more about your products." },
    { id: "4", text: "Sure, I can help you with that." },
    { id: "5", text: "Thank you." },
    { id: "6", text: "You're welcome." },
    {
      id: "7",
      text: "Bye!I'd like to know more about your products.I'd like to know more about your products.I'd like to know more about your products.I'd like to know more about your products.",
    },
    { id: "8", text: "Bye!" },
    { id: "9", text: "Bye!" },
    { id: "10", text: "Bye!" },
    { id: "11", text: "give me more message" },
  ]);

  type ItemType = (typeof messages)[0];
  const renderItem = ({ item }: { item: ItemType }) => (
    // Code inside the function

    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.text}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <InputPanel />
    </View>
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

export default ChatScreen;
