/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedEditorState,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $getRoot, DecoratorNode, createEditor, isHTMLElement } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';
import { editorConfig } from './config';
import { $generateHtmlFromNodes } from '../../utils/html';
import StickyComponent from './StickyComponent';

type StickyNoteColor = 'pink' | 'yellow';

export interface StickyPayload {
  color?: StickyNoteColor;
  /**
* @deprecated use editor instead
*/
  data?: SerializedEditorState;
  editor?: SerializedEditor;
}

export type SerializedStickyNode = Spread<
  {
    color: StickyNoteColor;
    data?: SerializedEditorState;
    editor: SerializedEditor
  },
  SerializedLexicalNode
>;

export class StickyNode extends DecoratorNode<JSX.Element> {
  __color: StickyNoteColor;
  __data?: SerializedEditorState;
  __editor: LexicalEditor;

  static getType(): string {
    return 'sticky';
  }

  static clone(node: StickyNode): StickyNode {
    return new StickyNode(
      node.__color,
      node.__editor,
      node.__key,
    );
  }
  static importJSON(serializedNode: SerializedStickyNode): StickyNode {
    const { color, data, editor } = serializedNode;
    const node = $createStickyNode({ color });
    const nestedEditor = node.__editor;
    try {
      const editorState = nestedEditor.parseEditorState(editor?.editorState ?? data);
      if (!editorState.isEmpty()) {
        nestedEditor.setEditorState(editorState);
      }
    } catch (e) { console.error(e) }
    return node;
  }

  constructor(
    color: StickyNoteColor,
    editor?: LexicalEditor,
    key?: NodeKey,
  ) {
    super(key);
    this.__editor = editor ?? createEditor(editorConfig);
    this.__color = color;
  }

  exportJSON(): SerializedStickyNode {
    return {
      editor: this.__editor.toJSON(),
      color: this.__color,
      type: 'sticky',
      version: 1,
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const { element } = super.exportDOM(editor);
    if (element && isHTMLElement(element)) {
      this.__editor.getEditorState().read(() => {
        const html = $generateHtmlFromNodes(this.__editor);
        element.innerHTML = `<div class="sticky-note-container" theme="light"><div class="sticky-note ${this.__color}"><div class="nested-contentEditable">${html}</div></div></div>`
      });
    }
    return { element };
  };

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'sticky-note-wrapper';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getEditor(): LexicalEditor {
    return this.__editor;
  }

  setEditor(editor: LexicalEditor): void {
    const writable = this.getWritable();
    writable.__editor = editor;
  }

  toggleColor(): void {
    const writable = this.getWritable();
    writable.__color = writable.__color === 'pink' ? 'yellow' : 'pink';
  }

  select() {
    const editor = this.getEditor();
    editor.update(() => {
      const root = $getRoot();
      root.selectStart();
    });
  }

  decorate(): JSX.Element {
    return <Suspense fallback={null}>
      <StickyComponent
        color={this.__color}
        nodeKey={this.getKey()}
        stickyEditor={this.__editor}
      />
    </Suspense>;
  }

  isIsolated(): true {
    return true;
  }
}

export function $isStickyNode(
  node: LexicalNode | null | undefined,
): node is StickyNode {
  return node instanceof StickyNode;
}

export function $createStickyNode(payload?: StickyPayload): StickyNode {
  const color = payload?.color || 'yellow';
  const node = new StickyNode(color);
  if (payload?.editor) {
    const nestedEditor = node.__editor;
    const editorState = nestedEditor.parseEditorState(payload.editor.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
  }
  return node;
}
