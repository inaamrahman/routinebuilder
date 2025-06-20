
import { RoutineTask } from '../types';
import { APP_PRODID } from '../constants';

// Helper to format date/time for ICS. For floating times, we use YYYYMMDDTHHMMSS
const formatDateTime = (date: Date, time: string): string => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const [hours, minutes] = time.split(':');
  return `${year}${month}${day}T${hours}${minutes}00`;
};

// Helper for DTSTAMP (UTC)
const getDtStamp = (): string => {
  return new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15) + 'Z';
};

export const generateICSContent = (tasks: RoutineTask[]): string => {
  const today = new Date(); // Use current date for all events
  const dtStamp = getDtStamp();

  let icsString = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:${APP_PRODID}
CALSCALE:GREGORIAN
`;

  tasks.forEach(task => {
    const uid = `${formatDateTime(today, task.startTime)}-${task.id}@dailyroutine.app`;
    const dtStart = formatDateTime(today, task.startTime);
    const dtEnd = formatDateTime(today, task.endTime);

    icsString += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtStamp}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${task.title.replace(/[;,\\"]/g, '\\$&')}
`;
    if (task.description) {
      // Escape special characters for DESCRIPTION
      // \n becomes \\n, ; becomes \;, , becomes \,, \ becomes \\
      const description = task.description
                            .replace(/\\/g, '\\\\')
                            .replace(/\n/g, '\\n')
                            .replace(/;/g, '\\;')
                            .replace(/,/g, '\\,');
      icsString += `DESCRIPTION:${description}\n`;
    }
    icsString += `END:VEVENT\n`;
  });

  icsString += `END:VCALENDAR`;
  return icsString;
};

export const downloadICSFile = (icsContent: string, filename: string): void => {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
