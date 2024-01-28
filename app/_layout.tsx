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
import { Tabs } from "expo-router";

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
        <TabLayout />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function TabLayout() {
  const styles = useStyles();
  const { themeMode } = useSettingsStore();
  const { setMode } = useThemeMode();
  React.useEffect(() => {
    console.log(`Setting`, themeMode);
    setMode(themeMode);
  }, [themeMode]);
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "React AI",
          tabBarLabel: "My Chat",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          tabBarItemStyle: {
            backgroundColor: useTheme().theme.colors.background,
          },
          tabBarIcon(props) {
            return <Icon name="chat" {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Completion",
          tabBarLabel: "Completion",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          tabBarItemStyle: {
            backgroundColor: useTheme().theme.colors.background,
          },
          tabBarIcon(props) {
            return <Icon name="chat" {...props} />;
          },
          href: null,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          tabBarItemStyle: {
            backgroundColor: useTheme().theme.colors.background,
          },
          tabBarIconStyle: {
            color: useTheme().theme.colors.secondary,
          },
          tabBarInactiveTintColor: useTheme().theme.colors.grey2,
          tabBarActiveTintColor: useTheme().theme.colors.primary,
          tabBarIcon(props) {
            return <Icon name="settings" {...props} />;
          },
        }}
      />
    </Tabs>
  );
}
const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors.background,
  },
  headerTitleStyle: {
    color: theme.colors.grey2,
  },
}));
