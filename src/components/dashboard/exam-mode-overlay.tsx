"use client";

import { useApp } from '@/lib/store';
import { calculateTimeRemaining, formatCountdown, timeToMinutes, minutesToTime } from '@/lib/time';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function ExamModeOverlay() {
  const { examConfig, setExamMode, setExamConfig, now } = useApp();
  const [countdown, setCountdown] = useState("");
  const [status, setStatus] = useState("");

  // Update logic every second
  useEffect(() => {
    if (!examConfig) return;

    const update = () => {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const verbalStart = timeToMinutes(examConfig.verbalStart);
      const verbalEnd = timeToMinutes(examConfig.verbalEnd);
      const mathStart = timeToMinutes(examConfig.mathStart);
      const mathEnd = timeToMinutes(examConfig.mathEnd);
      
      const breakEndMinutes = verbalEnd + (examConfig.breakDuration || 15);
      
      let targetTime: Date;
      let statusMsg = "";
      let subMsg = "";

      if (currentMinutes < verbalStart) {
          targetTime = createTimeToday(examConfig.verbalStart);
          statusMsg = "Sözel bölüme başlamak için kalan süre";
          subMsg = "Sınav Başlangıcı";
      } else if (currentMinutes >= verbalStart && currentMinutes < verbalEnd) {
          targetTime = createTimeToday(examConfig.verbalEnd);
          statusMsg = "Sözel Bölüm devam ediyor";
          subMsg = `${examConfig.verbalStart} - ${examConfig.verbalEnd}`;
      } else if (currentMinutes >= verbalEnd && currentMinutes < breakEndMinutes) {
          targetTime = createTimeToday(minutesToTime(breakEndMinutes));
          statusMsg = "Teneffüsteyiz. Sayısal bölüme başlamak için kalan süre";
          subMsg = "Teneffüs";
      } else if (currentMinutes >= breakEndMinutes && currentMinutes < mathStart) {
          targetTime = createTimeToday(examConfig.mathStart);
          statusMsg = "Sayısal bölüme başlamak için kalan süre";
          subMsg = "Sayısal Başlangıcı";
      } else if (currentMinutes >= mathStart && currentMinutes < mathEnd) {
          targetTime = createTimeToday(examConfig.mathEnd);
          statusMsg = "Sayısal Bölüm devam ediyor";
          subMsg = `${examConfig.mathStart} - ${examConfig.mathEnd}`;
      } else {
          // Finished
          setExamMode(false);
          setExamConfig(null);
          return;
      }

      const remaining = calculateTimeRemaining(targetTime, now);
      setCountdown(formatCountdown(remaining));
      setStatus(statusMsg);
    };

    update();
    // Rely on `now` updating from store every second
  }, [now, examConfig, setExamMode, setExamConfig]);

  if (!examConfig) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur flex items-center justify-center p-8">
       <Button 
         variant="ghost" 
         size="icon" 
         className="absolute top-8 right-8 h-12 w-12 rounded-full hover:bg-destructive/10 hover:text-destructive"
         onClick={() => {
            if (confirm('Deneme sınavı modunu sonlandırmak istiyor musunuz?')) {
              setExamMode(false);
              setExamConfig(null);
            }
         }}
       >
         <X className="h-8 w-8" />
         <span className="sr-only">Kapat</span>
       </Button>

       <Card className="w-full max-w-4xl border-none shadow-2xl bg-card/50">
         <CardHeader>
           <CardTitle className="text-center text-4xl font-bold text-primary">Deneme Sınavı</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col items-center gap-12 p-12">
            <div className="text-3xl text-center font-medium text-foreground/80">
               {status}
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-16 rounded-3xl shadow-2xl border-8 border-white/10 min-w-[600px] text-center animate-in zoom-in duration-300">
               <div className="text-8xl font-black font-mono tracking-widest tabular-nums drop-shadow-lg">
                 {countdown}
               </div>
            </div>

            <div className="text-xl text-muted-foreground font-mono bg-muted px-6 py-2 rounded-full">
               {examConfig.verbalStart} - {examConfig.mathEnd}
            </div>
         </CardContent>
       </Card>
    </div>
  );
}

// Helper to avoid circular dependency if `createTimeToday` needs `now` but we pass string
function createTimeToday(timeStr: string): Date {
  const d = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  d.setHours(hours || 0, minutes || 0, 0, 0);
  return d;
}

