import React, { useState } from "react";
import { View } from "react-native";
import { Input, Button, Icon, makeStyles, Text } from "@rneui/themed";
import Attachment from "./Attachment";
import UploadAttachment from "./UploadAttachment";

const InputPanel = ({
  onSendMessage,
  onSendAttachmentMessage,
}: {
  onSendMessage: (text: string) => void;
  onSendAttachmentMessage?: (imageUrl: string, text: string) => void;
}) => {
  const [text, setText] = useState("");

  type AttachmentType = {
    uri: string;
    type: string;
  };

  // 构造几个 Attachment 数据
  const [attachments, setAttachments] = useState<AttachmentType[]>([]);

  const styles = useStyles();

  const handleSend = async () => {
    // 发送文本逻辑
    attachments.length <= 0
      ? onSendMessage(text)
      : onSendAttachmentMessage?.(attachments[0].uri, text);
    setText("");
    setAttachments([]);
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
          <UploadAttachment
            onUpload={(uri, type) =>
              setAttachments([...attachments, { uri, type }])
            }
          />
        }
        rightIcon={
          text.length > 0 ? (
            <Icon
              name="send"
              type="material"
              iconStyle={{ alignSelf: "baseline" }}
              onPress={handleSend}
            />
          ) : (
            <></>
          )
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
