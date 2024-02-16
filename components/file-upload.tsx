'use client'

import toast from 'react-hot-toast'

import { UploadDropzone } from '@/lib/uploadthing'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import { useState } from 'react'
import Image from 'next/image'

interface FileUploadProps {
  onChange: (url?: string) => void
  endpoint: keyof typeof ourFileRouter
  // previewUrl?: string | null // Add a previewUrl prop
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
// export const FileUpload = ({ onChange, endpoint, previewUrl }: FileUploadProps) => {

  const [preview, setPreview] = useState<string | null>(null)
  // const [preview, setPreview] = useState<string | null>(previewUrl || null)

  const handleUploadComplete = (res: any) => {
    const url = res?.[0]?.url
    if (url) {
      setPreview(url)
      onChange(url)
    }
  }

  const handleUploadError = (error: Error) => {
    toast.error(`${error?.message}`)
  }

  return (
    <div>
      {preview ? (
        <Image
          src={preview}
          alt="Preview Badge"
          width={300} // Set the width and height properties
          height={300} // Adjust these values as needed
          style={{ maxWidth: '100%', maxHeight: '300px' }}
        />
      ) : (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      )}
    </div>
  )
}
