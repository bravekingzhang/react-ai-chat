import React, { useState } from "react";
import { View } from "react-native";
import { Input, Button, Icon, makeStyles, Text } from "@rneui/themed";
import Attachment from "./Attachment";

const InputPanel = () => {
  const [text, setText] = useState("");

  type AttachmentType = {
    uri: string;
    type: string;
  };

  // 构造几个 Attachment 数据
  const [attachments, setAttachments] = useState<AttachmentType[]>([
    {
      uri: "https://picsum.photos/200/400",
      type: "image",
    },
    {
      uri: "https://picsum.photos/200/300",
      type: "image",
    },
    {
      uri: "https://picsum.photos/200/500",
      type: "file",
    },
  ]);

  const styles = useStyles();

  const handleSend = () => {
    // 发送文本逻辑
    console.log("Sending Text: ", text);
    setText("");
  };

  const handleAttach = () => {
    // 附件添加逻辑
    console.log("Attach file");
  };

  return (
    <View style={styles.container}>
      <View style={styles.attachments}>
        {attachments.map((item) => (
          <Attachment
            key={item.uri}
            uri={item.uri}
            type={item.type}
            onRemove={(uri) =>
              setAttachments(attachments.filter((item) => item.uri !== uri))
            }
          />
        ))}
      </View>
      <Input
        placeholder="Type a message..."
        value={text}
        multiline
        onChangeText={setText}
        inputContainerStyle={{
          borderBottomWidth: 0,
        }}
        errorStyle={{
          display: "none",
        }}
        leftIcon={
          <Icon name="attachment" type="material" onPress={handleAttach} />
        }
        rightIcon={
          <Icon
            name="send"
            type="material"
            iconStyle={{ alignSelf: "baseline" }}
            onPress={handleSend}
          />
        }
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.greyOutline,
    borderRadius: 5,
    margin: theme.spacing.md,
  },
  attachments: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
}));

export default InputPanel;