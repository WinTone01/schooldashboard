"use client";

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';

export function WatchDutyList() {
  const { settings, now } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!settings.showWatchDuties) return null;

  if (!mounted) {
    return (
      <Card className="bg-card/90 backdrop-blur-sm shadow-lg border-none h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-xl font-bold">Nöbetçi Öğretmenler</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4">
           <div className="text-center text-muted-foreground p-4">Yükleniyor...</div>
        </CardContent>
      </Card>
    );
  }

  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const dayMap: Record<number, keyof typeof settings.watchDuties.schedule> = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
    0: 'sunday',
  };

  const todayKey = dayMap[dayOfWeek];
  const todayDuties = settings.watchDuties.schedule[todayKey];
  const locations = settings.watchDuties.locations;

  if (!todayDuties || todayDuties.length === 0) {
    return (
      <Card className="bg-card/90 backdrop-blur-sm shadow-lg border-none h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-xl font-bold">Nöbetçi Öğretmenler</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4">
           <div className="text-center text-muted-foreground p-4">Bugün nöbetçi yok.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/90 backdrop-blur-sm shadow-lg border-none h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-xl font-bold">Nöbetçi Öğretmenler</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {locations.map((location, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-muted/50 to-muted hover:shadow-md transition-shadow text-center h-28"
              >
                <div className="text-primary font-bold text-lg mb-2 line-clamp-1 w-full" title={location}>
                  {location}
                </div>
                <div className="text-muted-foreground font-semibold text-base line-clamp-2 w-full" title={todayDuties[index]}>
                  {todayDuties[index] || '-'}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

