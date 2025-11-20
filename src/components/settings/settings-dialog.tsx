"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lesson, Settings } from '@/hooks/use-persistent-state';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Moon, Sun, Upload } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings, setExamMode, setExamConfig, isExamMode } = useApp();
  const { theme, setTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");
  
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  
  // Exam config state
  const [examForm, setExamForm] = useState({
    verbalStart: settings.examSettings.verbalStart || "09:30",
    verbalEnd: settings.examSettings.verbalEnd || "11:30",
    breakDuration: settings.examSettings.breakDuration || 15,
    mathStart: settings.examSettings.mathStart || "11:45",
    mathEnd: settings.examSettings.mathEnd || "13:00"
  });

  // Sync local settings when modal opens
  useEffect(() => {
    if (open) {
       setLocalSettings(settings);
       // Reset auth state when reopened
       setIsAuthenticated(false);
       setPinInput("");
       setError("");
    }
  }, [open, settings]);

  const handleLogin = () => {
    if (pinInput === settings.pin) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Hatalı PIN kodu");
    }
  };

  const handleSave = () => {
    updateSettings(localSettings);
    onOpenChange(false);
  };

  const handleLessonChange = (
    dayType: 'weekdayLessons' | 'fridayLessons', 
    index: number, 
    field: keyof Lesson, 
    value: any
  ) => {
    const newLessons = [...localSettings[dayType]];
    newLessons[index] = { ...newLessons[index], [field]: value };
    setLocalSettings({ ...localSettings, [dayType]: newLessons });
  };

  const addLesson = (dayType: 'weekdayLessons' | 'fridayLessons') => {
    const currentLessons = localSettings[dayType];
    const lastLesson = currentLessons[currentLessons.length - 1];
    // Simple logic: add 40 mins to last end
    const newStart = lastLesson?.end || "08:30";
    
    setLocalSettings({
      ...localSettings,
      [dayType]: [
        ...currentLessons,
        { 
          name: `${currentLessons.length + 1}. Ders`, 
          start: newStart, 
          end: newStart, // User will edit
          breakAfter: null 
        }
      ]
    });
  };

  const removeLesson = (dayType: 'weekdayLessons' | 'fridayLessons', index: number) => {
    const newLessons = localSettings[dayType].filter((_, i) => i !== index);
    setLocalSettings({ ...localSettings, [dayType]: newLessons });
  };

  // Watch Duty Logic
  const handleLocationChange = (index: number, value: string) => {
     const newLocations = [...localSettings.watchDuties.locations];
     newLocations[index] = value;
     setLocalSettings({
       ...localSettings,
       watchDuties: { ...localSettings.watchDuties, locations: newLocations }
     });
  };

  const handleTeacherChange = (day: keyof typeof localSettings.watchDuties.schedule, index: number, value: string) => {
     const newSchedule = { ...localSettings.watchDuties.schedule };
     const newDayList = [...newSchedule[day]];
     newDayList[index] = value;
     newSchedule[day] = newDayList;
     
     setLocalSettings({
       ...localSettings,
       watchDuties: { ...localSettings.watchDuties, schedule: newSchedule }
     });
  };

  const startExamMode = () => {
     setExamConfig(examForm);
     setExamMode(true);
     onOpenChange(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings({ ...localSettings, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLocalSettings({ ...localSettings, logo: undefined });
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Giriş Yapın</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <Label>PIN Kodu</Label>
              <Input 
                type="password" 
                value={pinInput} 
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button onClick={handleLogin}>Giriş</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] flex flex-col p-6 sm:max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Ayarlar</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Genel & Sınav</TabsTrigger>
              <TabsTrigger value="weekday">Hafta İçi</TabsTrigger>
              <TabsTrigger value="friday">Cuma</TabsTrigger>
              <TabsTrigger value="watch">Nöbetler</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1 p-4 border rounded-md mt-2">
              <TabsContent value="general" className="space-y-6">
                <div className="space-y-2">
                  <Label>Okul Adı</Label>
                  <Input 
                    value={localSettings.schoolName} 
                    onChange={(e) => setLocalSettings({...localSettings, schoolName: e.target.value})} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>PIN Kodu (Giriş Şifresi)</Label>
                  <Input 
                    value={localSettings.pin || "1234"} 
                    onChange={(e) => setLocalSettings({...localSettings, pin: e.target.value})} 
                    placeholder="Varsayılan: 1234"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label>Okul Logosu</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="logo-upload"
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> Logo Yükle
                    </Button>
                    {localSettings.logo && (
                      <Button variant="destructive" size="icon" onClick={removeLogo}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {localSettings.logo && (
                    <div className="ml-2 h-10 w-10 relative border rounded overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={localSettings.logo} alt="Logo Önizleme" className="object-contain w-full h-full" />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={localSettings.showWatchDuties} 
                    onCheckedChange={(checked) => setLocalSettings({...localSettings, showWatchDuties: checked})}
                  />
                  <Label>Nöbetçi Öğretmenler Bölümünü Göster</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Label>Tema Modu</Label>
                  <div className="flex items-center border rounded-md p-1">
                    <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('light')}><Sun className="h-4 w-4 mr-1" /> Açık</Button>
                    <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('dark')}><Moon className="h-4 w-4 mr-1" /> Koyu</Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Deneme Sınavı Başlat</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Sözel Başlangıç</Label>
                      <Input type="time" value={examForm.verbalStart} onChange={(e) => setExamForm({...examForm, verbalStart: e.target.value})} />
                    </div>
                    <div>
                      <Label>Sözel Bitiş</Label>
                      <Input type="time" value={examForm.verbalEnd} onChange={(e) => setExamForm({...examForm, verbalEnd: e.target.value})} />
                    </div>
                    <div>
                       <Label>Teneffüs (dk)</Label>
                       <Input type="number" value={examForm.breakDuration} onChange={(e) => setExamForm({...examForm, breakDuration: parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <Label>Sayısal Başlangıç</Label>
                      <Input type="time" value={examForm.mathStart} onChange={(e) => setExamForm({...examForm, mathStart: e.target.value})} />
                    </div>
                    <div>
                      <Label>Sayısal Bitiş</Label>
                      <Input type="time" value={examForm.mathEnd} onChange={(e) => setExamForm({...examForm, mathEnd: e.target.value})} />
                    </div>
                  </div>
                  <Button onClick={startExamMode} className="w-full" variant="destructive">
                    Deneme Sınavı Modunu Başlat
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="weekday" className="space-y-4">
                {localSettings.weekdayLessons.map((lesson, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input value={lesson.name} onChange={(e) => handleLessonChange('weekdayLessons', index, 'name', e.target.value)} className="w-24" />
                    <Input type="time" value={lesson.start} onChange={(e) => handleLessonChange('weekdayLessons', index, 'start', e.target.value)} />
                    <Input type="time" value={lesson.end} onChange={(e) => handleLessonChange('weekdayLessons', index, 'end', e.target.value)} />
                    <Button size="icon" variant="ghost" onClick={() => removeLesson('weekdayLessons', index)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button onClick={() => addLesson('weekdayLessons')} variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4" /> Ders Ekle</Button>
              </TabsContent>

              <TabsContent value="friday" className="space-y-4">
                 {localSettings.fridayLessons.map((lesson, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input value={lesson.name} onChange={(e) => handleLessonChange('fridayLessons', index, 'name', e.target.value)} className="w-24" />
                    <Input type="time" value={lesson.start} onChange={(e) => handleLessonChange('fridayLessons', index, 'start', e.target.value)} />
                    <Input type="time" value={lesson.end} onChange={(e) => handleLessonChange('fridayLessons', index, 'end', e.target.value)} />
                    <Button size="icon" variant="ghost" onClick={() => removeLesson('fridayLessons', index)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button onClick={() => addLesson('fridayLessons')} variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4" /> Ders Ekle</Button>
              </TabsContent>

              <TabsContent value="watch">
                 <div className="overflow-auto">
                   <table className="w-full text-sm border-collapse">
                     <thead>
                       <tr>
                         <th className="p-2 border">Yer</th>
                         <th className="p-2 border">Pazartesi</th>
                         <th className="p-2 border">Salı</th>
                         <th className="p-2 border">Çarşamba</th>
                         <th className="p-2 border">Perşembe</th>
                         <th className="p-2 border">Cuma</th>
                       </tr>
                     </thead>
                     <tbody>
                       {localSettings.watchDuties.locations.map((loc, i) => (
                         <tr key={i}>
                           <td className="p-1 border"><Input value={loc} onChange={(e) => handleLocationChange(i, e.target.value)} /></td>
                           <td className="p-1 border"><Input value={localSettings.watchDuties.schedule.monday[i] || ''} onChange={(e) => handleTeacherChange('monday', i, e.target.value)} /></td>
                           <td className="p-1 border"><Input value={localSettings.watchDuties.schedule.tuesday[i] || ''} onChange={(e) => handleTeacherChange('tuesday', i, e.target.value)} /></td>
                           <td className="p-1 border"><Input value={localSettings.watchDuties.schedule.wednesday[i] || ''} onChange={(e) => handleTeacherChange('wednesday', i, e.target.value)} /></td>
                           <td className="p-1 border"><Input value={localSettings.watchDuties.schedule.thursday[i] || ''} onChange={(e) => handleTeacherChange('thursday', i, e.target.value)} /></td>
                           <td className="p-1 border"><Input value={localSettings.watchDuties.schedule.friday[i] || ''} onChange={(e) => handleTeacherChange('friday', i, e.target.value)} /></td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                   {/* TODO: Add location button */}
                 </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        <div className="flex justify-end pt-4 border-t mt-auto">
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Kaydet</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
