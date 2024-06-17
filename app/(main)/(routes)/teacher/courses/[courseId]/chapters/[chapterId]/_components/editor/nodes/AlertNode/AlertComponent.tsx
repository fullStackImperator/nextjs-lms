'use client'
import {
  NodeKey,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  $getNodeByKey,
  $setSelection,
} from 'lexical'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import './AlertNode.css'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useRef, useState } from 'react'
import { editorConfig } from './config'
import dynamic from 'next/dynamic'
import { IconButton } from '@mui/material'
import { Delete, FormatPaint, DragIndicator } from '@mui/icons-material'
import { $isAlertNode } from './AlertNode'

const NestedEditor = dynamic(() => import('../../NestedEditor'), { ssr: false })

export default function AlertComponent({
  nodeKey,
  color,
  alertEditor,
}: {
  alertEditor: LexicalEditor
  color: 'pink' | 'yellow' | 'blue' | 'green' | 'red'
  nodeKey: NodeKey
}): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey)

  const alertContainerRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          if (activeEditor !== alertEditor) clearSelection()
          return true
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [isSelected])

  const clearSelection = () => {
    alertEditor.update(() => {
      $setSelection(null)
    })
  }

  const handleDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (node) {
        node.remove()
      }
    })
  }

  const handleColorChange = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (!$isAlertNode(node)) return
      node.toggleColor()
    })
  }

  const onChange = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (!$isAlertNode(node)) return
      node.setEditor(alertEditor)
    })
  }

  return (
    <div
      ref={alertContainerRef}
      className="alert-note-container"
      draggable={isSelected}
      {...{ theme: 'light' }}
    >
      <div className="alert-tools">
        <IconButton
          sx={{ displayPrint: 'none' }}
          onClick={handleDelete}
          aria-label="Delete alert note"
          title="Delete"
          color="inherit"
          size="small"
        >
          <Delete fontSize="inherit" />
        </IconButton>
        <IconButton
          sx={{ displayPrint: 'none' }}
          color="inherit"
          size="small"
          aria-label="Change alert color"
          title="Color"
          onClick={handleColorChange}
        >
          <FormatPaint fontSize="inherit" />
        </IconButton>
        <IconButton
          className="drag-btn"
          sx={{ displayPrint: 'none', mr: 'auto' }}
          color="inherit"
          size="small"
          aria-label="Drag alert note"
          title="Drag"
          onMouseDown={() => setSelected(true)}
          onMouseUp={() => setSelected(false)}
        >
          <DragIndicator fontSize="inherit" />
        </IconButton>
      </div>
      <div className={`alert-note ${color}`}>
        <NestedEditor
          initialEditor={alertEditor}
          initialNodes={editorConfig.nodes}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
