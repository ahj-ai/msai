"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage: File | null;
}

export function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    setError(null);
    setUploadSuccess(false);

    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File is too large. Maximum size is 5MB.");
        setPreviewUrl(null);
        onImageSelect(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Invalid file type. Please upload an image (PNG, JPG, JPEG).");
        setPreviewUrl(null);
        onImageSelect(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setUploadSuccess(true);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    } else {
      setPreviewUrl(null);
      onImageSelect(null);
    }
  }, [onImageSelect]);
  
  useEffect(() => {
    // Sync preview if currentImage prop changes from parent
    if (currentImage) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(currentImage);
      setUploadSuccess(true);
    } else {
      setPreviewUrl(null);
      setUploadSuccess(false);
    }
  }, [currentImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileChange(file);
    event.target.value = ''; // Reset input to allow re-uploading the same file
  };

  const handleRemoveImage = () => {
    handleFileChange(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
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
            borderColor: isDragging ? 'rgb(99, 102, 241)' : 'rgb(167, 139, 250, 0.5)'
          }}
          className={`
            relative rounded-xl border-2 border-dashed 
            transition-colors duration-300 p-6 text-center
            ${isDragging ? 'bg-indigo-50' : (previewUrl ? 'bg-green-50 border-green-300' : 'bg-indigo-50/50 border-indigo-200')}
            ${error ? 'border-red-400 bg-red-50' : ''}
          `}
        >
          <input
            id="image-upload-snap"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleInputChange}
            className="hidden"
          />
          <label
            htmlFor="image-upload-snap"
            className="flex flex-col items-center justify-center gap-3 cursor-pointer"
          >
            {!previewUrl && !error && (
              <>
                <motion.div
                  animate={{
                    y: isDragging ? -5 : 0,
                    scale: isDragging ? 1.1 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <ImageIcon className="w-10 h-10 text-indigo-500" />
                </motion.div>
                <p className="text-md font-medium text-gray-700">
                  Drag & drop your screenshot here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG (Max 5MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 border-indigo-300 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-300"
                  onClick={() => document.getElementById('image-upload-snap')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Screenshot
                </Button>
              </>
            )}

            {error && (
              <div className="flex flex-col items-center text-red-600">
                <AlertTriangle className="w-10 h-10 mb-2" />
                <p className="font-semibold">Upload Error</p>
                <p className="text-sm">{error}</p>
                 <Button
                  type="button"
                  variant="outline"
                  className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => {
                    setError(null);
                    document.getElementById('image-upload-snap')?.click();
                  }}
                >
                  Try Again
                </Button>
              </div>
            )}

            {previewUrl && !error && (
              <div className="flex flex-col items-center text-green-700">
                <CheckCircle className="w-10 h-10 mb-2" />
                <p className="font-semibold">Screenshot Selected!</p>
                <p className="text-sm truncate max-w-xs">{currentImage?.name}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleRemoveImage}
                >
                  <X className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            )}
          </label>
        </motion.div>
      </div>

      <AnimatePresence>
        {previewUrl && !error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-md"
          >
            <div className="p-2">
              <p className="text-xs text-gray-500 mb-1 px-1">Screenshot Preview:</p>
              <img
                src={previewUrl}
                alt="Uploaded problem preview"
                className="w-full h-auto max-h-[300px] object-contain rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

