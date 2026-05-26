'use client';
import type { ReactNode } from 'react';
import type { Tone } from '@/lib/priorites';
import { TONES } from '@/lib/priorites';

interface Props {
  id: string;
  icone: string;
  label: string;
  valeur: string;
  detail: string;
  tone: Tone;
  expandedContent: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export default function PriorityCard({
  id,
  icone,
  label,
  valeur,
  detail,
  tone,
  expandedContent,
  isOpen,
  onToggle,
}: Props) {
  const t = TONES[tone];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${t.bg} ${t.border} ${
        isOpen ? 'ring-2 ring-navy/15 sm:col-span-2 lg:col-span-4' : ''
      }`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.accent}`} aria-hidden />

      <button
        type="button"
        onClick={onToggle}
        className={`w-full p-4 text-left transition ${t.hover}`}
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-2xl leading-none" aria-hidden>{icone}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
            {label}
          </span>
        </div>
        <p className={`mt-3 font-display text-xl leading-tight ${t.text} sm:text-2xl`}>
          {valeur}
        </p>
        <p className="mt-1 text-xs text-navy/65">{detail}</p>
        <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-navy/50">
          <span>{isOpen ? 'Replier' : 'Voir plus'}</span>
          <span aria-hidden className={`transition ${isOpen ? 'rotate-180' : ''}`}>↓</span>
        </div>
      </button>

      {isOpen && (
        <div
          id={`panel-${id}`}
          role="region"
          className="border-t border-navy/10 bg-white/40 px-5 pb-5 pt-4"
        >
          {expandedContent}
        </div>
      )}
    </div>
  );
}
