'use client'

import { FC, useEffect, useRef } from 'react'
import {
  EditorComposer,
  Editor,
  ToolbarPlugin,
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  FloatingLinkEditor,
  FontFamilyDropdown,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  UnderlineButton,
  Divider,
} from 'verbum'



interface NoteViewerProps {
  setContent?: string
  onChange: (content: string) => void
}



const NoteViewer: FC<NoteViewerProps> = (props) => {

  return (
    <EditorComposer >
      <Editor
        hashtagsEnabled={true}
        autoLinkEnabled={true}
        emojisEnabled={true}
        emojiPickerEnabled={true}
        actionsEnabled={true}
      >
        <ToolbarPlugin defaultFontSize="15px">
          <FontFamilyDropdown />
          <FontSizeDropdown
            fontSizeOptions={[
              ['12px', '12px'],
              ['16px', '16px'],
              ['20px', '20px'],
              ['24px', '24px'],
              ['36px', '36px'],
              ['48px', '48px'],
            ]}
          />
          <Divider />
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <CodeFormatButton />
          <InsertLinkButton />
          <TextColorPicker />
          <BackgroundColorPicker />
          <TextFormatDropdown />
          <Divider />
          <InsertDropdown
            enablePoll={true}
            enableTable={true}
            enableImage={{ enable: true, maxWidth: 280 }} // Correct syntax for enableImage
            // enableImage={true, 580}
            enableYoutube={true}
            enableEquations={true}
            enableHorizontalRule={true}
          />
          <Divider />
          <AlignDropdown />
        </ToolbarPlugin>
      </Editor>

      <button
        onClick={() => {
            console.log("props: ", props)
          const editorContent = document.querySelector(
            '.ContentEditable__root'
          )?.innerHTML
          console.log(editorContent)
          props.setContent(editorContent)
        }}
      >
        Submit
      </button>
    </EditorComposer>
  )
}

export default NoteViewer
