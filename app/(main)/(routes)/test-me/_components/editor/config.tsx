import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import {
  TableCellNode,
  TableNode,
  TableRowNode,
} from './nodes/TableNode/TableNode'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from './nodes/CodeNode'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { HorizontalRuleNode } from './nodes/HorizontalRuleNode/HorizontalRuleNode'
import { MathNode } from './nodes/MathNode'
import { ImageNode } from './nodes/ImageNode/ImageNode'
import { SketchNode } from './nodes/SketchNode/SketchNode'
import { GraphNode } from './nodes/GraphNode'
import { StickyNode } from './nodes/StickyNode/StickyNode'
import theme from './theme'
import { PageBreakNode } from './nodes/PageBreakNode'
import { IFrameNode } from './nodes/IFrameNode/IFrameNode'
import { LayoutContainerNode, LayoutItemNode } from './nodes/LayoutNode'

export const editorConfig = {
  namespace: 'matheditor',
  // The editor theme
  theme: theme,
  // Handling of errors during update
  onError(error: Error) {
    throw error
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    HorizontalRuleNode,
    MathNode,
    ImageNode,
    SketchNode,
    GraphNode,
    StickyNode,
    PageBreakNode,
    IFrameNode,
    LayoutContainerNode,
    LayoutItemNode,
  ],
}
