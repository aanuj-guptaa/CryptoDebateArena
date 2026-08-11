'use client';

import { useState } from 'react';
import { CursorGlow } from '../components/ui/CursorGlow';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { ValueProp } from '../components/landing/ValueProp';
import { Features } from '../components/landing/Features';
import { Roles } from '../components/landing/Roles';
import { Timeline } from '../components/landing/Timeline';
import { FAQ } from '../components/landing/FAQ';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';
import CoinPickerModal from '../components/CoinPickerModal';

export default function Home() {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden relative">
      {/* Mouse Cursor Glow Overlay */}
      <CursorGlow />

      <Navbar onOpenPicker={() => setIsPickerOpen(true)} />
      <Hero onOpenPicker={() => setIsPickerOpen(true)} />
      <ValueProp />
      <Features />
      <Roles />
      <Timeline />
      <FAQ />
      <CTA onOpenPicker={() => setIsPickerOpen(true)} />
      <Footer />

      {/* Coin Picker Modal */}
      <CoinPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentCoinId="bitcoin"
      />
    </main>
  );
}
