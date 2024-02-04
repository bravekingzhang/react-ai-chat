import React, { useState, useRef } from "react";
import { View, Keyboard } from "react-native";
import { Input, Icon, makeStyles, InputProps } from "@rneui/themed";
import Attachment from "./Attachment";
import UploadAttachment from "./UploadAttachment";

const InputPanel = ({
  showAttachment,
  onSendMessage,
  onSendAttachmentMessage,
}: {
  showAttachment: boolean;
  onSendMessage: (text: string) => void;
  onSendAttachmentMessage?: (imageUrl: string, text: string) => void;
}) => {
  const [text, setText] = useState("");

  // const inputRef = React.createRef<any>();
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
    // inputRef.current?.blue();
    Keyboard.dismiss();
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
        // ref={inputRef}
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
          showAttachment ? (
            <UploadAttachment
              onUpload={(uri, type) =>
                setAttachments([...attachments, { uri, type }])
              }
            />
          ) : (
            <></>
          )
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
