import React from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import useChatSessionStore from "../store/chatSettingStore"; // 假设你有一个 Zustand store 来管理会话状态

const ChatSettings: React.FC = () => {
  const { updateSessionSettings, currentSessionId } = useChatSessionStore();

  // 假设 currentSessionId 是当前选中会话的 ID
  const session = useChatSessionStore((state) =>
    state.sessions.find((session) => session.id === currentSessionId)
  );

  const [model, setModel] = React.useState(
    session?.settings.model || "gpt-3.5-turbo"
  );
  const [temperature, setTemperature] = React.useState(
    session?.settings.temperature.toString() || "0"
  );
  const [maxTokens, setMaxTokens] = React.useState(
    session?.settings.max_tokens.toString() || "0"
  );
  const [topP, setTopP] = React.useState(
    session?.settings.top_p.toString() || "0"
  );
  const [frequencyPenalty, setFrequencyPenalty] = React.useState(
    session?.settings.frequency_penalty.toString() || "0"
  );
  const [presencePenalty, setPresencePenalty] = React.useState(
    session?.settings.presence_penalty.toString() || "0"
  );

  const handleSaveSettings = () => {
    if (currentSessionId) {
      updateSessionSettings(currentSessionId, {
        model,
        temperature: parseFloat(temperature),
        max_tokens: parseInt(maxTokens, 10),
        top_p: parseFloat(topP),
        frequency_penalty: parseFloat(frequencyPenalty),
        presence_penalty: parseFloat(presencePenalty),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Settings</Text>

      <Text>Model</Text>
      <Picker
        selectedValue={model}
        onValueChange={(itemValue) => setModel(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="GPT-3.5 Turbo" value="gpt-3.5-turbo" />
        <Picker.Item label="GPT-3.5" value="gpt-3.5" />
        <Picker.Item label="GPT-3" value="gpt-3" />
        <Picker.Item label="GPT-4" value="gpt-4" />
        <Picker.Item label="Gemini Pro" value="gemini-pro" />
        <Picker.Item label="Gemini Pro Vision" value="gemini-pro-vision" />
      </Picker>

      <Text>Temperature</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTemperature}
        value={temperature}
        keyboardType="numeric"
      />

      <Text>Max Tokens</Text>
      <TextInput
        style={styles.input}
        onChangeText={setMaxTokens}
        value={maxTokens}
        keyboardType="numeric"
      />

      <Text>Top P</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTopP}
        value={topP}
        keyboardType="numeric"
      />

      <Text>Frequency Penalty</Text>
      <TextInput
        style={styles.input}
        onChangeText={setFrequencyPenalty}
        value={frequencyPenalty}
        keyboardType="numeric"
      />

      <Text>Presence Penalty</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPresencePenalty}
        value={presencePenalty}
        keyboardType="numeric"
      />

      <Button title="Save Settings" onPress={handleSaveSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  picker: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 20,
    padding: 10,
  },
});

export default ChatSettings;
