/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Settings2, Hash } from 'lucide-react';
import { UploadZone } from './components/UploadZone.tsx';
import { PromptResult } from './components/PromptResult.tsx';
import { describeImage, buildPrompt } from './lib/gemini.ts';
import { resizeImageIfNeeded } from './lib/imageUtils.ts';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState('3:2');
  const [finalPrompt, setFinalPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelected = async (base64Data: string, mimeType: string) => {
    setLoading(true);
    setFinalPrompt('');
    try {
      const optimizedData = await resizeImageIfNeeded(base64Data, mimeType);
      const desc = await describeImage(optimizedData, mimeType);
      setDescription(desc);
    } catch (error) {
      console.error('Analysis failed:', error);
      setDescription(error instanceof Error ? `Protocol Error: ${error.message}` : "Internal analysis bypass. Please provide manual parameters.");
    } finally {
      setLoading(false);
    }
  };

  const generatePrompt = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const prompt = buildPrompt(description, aspectRatio);
      setFinalPrompt(prompt);
      setIsProcessing(false);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 150);
    }, 800);
  };

  const handleReset = () => {
    setDescription('');
    setFinalPrompt('');
  };

  return (
    <div className="min-h-screen px-6 py-20 md:py-40 max-w-5xl mx-auto flex flex-col items-center">
      <div className="noise" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-32"
      >
        <div className="inline-flex items-center justify-center p-1 px-4 rounded-full border border-white/5 bg-white/[0.02] mb-10 scale-90">
          <div className="w-1 h-1 rounded-full bg-white/40 mr-4" />
          <span className="text-[9px] uppercase tracking-[0.5em] font-display font-bold text-neutral-500">Optical Extraction Module</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-display font-medium text-gradient tracking-[-0.05em] mb-8 leading-none">
          OBSCURA
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto text-sm md:text-[15px] font-sans font-light leading-relaxed tracking-wider opacity-80 italic">
          An advanced vision protocol for generating ultra-realist, candid photographic data sequences.
        </p>
      </motion.div>

      {/* Main Content */}
      <main className="w-full max-w-3xl space-y-24 relative">
        <div className="ambient-glow opacity-30" />
        
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-b from-white/5 to-transparent rounded-[3rem] blur-xl opacity-20" />
          <UploadZone 
            onImageSelected={handleImageSelected} 
            isLoading={loading}
            onReset={handleReset}
            hasImage={!!description}
          />
        </div>

        <AnimatePresence>
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-16"
            >
              {/* Description Field */}
              <div className="space-y-5">
                <div className="flex items-center justify-between px-4">
                  <label className="text-[9px] uppercase tracking-[0.4em] font-display font-bold text-neutral-600">
                    Spectral Description
                  </label>
                  <div className="flex gap-4">
                    <span className="text-[9px] text-white/20 font-mono">0x7F4B</span>
                    <span className="text-[9px] text-neutral-800 font-mono">AWAITING_INPUT</span>
                  </div>
                </div>
                <div className="relative group">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[180px] p-10 glass rounded-[2rem] bg-neutral-950/30 text-neutral-300 font-sans leading-[1.8] border-white/[0.03] focus:border-white/10 focus:ring-0 outline-none transition-all resize-none shadow-2xl"
                  />
                  <div className="absolute bottom-6 right-8 text-[10px] font-mono text-neutral-700">
                    {description.length} CHARS
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-8 items-end">
                <div className="flex-1 space-y-5 w-full">
                  <label className="block text-[9px] uppercase tracking-[0.4em] font-display font-bold text-neutral-600 px-4">
                    Coordinate Format
                  </label>
                  <div className="relative group">
                    <div className="absolute left-8 top-1/2 -translate-y-1/2">
                      <Settings2 className="w-4 h-4 text-neutral-700 transition-colors group-focus-within:text-white/40" />
                    </div>
                    <input
                      type="text"
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full pl-16 pr-10 py-6 glass rounded-[1.5rem] bg-neutral-950/30 text-neutral-200 text-xs border-white/[0.03] focus:border-white/10 outline-none transition-all font-mono tracking-widest"
                      placeholder="3:2"
                    />
                  </div>
                </div>

                <button
                  onClick={generatePrompt}
                  disabled={isProcessing || !description}
                  className={`
                    w-full sm:w-auto px-16 py-6 rounded-[1.5rem] font-display font-bold text-[10px] uppercase tracking-[0.4em]
                    transition-all duration-700 flex items-center justify-center gap-5 border
                    ${isProcessing || !description 
                      ? 'bg-neutral-950 text-neutral-800 border-white/5 opacity-40 cursor-not-allowed' 
                      : 'bg-white text-black border-transparent hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] active:scale-[0.97] hover:-translate-y-1'}
                  `}
                >
                  {isProcessing ? 'Processing...' : (
                    <>
                      Execute
                      <ArrowRight className="w-3 h-3 translate-y-[0.5px]" />
                    </>
                  )}
                </button>
              </div>

              <PromptResult prompt={finalPrompt} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Meta */}
      <footer className="mt-48 pt-20 border-t border-white/[0.03] w-full flex flex-col items-center">
        <div className="flex gap-12 mb-10 opacity-20">
          <span className="text-[8px] tracking-[0.8em] text-white">PRIVACY</span>
          <span className="text-[8px] tracking-[0.8em] text-white">PROTOCOL</span>
          <span className="text-[8px] tracking-[0.8em] text-white">VERIFIED</span>
        </div>
        <p className="text-neutral-800 text-[8px] uppercase tracking-[0.8em] font-display">
          EST. 2026 • GLOBAL RELEASE
        </p>
      </footer>
    </div>
  );
}
