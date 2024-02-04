import React from "react";
import RenderHtml from "react-native-render-html";
import * as showdown from "showdown";
import { makeStyles } from "@rneui/themed";
import { Platform } from "react-native";

import { Content } from "../store/sessionTypes";

export default function HtmlView({
  contents,
  width,
}: {
  contents: Content[];
  width: number;
}) {
  const markdownStyles = useMarkdownStyles();
  return (
    <RenderHtml
      tagsStyles={markdownStyles}
      source={{ html: buildHtmlMessage(contents) }}
      contentWidth={width * 0.8}
    ></RenderHtml>
  );
}

function buildHtmlMessage(contents: Content[]): string {
  let result = "";
  for (const item of contents) {
    if (item.type === "text") {
      result += item.text;
    } else if (item.type === "image_url") {
      result += `![image](${item.text})`;
    }
  }
  const converter = new showdown.Converter();
  const html = converter.makeHtml(result);
  console.log("html", html);
  return html;
}

// this is converted to a stylesheet internally at run time with StyleSheet.create(
const useMarkdownStyles = makeStyles((theme) => ({
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
  code: {
    fontFamily: "monospace",
  },
  p: {
    color: theme.colors.black,
  },
  img: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  inline: {},
  span: {},
}));
