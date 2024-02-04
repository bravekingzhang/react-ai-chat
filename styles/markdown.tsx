import { Platform, StyleSheet } from "react-native";

const markdownStyles = StyleSheet.create({
  // Believe these are never used but retained for completeness
  pre: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
  },
  code: {
    fontFamily: "monospace",
  },
  p: {},
  img: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  inline: {},
  span: {},
});

// this is converted to a stylesheet internally at run time with StyleSheet.create(
// const useMarkdownStyles = makeStyles((theme) => ({
//   // Believe these are never used but retained for completeness
//   pre: {
//     backgroundColor: "#f5f5f5",
//     padding: 10,
//     borderRadius: 4,
//     ...Platform.select({
//       ["ios"]: {
//         fontFamily: "Courier",
//       },
//       ["android"]: {
//         fontFamily: "monospace",
//       },
//     }),
//   },
//   code: {
//     fontFamily: "monospace",
//   },
//   p: {
//     color: theme.colors.black,
//   },
//   img: {
//     width: "100%",
//     height: 200,
//     resizeMode: "cover",
//   },
//   inline: {},
//   span: {},
// }));

export { markdownStyles };
