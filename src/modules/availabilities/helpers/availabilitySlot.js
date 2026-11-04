function getSlotDate(slotDate) {
  const dateParts = slotDate?.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!dateParts) {
    return null;
  }

  const year = Number(dateParts[1]);
  const month = Number(dateParts[2]);
  const day = Number(dateParts[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getSlotDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isSlotInFuture(slot, now = new Date()) {
  const date = getSlotDate(slot.date);

  if (!date) {
    return false;
  }

  const [hours, minutes] = slot.startTime.split(':').map(Number);

  date.setHours(hours, minutes, 0, 0);

  return date > now;
}

function formatSlotDate(date) {
  const formattedDate = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  return `${formattedDate[0].toUpperCase()}${formattedDate.slice(1)}`;
}

export { formatSlotDate, getSlotDate, getSlotDateKey, isSlotInFuture };
