import { useState, useEffect, useRef } from 'react';

interface TimeState {
  now: Date;
  isSynced: boolean;
}

export function useTimeSync() {
  const [timeState, setTimeState] = useState<TimeState>({
    now: new Date(),
    isSynced: false,
  });
  
  // Stores the offset between server time and performance.now()
  const syncDataRef = useRef<{
    serverTimeAtSync: number;
    performanceTimeAtSync: number;
  } | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let syncIntervalId: NodeJS.Timeout;

    const syncTime = async () => {
      try {
        const start = performance.now();
        const response = await fetch('/api/time');
        const data = await response.json();
        const end = performance.now();
        
        // Network latency adjustment (approximate half RTT)
        const latency = (end - start) / 2;
        const serverTime = new Date(data.time).getTime() + latency;
        
        syncDataRef.current = {
          serverTimeAtSync: serverTime,
          performanceTimeAtSync: performance.now(),
        };
        
        setTimeState(prev => ({ ...prev, isSynced: true }));
      } catch (error) {
        console.error('Time sync failed:', error);
      }
    };

    // Initial sync
    syncTime();

    // Re-sync every 5 minutes
    syncIntervalId = setInterval(syncTime, 5 * 60 * 1000);

    // Update clock every second (or frame)
    const updateClock = () => {
      if (syncDataRef.current) {
        const elapsed = performance.now() - syncDataRef.current.performanceTimeAtSync;
        const currentServerTime = new Date(syncDataRef.current.serverTimeAtSync + elapsed);
        setTimeState({ now: currentServerTime, isSynced: true });
      } else {
        // Fallback to device time if not synced
        setTimeState({ now: new Date(), isSynced: false });
      }
    };

    intervalId = setInterval(updateClock, 1000);
    updateClock(); // Immediate update

    return () => {
      clearInterval(intervalId);
      clearInterval(syncIntervalId);
    };
  }, []);

  return timeState;
}

