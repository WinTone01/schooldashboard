import { useApp } from '@/lib/store';
import { timeToMinutes, createTimeToday, calculateTimeRemaining, TimeRemaining } from '@/lib/time';
import { useMemo } from 'react';
import { Lesson } from './use-persistent-state';

export type PeriodType = 'lesson' | 'break' | 'lunch' | 'before' | 'after' | 'weekend';

export interface CurrentPeriod {
  type: PeriodType;
  lesson?: Lesson;
  index?: number;
  label?: string;
  start?: number; // minutes
  end?: number; // minutes
  endTime?: Date;
}

export function useSchedule() {
  const { settings, now } = useApp();

  const scheduleData = useMemo(() => {
    const day = now.getDay(); // 0=Sun, 5=Fri
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    let schedule: Lesson[] | null = null;
    if (day === 5) schedule = settings.fridayLessons;
    else if (day >= 1 && day <= 4) schedule = settings.weekdayLessons;

    // Weekend
    if (day === 0 || day === 6) {
       return { type: 'weekend', schedule: null } as const;
    }

    if (!schedule || schedule.length === 0) {
      return { type: 'weekend', schedule: null } as const; // Fallback
    }

    // Before first lesson
    const firstLessonStart = timeToMinutes(schedule[0].start);
    if (currentMinutes < firstLessonStart) {
      return { 
        type: 'before', 
        schedule, 
        endTime: createTimeToday(schedule[0].start, now) 
      } as const;
    }

    // After last lesson
    const lastLessonEnd = timeToMinutes(schedule[schedule.length - 1].end);
    if (currentMinutes >= lastLessonEnd) {
      return { type: 'after', schedule } as const;
    }

    // Check periods
    for (let i = 0; i < schedule.length; i++) {
      const lesson = schedule[i];
      const start = timeToMinutes(lesson.start);
      const end = timeToMinutes(lesson.end);

      // In Lesson
      if (currentMinutes >= start && currentMinutes < end) {
        return {
          type: 'lesson',
          lesson,
          index: i,
          schedule,
          start,
          end,
          endTime: createTimeToday(lesson.end, now)
        } as const;
      }

      // In Break
      // Calculate break end (start of next lesson or parsed breakAfter)
      let breakEnd = 0;
      let breakStart = end;
      
      // Use explicitly defined break if available
      if (lesson.breakAfter) {
         const [_, bEnd] = lesson.breakAfter.split('-').map(timeToMinutes);
         breakEnd = bEnd;
      } else if (i < schedule.length - 1) {
         breakEnd = timeToMinutes(schedule[i+1].start);
      }

      if (breakEnd > 0 && currentMinutes >= breakStart && currentMinutes < breakEnd) {
        return {
          type: lesson.isLunch ? 'lunch' : 'break',
          label: lesson.breakLabel || `${i + 1}. teneffüs`,
          lesson,
          index: i,
          schedule,
          start: breakStart,
          end: breakEnd,
          endTime: createTimeToday(lesson.breakAfter ? lesson.breakAfter.split('-')[1] : schedule[i+1].start, now)
        } as const;
      }
    }

    return { type: 'weekend', schedule: null } as const; // Should not reach here if logic is correct
  }, [now, settings.weekdayLessons, settings.fridayLessons]);

  const timeRemaining = useMemo(() => {
    if (scheduleData.type === 'weekend' || scheduleData.type === 'after') {
       // TODO: logic for next Monday/Day
       return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }
    
    if (scheduleData.endTime) {
       return calculateTimeRemaining(scheduleData.endTime, now);
    }

    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }, [scheduleData, now]);

  return {
    period: scheduleData,
    timeRemaining,
    schedule: scheduleData.schedule
  };
}

