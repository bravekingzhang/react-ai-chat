import { Icon, ThemeProvider, createTheme, useTheme } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Stack } from "expo-router/stack";
import { Platform } from "react-native";
import React from "react";
import { router } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

// import { queryClient } from "../query/queryClient";

// if (__DEV__) {
//   // @ts-ignore
//   import("../query/reactotron");
// }

// export const unstable_settings = {
//   // Ensure any route can link back to `/`
//   initialRouteName: "index",
// };

const queryClient = new QueryClient();
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {Platform.OS === "web" && <ReactQueryDevtools />}
        <RootSiblingParent>
          <StackNavigator />
        </RootSiblingParent>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function StackNavigator() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.theme.colors.background,
        },
        headerTintColor: theme.theme.colors.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        statusBarColor: theme.theme.colors.primary,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Chats",
          headerRight(props) {
            return (
              <Icon
                name="cog"
                type="font-awesome"
                color={theme.theme.colors.primary}
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
                color={theme.theme.colors.primary}
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
  );
}
