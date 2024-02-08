"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css"

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

export const Editor = ({
    onChange, 
    value
}: EditorProps) => {
    const ReactQuill = useMemo(() => dynamic(()=> import("react-quill"), {ssr: false}), [])

    if (!ReactQuill) {
        // If ReactQuill is not yet loaded, you might render a placeholder or loading state
        return (
        <div>Loading editor...</div>
        )
    }

    const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        [{ align: [] }],
        [{ color: [] }],
        ['code-block'],
        ['clean'],
    ],
    }


    return (
      <div className="bg-white">
        <ReactQuill
          theme="snow"
          value={value}
          modules={quillModules}
          onChange={onChange}
        />
      </div>
    )
}