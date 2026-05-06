import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Terminal } from 'lucide-react';

interface PromptResultProps {
  prompt: string;
}

export function PromptResult({ prompt }: PromptResultProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!prompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full pt-8"
    >
      <div className="flex items-center justify-between mb-5 px-2">
        <div className="flex items-center gap-3 text-neutral-600 font-display text-[10px] uppercase tracking-[0.4em] font-bold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Calculated Output</span>
        </div>
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-[10px] text-white font-medium flex items-center gap-2 uppercase tracking-widest"
            >
              <Check className="w-3 h-3" />
              Copied to Buffer
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="relative group">
        <div className="glass rounded-3xl p-10 pr-20 bg-neutral-950/40 min-h-[200px] transition-all duration-700 group-hover:bg-neutral-950/60 group-hover:border-white/10">
          <p className="text-neutral-200 leading-[1.8] font-sans text-sm md:text-[15px] selection:bg-white/20 tracking-wide font-light">
            {prompt}
          </p>
        </div>

        <button
          onClick={copyToClipboard}
          className="absolute top-8 right-8 p-4 glass border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 active:scale-90 shadow-2xl"
          title="Copy prompt"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
