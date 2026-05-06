import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (data: string, mimeType: string) => void;
  isLoading: boolean;
  onReset: () => void;
  hasImage: boolean;
}

export function UploadZone({ onImageSelected, isLoading, onReset, hasImage }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      const base64Data = result.split(',')[1];
      onImageSelected(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const clear = () => {
    setPreview(null);
    onReset();
  };

  return (
    <div className="relative w-full aspect-[16/9] max-h-[500px]">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              w-full h-full glass rounded-[2.5rem] flex flex-col items-center justify-center 
              cursor-pointer transition-all duration-700 ease-[0.16,1,0.3,1] group
              ${isDragActive ? 'border-white/20 bg-white/[0.03]' : 'hover:bg-white/[0.015] hover:border-white/10'}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
              accept="image/*"
              className="hidden"
            />
            <div className={`p-8 rounded-full glass border-white/5 mb-8 transition-all duration-700 ${isDragActive ? 'scale-110 shadow-[0_0_50px_rgba(255,255,255,0.05)]' : 'group-hover:scale-105'}`}>
              <Upload className="w-8 h-8 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
            </div>
            <p className="text-neutral-500 font-display font-medium tracking-[0.15em] text-[10px] uppercase text-center px-10 leading-relaxed">
              Drop Archive or <span className="text-neutral-300">Select Input</span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative group rounded-[2.5rem] overflow-hidden glass"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[1px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                className="p-5 glass border-white/10 rounded-full transition-all hover:scale-110 active:scale-90"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {isLoading && (
              <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-3xl flex flex-col items-center justify-center">
                <div className="w-12 h-px bg-white/20 mb-8 animate-pulse" />
                <p className="text-neutral-300 font-display text-[10px] tracking-[0.5em] font-semibold animate-pulse uppercase">
                  Analyzing Spectral Data
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
