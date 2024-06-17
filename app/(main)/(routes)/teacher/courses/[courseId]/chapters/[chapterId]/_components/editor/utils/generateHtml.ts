import type { SerializedEditorState } from "lexical";
import { createHeadlessEditor } from "@lexical/headless";
import { editorConfig } from "../config";
import { $generateHtmlFromNodes } from "./html";
import { parseHTML } from "linkedom";

const editor = createHeadlessEditor(editorConfig);

export const generateHtml = (data: SerializedEditorState) => new Promise<string>((resolve, reject) => {
  if (typeof window === "undefined") {
    const dom = parseHTML("<!DOCTYPE html><html><head></head><body></body></html>");
    global = dom;
    global.document = dom.document;
    global.DocumentFragment = dom.DocumentFragment;
    global.Element = dom.Element;
  }
  try {
    const editorState = editor.parseEditorState(data);
    editor.setEditorState(editorState);
    editorState.read(() => {
      let html = $generateHtmlFromNodes(editor);
      const stickyRegex = /<p\b[^>]*>(?:(?!<\/p>).)*<div\b[^>]*class="sticky-note-wrapper"[^>]*>(?:(?!<\/div>).)*<\/div>(?:(?!<\/p>).)*<\/p>/gs;
      const alertRegex = /<p\b[^>]*>(?:(?!<\/p>).)*<div\b[^>]*class="alert-note-wrapper"[^>]*>(?:(?!<\/div>).)*<\/div>(?:(?!<\/p>).)*<\/p>/gs;
      const figureRegex = /<p\b[^>]*>(?:(?!<\/p>).)*<figure\b[^>]*>(?:(?!<\/figure>).)*<\/figure>(?:(?!<\/p>).)*<\/p>/gs;
      const stickies = html.match(stickyRegex) || [];
      const alerts = html.match(alertRegex) || [];
      const figures = html.match(figureRegex) || [];
      [...stickies, ...alerts, ...figures].forEach((match) => html = html.replace(match, match.replace(/^<p/, '<div').replace(/<\/p>$/, '</div>')));
      resolve(html);
    });
  } catch (error) {
    reject(error);
  }
});
