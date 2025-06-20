/**
 * Converts a time string (HH:MM) to total minutes from midnight.
 * @param timeString - The time string, e.g., "09:30".
 * @returns Total minutes from midnight.
 */
export const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Converts total minutes from midnight to a time string (HH:MM).
 * @param totalMinutes - Total minutes from midnight.
 * @returns Time string, e.g., "09:30".
 */
export const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Adds a duration in minutes to a given time string.
 * @param timeString - The starting time string, e.g., "09:30".
 * @param durationMinutes - The duration to add in minutes.
 * @returns New time string after adding duration.
 */
export const addMinutesToTime = (timeString: string, durationMinutes: number): string => {
  const startMinutes = timeToMinutes(timeString);
  const endMinutes = startMinutes + durationMinutes;
  return minutesToTime(endMinutes);
};
