export interface SchedulePreset {
  id: string;
  label: string;
  date: Date;
}

export const getSchedulingPresets = (currentTime: Date = new Date()): SchedulePreset[] => {
  const presets: SchedulePreset[] = [];
  const now = new Date(currentTime);
  const currentHour = now.getHours();
  
  // 8pm today (if before 8pm)
  if (currentHour < 20) {
    const today8pm = new Date(now);
    today8pm.setHours(20, 0, 0, 0);
    presets.push({
      id: 'today-8pm',
      label: '8pm today',
      date: today8pm
    });
  }
  
  // 8am tomorrow
  const tomorrow8am = new Date(now);
  tomorrow8am.setDate(tomorrow8am.getDate() + 1);
  tomorrow8am.setHours(8, 0, 0, 0);
  presets.push({
    id: 'tomorrow-8am',
    label: '8am tomorrow',
    date: tomorrow8am
  });
  
  // 10am tomorrow
  const tomorrow10am = new Date(now);
  tomorrow10am.setDate(tomorrow10am.getDate() + 1);
  tomorrow10am.setHours(10, 0, 0, 0);
  presets.push({
    id: 'tomorrow-10am',
    label: '10am tomorrow',
    date: tomorrow10am
  });
  
  return presets;
};

export const formatScheduledTime = (date: Date): string => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();
  
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  if (isToday) return `Today at ${timeStr}`;
  if (isTomorrow) return `Tomorrow at ${timeStr}`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

