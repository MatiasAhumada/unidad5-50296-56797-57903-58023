import { createMetadataStore } from '../../shared/helpers/metadataStorage';

const specialtyStatusStore = createMetadataStore('med_specialty_status_v1');

/**
 * Retorna true si la especialidad está activa, false si está inactiva.
 * Por defecto toda especialidad es activa (true).
 */
function isSpecialtyActive(specialty) {
  if (!specialty) return true;

  const status =
    specialtyStatusStore.get(specialty.id) ??
    specialtyStatusStore.get(specialty.name);

  return status !== false;
}

/**
 * Actualiza el estado activo/inactivo de la especialidad.
 */
function setSpecialtyActive(specialty, active) {
  if (!specialty) return;

  specialtyStatusStore.set([specialty.id, specialty.name], Boolean(active));
}

export { isSpecialtyActive, setSpecialtyActive };
