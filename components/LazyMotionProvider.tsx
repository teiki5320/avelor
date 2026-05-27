'use client';
import { LazyMotion } from 'framer-motion';
import domAnimation from '@/lib/framer-features';

export default function LazyMotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
