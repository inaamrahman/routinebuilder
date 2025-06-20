import { TemplateTaskItem } from './types';

export const TASK_COLORS: string[] = [
  'bg-red-400', 'bg-orange-400', 'bg-amber-400', 
  'bg-lime-400', 'bg-green-400', 'bg-emerald-400', 'bg-teal-400',
  'bg-cyan-400', 'bg-sky-400', 'bg-blue-400', 'bg-indigo-400',
  'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400',
  'bg-rose-400',
];

export const DEFAULT_TASK_COLOR: string = 'bg-slate-400';
export const APP_PRODID: string = '-//DailyRoutinePlanner//NONSGML v1.0//EN';
export const DEFAULT_START_TIME: string = "09:00";

export const PRODUCTIVITY_TEMPLATE_TASKS: TemplateTaskItem[] = [
  { title: "Morning Deep Work Block", durationMinutes: 120, description: "Focus on most important tasks." },
  { title: "Review & Quick Tasks", durationMinutes: 45, description: "Emails, quick to-dos." },
  { title: "Lunch Break", durationMinutes: 60, description: "Rest and recharge." },
  { title: "Meetings & Collaboration", durationMinutes: 90, description: "Scheduled calls or team work." },
  { title: "Afternoon Work Session", durationMinutes: 120, description: "Continue with tasks or projects." },
  { title: "Plan Next Day", durationMinutes: 30, description: "Review progress, plan for tomorrow." },
];
