import {
  Icon,
  ThemeProvider,
  createTheme,
  makeStyles,
  useTheme,
  useThemeMode,
} from "@rneui/themed";
import { Tabs } from "expo-router/tabs";
import useSettingsStore from "../store/settingsStore";
import React from "react";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Platform } from "react-native";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

import { queryClient } from "../query/queryClient";

if (__DEV__) {
  // @ts-ignore
  import("../query/reactotron");
}

export default function AppLayout() {
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
        // Name of the route to hide.
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
          // This tab will no longer show up in the tab bar.
          href: "/",
        }}
      />
      <Tabs.Screen
        // Name of the route to hide.
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
          // This tab will no longer show up in the tab bar.
          href: "/setting",
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
