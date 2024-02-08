// import { Inter } from 'next/font/google';
import NextImage from 'next/image'

import { useEffect, useState } from 'react'
import YooptaEditor from '@yoopta/editor'

import Paragraph from '@yoopta/paragraph'
import Blockquote from '@yoopta/blockquote'
import Code from '@yoopta/code'
import Embed from '@yoopta/embed'
import Image from '@yoopta/image'
import Link from '@yoopta/link'
import File from '@yoopta/file'
import Callout from '@yoopta/callout'
import Video from '@yoopta/video'
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists'
import { Bold, Italic, CodeMark, Underline, Strike } from '@yoopta/marks'
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings'

import LinkTool from '@yoopta/link-tool'
import ActionMenu from '@yoopta/action-menu-list'
import Toolbar from '@yoopta/toolbar'

// import { uploadToCloudinary } from '@/utils/cloudinary'
import { YooptaValue } from '@/lib/yopta/initialData'


// list of plugins should be placed outside component
const plugins = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  Code,
  Link,
  NumberedList,
  BulletedList,
  TodoList,
  File.extend({
    // options: {
    //   onUpload: async (file: File) => {
    //     const response = await uploadToCloudinary(file, 'auto')
    //     return { url: response.url }
    //   },
    // },
  }),
  Embed.extend({
    options: {
      maxWidth: 650,
      maxHeight: 750,
    },
  }),
  Image.extend({
    // options: {
    //   maxWidth: 650,
    //   maxHeight: 650,
    //   onUpload: async (file: File) => {
    //     const response = await uploadToCloudinary(file, 'image')
    //     return {
    //       url: response.url,
    //       width: response.data.width,
    //       height: response.data.height,
    //     }
    //   },
    // },
  }),
  Video.extend({
    // options: {
    //   maxWidth: 650,
    //   maxHeight: 650,
    //   onUpload: async (file: File) => {
    //     const response = await uploadToCloudinary(file, 'video')
    //     return {
    //       url: response.url,
    //       width: response.data.width,
    //       height: response.data.height,
    //     }
    //   },
    // },
  }),
]

// tools should be placed outside your component
const TOOLS = {
  Toolbar: <Toolbar />,
  ActionMenu: <ActionMenu />,
  LinkTool: <LinkTool />,
}


interface EditorProps {
  value: YooptaValue[]
  onChange: (value: YooptaValue[]) => void
}


export default function Editor({ value, onChange }: EditorProps) {
  // const [editorContent, setEditorContent] = useState(value)
  // const [editorValue, setEditorValue] = useState<YooptaValue[]>(initalValue)
  // list of marks should be placed inside your component
  const marks = [Bold, Italic, CodeMark, Underline, Strike]

  // console.log('yopta val: ', editorContent)

  // Update the editor content when the value prop changes
  // useEffect(() => {
  //   setEditorContent(value)
  // }, [value])

  return (
    // <main
    //   style={{ padding: '5rem 0' }}
    //   className={`flex min-h-screen w-full h-full flex-col items-center justify-between p-24`}
    // >
    <div className="w-full h-full bg-white p-2">
      <YooptaEditor<any>
        // value={editorValue}
        value={value}
        // onChange={(val: YooptaValue[]) => setEditorValue(val)}
        onChange={onChange}
        plugins={plugins}
        marks={marks}
        placeholder="Tippe '/' zum starten..."
        tools={TOOLS}
        // offline="withBasicExample"
      />
    </div>
    // </main>
  )
}
