"use client";

import { useApp } from '@/lib/store';
import { useEffect } from 'react';

export function FaviconUpdater() {
  const { settings } = useApp();

  useEffect(() => {
    if (settings.logo) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = settings.logo;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [settings.logo]);

  return null;
}

