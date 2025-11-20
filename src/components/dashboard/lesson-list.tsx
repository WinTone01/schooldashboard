"use client";

import { useSchedule } from '@/hooks/use-schedule';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export function LessonList() {
  const { schedule, period } = useSchedule();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="h-full flex flex-col bg-card/90 backdrop-blur-sm shadow-lg border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-xl font-bold">Ders Saatleri</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div className="text-center text-muted-foreground">Yükleniyor...</div>
        </CardContent>
      </Card>
    );
  }

  if (!schedule) {
    return (
      <Card className="h-full flex flex-col bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary text-xl">Ders Saatleri</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Hafta sonu ders programı bulunmamaktadır.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col bg-card/90 backdrop-blur-sm shadow-lg border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-xl font-bold">Ders Saatleri</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0 p-4">
        <ScrollArea className="flex-1 pr-4">
          <ul className="space-y-2">
            {schedule.map((lesson, index) => {
              const isLessonActive = period.type === 'lesson' && period.index === index;
              const isBreakActive = (period.type === 'break' || period.type === 'lunch') && period.index === index;
              
              return (
                <li 
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border-l-4 transition-all duration-200",
                    isLessonActive 
                      ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300 font-semibold shadow-sm scale-[1.02]" 
                      : isBreakActive
                        ? period.type === 'lunch' 
                          ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500 dark:text-orange-300 shadow-sm" 
                          : "bg-green-50 dark:bg-green-900/20 border-green-500 dark:text-green-300 shadow-sm"
                        : "bg-muted/40 border-border text-foreground"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold">{lesson.name}</span>
                  </div>
                  <div className="text-base opacity-90 font-mono font-medium">
                    {lesson.start} - {lesson.end}
                  </div>
                  {(lesson.breakAfter || (index < schedule.length - 1)) && (
                    <div className="mt-2 text-sm opacity-75 font-medium">
                       {lesson.breakLabel || `${index + 1}. teneffüs`} ({lesson.end} - {lesson.breakAfter ? lesson.breakAfter.split('-')[1] : schedule[index+1].start})
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

