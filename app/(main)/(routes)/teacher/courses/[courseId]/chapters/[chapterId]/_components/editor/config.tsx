import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import {
  TableCellNode,
  TableNode,
  TableRowNode,
} from './nodes/TableNode/TableNode'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from './nodes/CodeNode'
import { CollapsibleContainerNode } from './plugins/CollapsiblePluging/CollapsibleContainerNode'
import { CollapsibleContentNode } from './plugins/CollapsiblePluging/CollapsibleContentNode'
import { CollapsibleTitleNode } from './plugins/CollapsiblePluging/CollapsibleTitleNode'
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
import { YouTubeNode } from './nodes/YouTubeNode'
import { AlertNode } from './nodes/AlertNode/AlertNode'

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
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
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
    AlertNode,
    PageBreakNode,
    IFrameNode,
    LayoutContainerNode,
    LayoutItemNode,
    YouTubeNode,
  ],
}
