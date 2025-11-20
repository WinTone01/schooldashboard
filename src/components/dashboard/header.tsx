"use client";

import { useApp } from '@/lib/store';
import { getFormattedDate, getFormattedTime } from '@/lib/time';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function Header() {
  const { settings, now } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b shadow-sm mb-4 rounded-xl mt-4 mx-auto max-w-[98%]">
      <div className="container flex flex-col md:flex-row h-auto md:h-24 items-center justify-between px-4 md:px-8 py-4 md:py-0 gap-4">
        
        {/* Left Side: Logo + School Name */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
          {settings.logo && (
            <div className="relative h-12 w-12 md:h-16 md:w-16 shrink-0">
               <Image 
                 src={settings.logo} 
                 alt="Logo" 
                 fill
                 className="object-contain" 
               />
            </div>
          )}
          <h1 className="text-xl md:text-3xl font-bold text-primary tracking-tight text-center md:text-left">
            {settings.schoolName}
          </h1>
        </div>
        
        {/* Right Side: Clock */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 w-full md:w-auto">
          <div className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-md font-medium text-sm md:text-xl w-full md:w-auto text-center">
            {mounted ? getFormattedDate(now) : <span className="opacity-0">Loading</span>}
          </div>
          <div className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground px-6 py-2 md:px-8 md:py-4 rounded-xl shadow-lg font-mono text-2xl md:text-4xl font-bold tracking-widest border-2 border-white/20 tabular-nums min-w-[160px] md:min-w-[220px] text-center w-full md:w-auto">
            {mounted ? getFormattedTime(now) : "--:--:--"}
          </div>
        </div>
      </div>
    </header>
  );
}
