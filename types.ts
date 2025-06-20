export interface RoutineTask {
  id: string;
  title: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  description?: string;
  color: string; // Tailwind background color class e.g. 'bg-blue-500'
}

// Used for the task form, ID is optional for new tasks
export interface TaskFormData {
  id?: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface TemplateTaskItem {
  title: string;
  durationMinutes: number;
  description?: string;
}
