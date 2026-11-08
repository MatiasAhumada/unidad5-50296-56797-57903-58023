const STORAGE_KEY = 'med_doctor_photos_v1';

function getAllStoredPhotos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Obtiene la URL o Base64 de la foto de un doctor.
 */
export function getDoctorPhoto(doctor) {
  if (!doctor) return null;

  const store = getAllStoredPhotos();
  return (
    (doctor.id && store[doctor.id]) ||
    (doctor.licenseNumber && store[doctor.licenseNumber]) ||
    (doctor.name && store[doctor.name.trim().toLowerCase()]) ||
    null
  );
}

/**
 * Guarda la foto de un doctor por ID, matrícula y nombre.
 */
export function saveDoctorPhoto({ id, licenseNumber, name, photoUrl }) {
  try {
    const store = getAllStoredPhotos();
    if (photoUrl) {
      if (id) store[id] = photoUrl;
      if (licenseNumber) store[licenseNumber] = photoUrl;
      if (name) store[name.trim().toLowerCase()] = photoUrl;
    } else {
      if (id) delete store[id];
      if (licenseNumber) delete store[licenseNumber];
      if (name) delete store[name.trim().toLowerCase()];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn('Error guardando foto del doctor en localStorage:', err);
  }
}

/**
 * Avatares de ejemplo para sugerir si el usuario no tiene una foto a mano.
 */
export const SAMPLE_DOCTOR_AVATARS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594824813576-42709e99a80d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
];
