import {
  Icon,
  ThemeProvider,
  createTheme,
  makeStyles,
  useTheme,
  useThemeMode,
} from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Stack } from "expo-router/stack";
import { Platform } from "react-native";
import useSettingsStore from "../store/settingsStore";
import React from "react";
import { Tabs, router } from "expo-router";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

// import { queryClient } from "../query/queryClient";

// if (__DEV__) {
//   // @ts-ignore
//   import("../query/reactotron");
// }

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function App() {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {Platform.OS === "web" && <ReactQueryDevtools />}
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Chats",
              headerRight(props) {
                return (
                  <Icon
                    name="cog"
                    type="font-awesome"
                    onPress={() => {
                      router.navigate("setting");
                    }}
                  />
                );
              },
            }}
          />
          <Stack.Screen
            name="chat"
            options={{
              title: "Chat",
              headerRight(props) {
                return (
                  <Icon
                    name="cog"
                    type="font-awesome"
                    onPress={() => {
                      router.navigate("chatSetting");
                    }}
                  />
                );
              },
            }}
          />
          <Stack.Screen name="setting" options={{ title: "Settings" }} />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
