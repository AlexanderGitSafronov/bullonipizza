// Static working hours — replace with admin-editable settings later.
// Times are in Europe/Kyiv local time (matches the displayed locale).
export const OPEN_HOUR = 10; // 10:00
export const CLOSE_HOUR = 23; // 23:00

export interface HoursStatus {
  open: boolean;
  /** ISO-ish "HH:mm" string for the next milestone. */
  next: string;
}

export function workingHoursStatus(now = new Date()): HoursStatus {
  const h = now.getHours();
  if (h >= OPEN_HOUR && h < CLOSE_HOUR) {
    return { open: true, next: `${CLOSE_HOUR.toString().padStart(2, "0")}:00` };
  }
  return { open: false, next: `${OPEN_HOUR.toString().padStart(2, "0")}:00` };
}
