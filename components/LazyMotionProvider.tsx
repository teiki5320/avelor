'use client';
import { LazyMotion, MotionConfig } from 'framer-motion';
import domAnimation from '@/lib/framer-features';

// reducedMotion="user" : si la personne a demandé de réduire les animations
// (réglage système), Framer Motion désactive les déplacements et
// transformations de toutes les animations du site.
export default function LazyMotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
