import React, { useMemo } from "react";
import RenderHtml from "react-native-render-html";
import * as showdown from "showdown";

import { Content } from "../store/sessionTypes";
import { ColorValue } from "react-native";
export default function HtmlView({
  contents,
  width,
  color,
}: {
  contents: Content[];
  width: number;
  color: ColorValue;
}) {
  const html = useMemo(() => buildHtmlMessage(contents), contents);
  const tagsStyles = React.useMemo(
    () => ({
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
        color: color,
      },
      img: {
        width: "100%",
        height: 200,
      },
      inline: {},
      span: {},
    }),
    [color]
  );
  return (
    <RenderHtml
      tagsStyles={tagsStyles}
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
