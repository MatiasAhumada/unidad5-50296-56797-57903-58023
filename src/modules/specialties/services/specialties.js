const STORAGE_KEY = 'medportal-specialties';

export async function loadSpecialties() {
  const storedSpecialties = localStorage.getItem(STORAGE_KEY);

  if (storedSpecialties) return JSON.parse(storedSpecialties);

  const response = await fetch('/specialties.json');

  if (!response.ok)
    throw new Error('No se pudieron cargar las especialidades.');

  const specialties = await response.json();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(specialties));

  return specialties;
}

export function persistSpecialties(specialties) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(specialties));
}
