import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { ListItem, Button, Input, makeStyles } from "@rneui/themed";
import useChatSessionStore from "../store/sessionStore";
import {
  ModelOption,
  ModelValues,
  SessionSetting,
  getModelOptions,
} from "../store/sessionTypes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";

const ChatSettings: React.FC = () => {
  const { updateSessionSettings, currentSessionId } = useChatSessionStore();
  const session = useChatSessionStore((state) =>
    state.sessions.find((session) => session.id === currentSessionId)
  );

  const [settings, setSettings] = useState<SessionSetting>(
    session?.settings || {
      model: "gpt-3.5-turbo" as ModelValues,
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      auto_press: true,
      max_length_history_message: 4,
    }
  );

  const updateSetting = <K extends keyof SessionSetting>(
    key: K,
    value: SessionSetting[K]
  ) => {
    console.log(`updateSetting: ${key} = ${value}`);
    setSettings((prevSettings) => ({ ...prevSettings, [key]: value }));
  };

  const handleSaveSettings = () => {
    if (currentSessionId) {
      updateSessionSettings(currentSessionId, settings);
    }
    router.back();
  };

  const settingItems = [
    {
      key: "model",
      label: "Model",
      type: "picker",
      options: getModelOptions(),
    },
    { key: "temperature", label: "模型温度，越高就越随机", type: "input" },
    { key: "max_tokens", label: "回复最大的字符数", type: "input" },
    { key: "top_p", label: "Top P", type: "input" },
    {
      key: "frequency_penalty",
      label: "值越大，越可能降低重复词",
      type: "input",
    },
    {
      key: "presence_penalty",
      label: "值越大，越可能扩展到新的话题",
      type: "input",
    },
    { key: "auto_press", label: "自动压缩历史对话", type: "switch" },
    {
      key: "max_length_history_message",
      label: "携带历史对话最大长度",
      type: "input",
    },
  ];

  const styles = useStyles();

  type SettingItem = {
    key: string;
    label: string;
    type: string;
    options?: ModelOption[];
  };

  const renderItem = ({ item }: { item: SettingItem }) => {
    switch (item.type) {
      case "picker":
        return (
          <ListItem bottomDivider>
            <ListItem.Content style={styles.content}>
              <ListItem.Title>{item.label}</ListItem.Title>
              <Picker
                selectedValue={
                  settings[item.key as keyof SessionSetting] as ModelValues
                }
                onValueChange={(value) =>
                  updateSetting(item.key as keyof SessionSetting, value)
                }
                style={styles.picker}
              >
                {item?.options?.map((option) => (
                  <Picker.Item
                    label={option.label}
                    value={option.value}
                    key={option.value}
                  />
                ))}
              </Picker>
            </ListItem.Content>
          </ListItem>
        );
      case "switch":
        return (
          <ListItem bottomDivider>
            <ListItem.Content style={styles.content}>
              <ListItem.Title style={styles.title}>{item.label}</ListItem.Title>
              <ListItem.CheckBox
                checked={settings[item.key as keyof SessionSetting] as boolean}
                onPress={() =>
                  updateSetting(
                    item.key as keyof SessionSetting,
                    !settings[item.key as keyof SessionSetting]
                  )
                }
              />
            </ListItem.Content>
          </ListItem>
        );
      case "input":
        return (
          <ListItem bottomDivider>
            <ListItem.Content style={styles.content}>
              <ListItem.Title style={styles.title}>{item.label}</ListItem.Title>
              <Input
                onChangeText={(value) =>
                  updateSetting(item.key as keyof SessionSetting, value as any)
                }
                value={settings[item.key as keyof SessionSetting]?.toString()}
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                errorStyle={styles.inputError}
              />
            </ListItem.Content>
          </ListItem>
        );
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={settingItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListFooterComponent={
          <Button
            title="Save Settings"
            onPress={handleSaveSettings}
            radius={5}
            type="outline"
          />
        }
        ListFooterComponentStyle={styles.buttonContainer}
      />
    </GestureHandlerRootView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    backgroundColor: theme.colors.grey5,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
  },
  picker: {
    width: "100%",
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  input: {
    marginBottom: 0,
  },
  inputError: {
    display: "none",
  },
  buttonContainer: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.spacing.md,
  },
}));

export default ChatSettings;
