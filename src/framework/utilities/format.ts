export const showTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export const showTimestamp = (s: Date) =>
  `${s.toLocaleDateString()} ${String(s.getHours()).padStart(2, '0')}:${String(s.getMinutes()).padStart(2, '0')}:${String(s.getSeconds()).padStart(2, '0')}`;
