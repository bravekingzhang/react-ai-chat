import React, { useMemo } from "react";
import RenderHtml from "react-native-render-html";
import * as showdown from "showdown";

import { Content } from "../store/sessionTypes";
import { useTheme } from "@rneui/themed";
export default function HtmlView({
  contents,
  width,
  markdownStyles,
}: {
  contents: Content[];
  width: number;
  markdownStyles: any;
}) {
  const html = useMemo(() => buildHtmlMessage(contents), contents);
  const theme = useTheme();
  const black = useMemo(() => theme.theme.colors.black, []);
  return (
    <RenderHtml
      tagsStyles={{
        // Believe these are never used but retained for completeness
        pre: {
          backgroundColor: "#f5f5f5",
          padding: 10,
          borderRadius: 4,
        },
        code: {
          fontFamily: "monospace",
        },
        p: {
          color: black,
        },
        img: {
          width: "100%",
          height: 200,
          resizeMode: "cover",
        },
        inline: {},
        span: {},
      }}
      source={{ html: html }}
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
  return html;
}
