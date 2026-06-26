'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Camera, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_FILES = 5
const MAX_SIZE = 5 * 1024 * 1024

export interface UploadedPhoto {
  url: string
  preview: string
  name: string
}

interface PhotoUploadProps {
  photos: UploadedPhoto[]
  onChange: (photos: UploadedPhoto[]) => void
}

export function PhotoUpload({ photos, onChange }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (photos.length + acceptedFiles.length > MAX_FILES) {
        setError(`Maksimal ${MAX_FILES} foto`)
        return
      }
      setError(null)
      setUploading(true)

      const newPhotos: UploadedPhoto[] = []
      for (const file of acceptedFiles) {
        if (file.size > MAX_SIZE) {
          setError('Ukuran file maksimal 5MB')
          continue
        }
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) continue
        const data = await res.json()
        newPhotos.push({
          url: data.url,
          preview: URL.createObjectURL(file),
          name: file.name,
        })
      }

      onChange([...photos, ...newPhotos])
      setUploading(false)
    },
    [photos, onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: MAX_FILES - photos.length,
    disabled: uploading || photos.length >= MAX_FILES,
  })

  const removePhoto = (index: number) => {
    const updated = [...photos]
    const removed = updated.splice(index, 1)[0]
    if (removed.preview.startsWith('blob:')) URL.revokeObjectURL(removed.preview)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all',
          isDragActive ? 'border-gold bg-gold/10' : 'border-gold/30 bg-gold/5 hover:border-gold/50',
          (uploading || photos.length >= MAX_FILES) && 'cursor-not-allowed opacity-60',
        )}
      >
        <input {...getInputProps()} />
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <Camera className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {uploading ? 'Mengupload...' : 'Upload foto bukti material (min. 2 foto)'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, WebP · Maks 5MB · Maks {MAX_FILES} foto
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Tips: Foto proses tenun, foto bahan baku, foto produk jadi
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, i) => (
            <div key={photo.url} className="group relative overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.preview} alt={photo.name} className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Hapus foto"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-2 left-2">
                <CheckCircle2 className="h-4 w-4 text-teal drop-shadow" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
