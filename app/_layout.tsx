import {
  Icon,
  ThemeProvider,
  createTheme,
  makeStyles,
  useTheme,
} from "@rneui/themed";
import { Tabs } from "expo-router/tabs";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

export default function AppLayout() {
  return (
    <ThemeProvider theme={theme}>
      <TabLayout />
    </ThemeProvider>
  );
}

function TabLayout() {
  const styles = useStyles();
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
