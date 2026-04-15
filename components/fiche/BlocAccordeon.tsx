'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  icone: string;
  titre: string;
  soustitre?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function BlocAccordeon({
  icone,
  titre,
  soustitre,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="glass card-top-line overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-8"
      >
        <span className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>
            {icone}
          </span>
          <span>
            <span className="block font-display text-lg text-navy sm:text-xl">
              {titre}
            </span>
            {soustitre && (
              <span className="mt-0.5 block text-sm text-navy/55">
                {soustitre}
              </span>
            )}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-navy/50"
          aria-hidden
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-navy/5 px-6 py-6 sm:px-8">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
