"use client";

import { Header } from '@/components/dashboard/header';
import { LessonList } from '@/components/dashboard/lesson-list';
import { StatusCard } from '@/components/dashboard/status-card';
import { WatchDutyList } from '@/components/dashboard/watch-duty';
import { useApp } from '@/lib/store';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { SettingsDialog } from '@/components/settings/settings-dialog';
import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { ExamModeOverlay } from '@/components/dashboard/exam-mode-overlay';
import { Maximize, Settings, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const { settings, isExamMode } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="block h-screen w-screen overflow-hidden bg-background text-foreground">
        <div className="container mx-auto p-4 h-full flex flex-col max-w-[1920px]">
          <Header />

          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 min-h-0 pb-2 overflow-y-auto lg:overflow-visible">
            {/* Sidebar - Lesson List */}
            <div className="w-full lg:col-span-3 lg:h-full min-h-0 shrink-0">
              <LessonList />
            </div>

            {/* Main Content */}
            <div className="w-full lg:col-span-9 flex flex-col gap-4 lg:gap-6 min-h-0">
              {/* Status Section */}
              <div className="shrink-0 lg:flex-[2]">
                <StatusCard />
              </div>

              {/* Watch Duties */}
              {settings.showWatchDuties && (
                <div className="shrink-0 lg:flex-[3] min-h-0">
                  <WatchDutyList />
                </div>
              )}

              {/* Footer Quote */}
              <div className="text-center text-muted-foreground text-xs lg:text-sm font-medium py-2 mt-auto">
                Hiçbir şeye ihtiyacımız yok, yalnız bir şeye ihtiyacımız vardır; ÇALIŞKAN OLMAK!
                <br />
                <span className="font-bold">Mustafa Kemal ATATÜRK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overlays */}
        {isExamMode && <ExamModeOverlay />}
        
        <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        
      </ContextMenuTrigger>
      
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => setIsSettingsOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Ayarlar</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={toggleFullscreen}>
          <Maximize className="mr-2 h-4 w-4" />
          <span>Tam Ekran</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => window.open('https://www.unalozkurt.com/iletisim/', '_blank')}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          <span>Sorun Bildir</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
