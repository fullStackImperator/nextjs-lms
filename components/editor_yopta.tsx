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
import { uploadFiles } from '@/lib/uploadFiles'


  // Function to handle image upload using UploadThing
  const handleImageUpload = async (file: File) => {
    try {
      // Upload the image file using UploadThing
      const response = await uploadFiles("editorImage", { files: [file] });
      // Extract the URL and other necessary data from the response
      const imageUrl = response[0]?.url;
      // const width = response[0]?.data?.width;
      // const height = response[0]?.data?.height;

      // Return the image URL and dimensions in the required format
      return { url: imageUrl };
      // return { url: imageUrl, width, height };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { url: '' }
    }
  };


  // Function to handle image upload using UploadThing
  const handleVideoUpload = async (file: File) => {
    try {
      // Upload the image file using UploadThing
      const response = await uploadFiles("editorVideo", { files: [file] });
      // Extract the URL and other necessary data from the response
      const videoUrl = response[0]?.url
      // const width = response[0]?.data?.width;
      // const height = response[0]?.data?.height;

      // Return the image URL and dimensions in the required format
      return { url: videoUrl };
      // return { url: imageUrl, width, height };
    } catch (error) {
      console.error('Error uploading video:', error);
      return { url: '' }
    }
  };

  // Function to handle image upload using UploadThing
  const handleFileUpload = async (file: File) => {
    try {
      // Upload the image file using UploadThing
      const response = await uploadFiles("editorFile", { files: [file] });
      // Extract the URL and other necessary data from the response
      const fileUrl = response[0]?.url
      // const width = response[0]?.data?.width;
      // const height = response[0]?.data?.height;

      // Return the image URL and dimensions in the required format
      return { url: fileUrl }
      // return { url: imageUrl, width, height };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { url: '' }
    }
  };


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
    options: {
      onUpload: async (file: File) => {
        const response = await handleFileUpload(file)
        return { url: response.url }
      },
    },
  }),
  Embed.extend({
    options: {
      maxWidth: 650,
      maxHeight: 750,
    },
  }),
  Image.extend({
    options: {
      maxWidth: 650,
      maxHeight: 650,
      onUpload: async (file: File) => {
        const response = await handleImageUpload(file)
        return {
          url: response.url,
          width: 650,
          height: 450,
        }
      },
    },
  }),
  Video.extend({
    options: {
      maxWidth: 650,
      maxHeight: 650,
      onUpload: async (file: File) => {
        const response = await handleVideoUpload(file)
        return {
          url: response.url,
          width: 650,
          height: 450,
        }
      },
    },
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
