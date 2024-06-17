/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use client'
// import './index.css'
import type {
  LexicalEditor,
} from 'lexical'
import { ChangeEvent, useCallback, useEffect, useRef, useState , memo} from 'react'

import { INSERT_YOUTUBE_COMMAND } from '../../YouTubePlugin'
import { $isYouTubeNode } from '../../../nodes/YouTubeNode'
import { Button } from '@mui/material'
import TextInput from '@/components/ui/yt-text-input'


// Taken from https://stackoverflow.com/a/9102270
const YOUTUBE_ID_PARSER =
  /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

const parseYouTubeVideoID = (url: string) => {
  const urlMatches = url.match(YOUTUBE_ID_PARSER);

  return urlMatches?.[2].length === 11 ? urlMatches[2] : null;
};


export function InsertYouTubeDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor
  onClose: () => void
}): JSX.Element {
  const [text, setText] = useState('')

  const onClick = () => {
    const videoID = parseYouTubeVideoID(text)
    if (videoID) {
      activeEditor.dispatchCommand(INSERT_YOUTUBE_COMMAND, videoID)
    }
    onClose()
  }

  const isDisabled = text === '' || !parseYouTubeVideoID(text)

  return (
    <>
      <TextInput
        data-test-id="youtube-embed-modal-url"
        label="YouTube URL"
        placeholder="i.e. https://www.youtube.com/watch?v=jNQXAC9IVRw"
        onChange={setText}
        value={text}
      />
      <div className="ToolbarPlugin__dialogActions">
        <Button
          data-test-id="youtube-embed-modal-submit-btn"
          disabled={isDisabled}
          onClick={onClick}
        >
          Confirm
        </Button>
      </div>
    </>
  )
}


// export default InsertYouTubeDialog



// 'use client'
// import { $getSelection, $setSelection, LexicalEditor } from 'lexical'
// import React, { memo, useEffect, useState } from 'react'
// import { SET_DIALOGS_COMMAND } from './commands'
// import useFixedBodyScroll from '../../../../hooks/useFixedBodyScroll'
// import { useTheme } from '@mui/material/styles'
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   FormControlLabel,
//   IconButton,
//   Switch,
//   TextField,
//   useMediaQuery,
// } from '@mui/material'
// import { INSERT_IFRAME_COMMAND } from '../../IFramePlugin'
// import { IFrameNode } from '../../../nodes/IFrameNode/IFrameNode'
// import { YouTubeNode } from '../../../nodes/YouTubeNode'
// import { INSERT_YOUTUBE_COMMAND } from '../../YouTubePlugin'
// import { $isYouTubeNode } from '../../../nodes/YouTubeNode'

// function YouTubeialog({
//   editor,
//   node,
//   open,
// }: {
//   editor: LexicalEditor
//   node: YouTubeNode | null
//   open: boolean
// }) {
//   const theme = useTheme()
//   const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
//   const [formData, setFormData] = useState({
//     src: '',
//     altText: 'youtube',
//     width: 560,
//     height: 315,
//     showCaption: true,
//   })
//   useEffect(() => {
//     if (!open) return
//     if (node) {
//       setFormData({
//         src: node.getSrc(),
//         altText: node.getAltText(),
//         width: node.getWidth(),
//         height: node.getHeight(),
//         showCaption: node.getShowCaption(),
//       })
//     } else {
//       setFormData({
//         src: '',
//         altText: 'iframe',
//         width: 560,
//         height: 315,
//         showCaption: true,
//       })
//     }
//   }, [node, open])

//   const updateFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target
//     if (name === 'showCaption') {
//       setFormData({ ...formData, [name]: event.target.checked })
//     } else setFormData({ ...formData, [name]: value })
//   }

//   const handleSubmit = (
//     event:
//       | React.FormEvent<HTMLFormElement>
//       | React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.preventDefault()
//     if (!node) editor.dispatchCommand(INSERT_IFRAME_COMMAND, formData)
//     else editor.update(() => node.update(formData))
//     closeDialog()
//     setTimeout(() => {
//       editor.focus()
//     }, 0)
//   }

//   const closeDialog = () => {
//     editor.dispatchCommand(SET_DIALOGS_COMMAND, { iframe: { open: false } })
//   }

//   const restoreSelection = () => {
//     editor.getEditorState().read(() => {
//       const selection = $getSelection()?.clone() ?? null
//       editor.update(() => $setSelection(selection))
//     })
//   }

//   const handleClose = () => {
//     closeDialog()
//     restoreSelection()
//   }

//   useFixedBodyScroll(open)

//   return (
//     <Dialog
//       open={open}
//       fullScreen={fullScreen}
//       onClose={handleClose}
//       aria-labelledby="iFrame-dialog-title"
//       disableEscapeKeyDown
//     >
//       <DialogTitle id="iFrame-dialog-title">Insert IFrame</DialogTitle>
//       <DialogContent>
//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             size="small"
//             fullWidth
//             value={formData.src}
//             onChange={updateFormData}
//             label="Embed URL"
//             name="src"
//             autoComplete="src"
//             autoFocus
//           />
//           <TextField
//             margin="normal"
//             size="small"
//             fullWidth
//             value={formData.altText}
//             onChange={updateFormData}
//             label="Alt Text"
//             name="altText"
//             autoComplete="altText"
//           />
//           <TextField
//             margin="normal"
//             size="small"
//             fullWidth
//             value={formData.width}
//             onChange={updateFormData}
//             label="Width"
//             name="width"
//             autoComplete="width"
//           />
//           <TextField
//             margin="normal"
//             size="small"
//             fullWidth
//             value={formData.height}
//             onChange={updateFormData}
//             label="Height"
//             name="height"
//             autoComplete="height"
//           />
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={formData.showCaption}
//                 onChange={updateFormData}
//               />
//             }
//             label="Show Caption"
//             name="showCaption"
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button autoFocus onClick={handleClose}>
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} disabled={!formData.src}>
//           Confirm
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default memo(IFrameDialog)