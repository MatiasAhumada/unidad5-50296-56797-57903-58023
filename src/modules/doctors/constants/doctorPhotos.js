import { createMetadataStore } from '../../shared/helpers/metadataStorage';

const doctorPhotoStore = createMetadataStore('med_doctor_photos_v1');

/**
 * Obtiene la URL o Base64 de la foto de un doctor.
 */
export function getDoctorPhoto(doctor) {
  if (!doctor) return null;

  return (
    doctorPhotoStore.get(doctor.id) ||
    doctorPhotoStore.get(doctor.licenseNumber) ||
    doctorPhotoStore.get(doctor.name)
  );
}

/**
 * Guarda o elimina la foto de un doctor por ID, matrícula y nombre.
 */
export function saveDoctorPhoto({ id, licenseNumber, name, photoUrl }) {
  doctorPhotoStore.set([id, licenseNumber, name], photoUrl || null);
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
