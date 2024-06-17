
'use client'
import { JsonObject, JsonArray } from 'type-fest'
import YooptaEditor, {
  createYooptaEditor,
  Elements,
  Blocks,
  useYooptaEditor,
} from '@yoopta/editor'
import { YooEditor, YooptaContentValue } from '@yoopta/editor/dist/editor/types'

import Paragraph from '@yoopta/paragraph'
import Blockquote from '@yoopta/blockquote'
import Embed from '@yoopta/embed'
import Image from '@yoopta/image'
import Link from '@yoopta/link'
import Callout from '@yoopta/callout'
import Video from '@yoopta/video'
import File from '@yoopta/file'
import Accordion from '@yoopta/accordion'
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists'
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from '@yoopta/marks'
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings'
import Code from '@yoopta/code'
import ActionMenuList, {
  DefaultActionMenuRender,
} from '@yoopta/action-menu-list'
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar'
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool'

// import { uploadToCloudinary } from '@/utils/cloudinary'
import { useEffect, useMemo, useRef } from 'react'
import { WITH_BASIC_INIT_VALUE } from '@/lib/yopta/initValue'

// import { uploadToCloudinary } from '@/utils/cloudinary'
// import { YooptaValue } from '@/lib/yopta/initialData'
import { uploadFiles } from '@/lib/uploadFiles'

// Function to handle image upload using UploadThing
const handleImageUpload = async (file: File) => {
  try {
    // Upload the image file using UploadThing
    const response = await uploadFiles('editorImage', { files: [file] })
    // Extract the URL and other necessary data from the response
    const imageUrl = response[0]?.url
    // const width = response[0]?.data?.width;
    // const height = response[0]?.data?.height;

    // Return the image URL and dimensions in the required format
    return { src: imageUrl }
    // return { url: imageUrl, width, height };
  } catch (error) {
    console.error('Error uploading image:', error)
    return { src: '' }
  }
}

// Function to handle image upload using UploadThing
const handleVideoUpload = async (file: File) => {
  try {
    // Upload the image file using UploadThing
    const response = await uploadFiles('editorVideo', { files: [file] })
    // Extract the URL and other necessary data from the response
    const videoUrl = response[0]?.url
    // const width = response[0]?.data?.width;
    // const height = response[0]?.data?.height;

    // Return the image URL and dimensions in the required format
    return { url: videoUrl }
    // return { url: imageUrl, width, height };
  } catch (error) {
    console.error('Error uploading video:', error)
    return { url: '' }
  }
}

// Function to handle image upload using UploadThing
const handleFileUpload = async (file: File) => {
  try {
    // Upload the image file using UploadThing
    const response = await uploadFiles('editorFile', { files: [file] })
    // Extract the URL and other necessary data from the response
    const fileUrl = response[0]?.url
    // const width = response[0]?.data?.width;
    // const height = response[0]?.data?.height;

    // Return the image URL and dimensions in the required format
    return { url: fileUrl }
    // return { url: imageUrl, width, height };
  } catch (error) {
    console.error('Error uploading file:', error)
    return { url: '' }
  }
}

// list of plugins should be placed outside component
const plugins = [
  Paragraph,
  Accordion,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  File.extend({
    options: {
      onUpload: async (file: File) => {
        const response = await handleFileUpload(file)
        return { src: response.url }
      },
    },
  }),
  Embed.extend({
    options: {
      // maxWidth: 1024,
      // maxHeight: 1024,
    },
  }),
  Image.extend({
    options: {
      // maxWidth: 1024,
      // maxHeight: 1024,
      async onUpload(file: File) {
        const response = await handleImageUpload(file)
        return {
          src: response.src,
          alt: 'uploadthing',
          width: 850,
          height: 650,
        }
      },
    },
  }),
  Video.extend({
    options: {
      // maxWidth: 1024,
      // maxHeight: 1024,
      onUpload: async (file: File) => {
        const response = await handleVideoUpload(file)
        return {
          src: response.url,
          alt: 'uploadthing',
          width: 850,
          height: 650,
        }
      },
    },
  }),
]

// tools should be placed outside your component
const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
}

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight]

interface EditorProps {
  value: YooptaContentValue
  onChange: (value: YooptaContentValue) => void
  readOnly?: boolean
}

// @ts-ignore
export default function Editor({
  value,
  onChange,
  readOnly = false,
}: EditorProps) {

  // console.log('value in editort: ', value)

  const editor = useMemo(() => createYooptaEditor(), [])
  const selectionRef = useRef(null)

  useEffect(() => {
    const handleChange = () => {
      const newValue = editor.getEditorValue()
      console.log('type of editor value: ', newValue)
      onChange(newValue)
    }
    editor.on('change', handleChange)
    return () => {
      editor.off('change', handleChange)
    }
  }, [editor, onChange])

  return (
    // <main
    //   style={{ padding: '5rem 0' }}
    //   className={`flex min-h-screen w-full h-full flex-col items-center justify-between p-24`}
    // >
    <div className="w-full h-full bg-white p-14" ref={selectionRef}>
      {/* <YooptaEditor<any>
        // value={editorValue}
        value={value}
        // onChange={(val: YooptaValue[]) => setEditorValue(val)}
        onChange={onChange}
        plugins={plugins}
        marks={marks}
        placeholder="Tippe '/' zum starten..."
        autoFocus
        tools={TOOLS}
        // offline="withBasicExample"
      /> */}

      <YooptaEditor
        // className="w-[1024px]"
        editor={editor}
        // @ts-ignore
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={value}
        // value={WITH_BASIC_INIT_VALUE}
        onChange={onChange}
        // onSave={onSave}
        placeholder="Schreibe  '/'  um das Menü zu öffnen..."
        autoFocus
        readOnly={readOnly} // Pass readOnly prop to YooptaEditor
      />
    </div>
    // </main>
  )
}
