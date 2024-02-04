import React, { useMemo } from "react";
import RenderHtml from "react-native-render-html";
import * as showdown from "showdown";

import { Content } from "../store/sessionTypes";
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
  return (
    <RenderHtml
      tagsStyles={markdownStyles}
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
