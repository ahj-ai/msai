"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImageIcon, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onUpload: (file: File) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = useCallback((file: File) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
        setUploadSuccess(true)
        setTimeout(() => setUploadSuccess(false), 2000)
      }
      reader.readAsDataURL(file)
      onUpload(file)
    }
  }, [onUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file)
    }
  }, [handleFileChange])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) handleFileChange(file)
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative"
      >
        <motion.div
          animate={{
            scale: isDragging ? 1.02 : 1,
            borderColor: isDragging ? 'rgb(147, 197, 253)' : 'rgb(147, 51, 234, 0.3)'
          }}
          className={`
            relative rounded-xl border-2 border-dashed border-purple-400/30 
            transition-colors duration-300 p-8
            ${isDragging ? 'bg-blue-500/10' : 'bg-purple-800/30'}
          `}
        >
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center gap-4 cursor-pointer"
          >
            <motion.div
              animate={{ 
                y: isDragging ? -5 : 0,
                scale: isDragging ? 1.1 : 1
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {uploadSuccess ? (
                <CheckCircle className="w-12 h-12 text-green-400" />
              ) : (
                <ImageIcon className="w-12 h-12 text-purple-300" />
              )}
            </motion.div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-purple-100">
                Drag & drop your image here, or click to browse
              </p>
              <p className="text-sm text-purple-300">
                Supports PNG, JPG, JPEG up to 5MB
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 border-purple-400/30 text-purple-100 hover:bg-purple-800/30 hover:text-purple-200 transition-all duration-300"
            >
              <Upload className="w-5 h-5 mr-2" />
              Select Image
            </Button>
          </label>
        </motion.div>
      </div>

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-xl overflow-hidden border border-purple-400/30 bg-purple-800/30"
          >
            <img 
              src={previewUrl} 
              alt="Uploaded problem" 
              className="w-full h-auto max-h-[400px] object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-purple-100 hover:text-purple-200 hover:bg-purple-800/50"
              onClick={handleRemoveImage}
            >
              <X className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

