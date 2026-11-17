const WEEK_DAYS = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
  { key: 'SABADO', label: 'Sábado' },
  { key: 'DOMINGO', label: 'Domingo' },
];

function normalizeDayKey(value) {
  return (value || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function toTimeSpanString(timeValue) {
  return timeValue.length === 5 ? `${timeValue}:00` : timeValue;
}

function buildScheduleFromAvailabilities(availabilities = []) {
  const scheduleMap = new Map();

  availabilities.forEach((item) => {
    scheduleMap.set(normalizeDayKey(item.day), {
      startTime: item.startTime?.slice(0, 5) || '08:00',
      endTime: item.endTime?.slice(0, 5) || '16:00',
    });
  });

  return WEEK_DAYS.map(({ key, label }) => {
    const existing = scheduleMap.get(key);

    return {
      day: key,
      label,
      active: Boolean(existing),
      startTime: existing?.startTime || '08:00',
      endTime: existing?.endTime || '16:00',
    };
  });
}

function buildAvailabilityPayload(doctorId, activeDays) {
  return {
    doctorId,
    days: activeDays.map((dayItem) => ({
      day: normalizeDayKey(dayItem.day),
      startTime: toTimeSpanString(dayItem.startTime),
      endTime: toTimeSpanString(dayItem.endTime),
    })),
  };
}

export {
  WEEK_DAYS,
  buildAvailabilityPayload,
  buildScheduleFromAvailabilities,
  normalizeDayKey,
};
