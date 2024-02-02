import { makeStyles } from "@rneui/themed";
import { Platform } from "react-native";

// this is converted to a stylesheet internally at run time with StyleSheet.create(
export const useMarkdownStyles = makeStyles((theme) => ({
  // Believe these are never used but retained for completeness
  pre: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ["ios"]: {
        fontFamily: "Courier",
      },
      ["android"]: {
        fontFamily: "monospace",
      },
    }),
  },
  inline: {},
  span: {},
}));
