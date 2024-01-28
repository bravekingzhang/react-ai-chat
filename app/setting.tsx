import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  ListItem,
  ListItemProps,
  Switch,
  useThemeMode,
  makeStyles,
} from "@rneui/themed";
import useSettingsStore from "../store/settingsStore";

const Settings: React.FunctionComponent<ListItemProps> = () => {
  const { setMode, mode } = useThemeMode();

  const { apiKey, baseURL, themeMode, setApiKey, setBaseURL, setThemeMode } =
    useSettingsStore();
  const [isDark, setIsDark] = useState(themeMode === "dark");
  const switchTheme = () => {
    setThemeMode(mode === "dark" ? "light" : "dark");
    setMode(mode === "dark" ? "light" : "dark");
  };

  const styles = useStyles();

  return (
    <>
      <FlatList
        style={styles.container}
        data={[]}
        renderItem={() => <></>}
        ListHeaderComponent={
          <>
            <View style={styles.list}>
              <ListItem bottomDivider>
                <ListItem.Content style={{ flex: 0 }}>
                  <ListItem.Title>Api key</ListItem.Title>
                </ListItem.Content>
                <ListItem.Input
                  placeholder="Please type your api key here"
                  style={styles.input}
                  multiline
                  onChange={(e) => setApiKey(e.nativeEvent.text)}
                  defaultValue={apiKey}
                  secureTextEntry
                />
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.Content style={{ flex: 0 }}>
                  <ListItem.Title>Base url</ListItem.Title>
                </ListItem.Content>
                <ListItem.Input
                  placeholder="starts with https://"
                  multiline
                  style={styles.input}
                  defaultValue={baseURL}
                  onChange={(e) => setBaseURL(e.nativeEvent.text)}
                />
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>
                    {mode === "dark" ? "Dark style" : "Light style"}
                  </ListItem.Title>
                </ListItem.Content>
                <Switch
                  value={isDark}
                  onValueChange={(value) => {
                    setIsDark(value);
                    switchTheme();
                  }}
                />
              </ListItem>
              {/* <ListItem bottomDivider>
                <ListItem.Content>
                  <Completion></Completion>
                </ListItem.Content>
              </ListItem> */}
            </View>
          </>
        }
      />
    </>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    list: {
      borderTopWidth: 1,
      borderColor: theme.colors.background,
    },
    input: {
      fontSize: 15,
    },
    subtitleView: {
      flexDirection: "row",
      paddingLeft: 10,
      paddingTop: 5,
    },
    ratingImage: {
      height: 19.21,
      width: 100,
    },
    ratingText: {
      paddingLeft: 10,
      color: "grey",
    },
  };
});

export default Settings;
