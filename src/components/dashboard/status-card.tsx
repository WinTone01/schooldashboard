"use client";

import { useSchedule } from '@/hooks/use-schedule';
import { useApp } from '@/lib/store';
import { formatCountdown, minutesToTime } from '@/lib/time';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export function StatusCard() {
  const { period, timeRemaining } = useSchedule();
  const { isExamMode } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isExamMode) return null; // Handled by ExamModeOverlay or parent

  if (!mounted) {
    return (
      <Card className="bg-card/90 backdrop-blur-sm shadow-lg border-none flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-2xl font-bold">Mevcut Durum</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center items-center gap-6 p-6">
          <div className="text-2xl text-muted-foreground text-center font-medium">
            Yükleniyor...
          </div>
        </CardContent>
      </Card>
    );
  }

  let statusText = "Yükleniyor...";
  let subText = "";
  
  if (period.type === 'lesson') {
    statusText = `${period.lesson?.name} (${period.lesson?.start} - ${period.lesson?.end})`;
    subText = "Dersin bitimine kalan süre";
  } else if (period.type === 'break') {
    statusText = `${period.label} (${minutesToTime(period.start || 0)} - ${minutesToTime(period.end || 0)})`;
    subText = "Dersin başlamasına kalan süre";
  } else if (period.type === 'lunch') {
    statusText = `Öğle Arası (${minutesToTime(period.start || 0)} - ${minutesToTime(period.end || 0)})`;
    subText = "Öğle arasının bitimine kalan süre";
  } else if (period.type === 'before') {
    statusText = "Dersler Henüz Başlamadı";
    subText = "İlk derse kalan süre";
  } else if (period.type === 'after') {
    statusText = "Dersler Bitti";
    subText = "Yarın görüşmek üzere";
  } else if (period.type === 'weekend') {
    statusText = "Hafta Sonu";
    subText = "İyi tatiller";
  }

  return (
    <Card className="bg-card/90 backdrop-blur-sm shadow-lg border-none flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-2xl font-bold">Mevcut Durum</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center gap-6 p-6">
        <div className="text-2xl text-muted-foreground text-center font-medium">
          {statusText}
        </div>
        
        {(period.type !== 'after' && period.type !== 'weekend') && (
          <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border-4 border-white/20">
             <div className="text-6xl font-black font-mono tracking-widest tabular-nums drop-shadow-md">
               {formatCountdown(timeRemaining)}
             </div>
             <div className="mt-2 text-white/90 font-medium">{subText}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
