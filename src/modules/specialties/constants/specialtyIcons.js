import {
  Activity01Icon,
  AmbulanceIcon,
  Baby01Icon,
  Bone01Icon,
  BrainIcon,
  BriefcaseMedicalIcon,
  DentalToothIcon,
  DnaIcon,
  EyeIcon,
  HealthIcon,
  HeartIcon,
  HospitalIcon,
  MedicalFileIcon,
  PillsTabletIcon,
  StethoscopeIcon,
  SyringeIcon,
} from '@hugeicons/core-free-icons';
import { createMetadataStore } from '../../shared/helpers/metadataStorage';

export const SPECIALTY_ICON_PRESETS = [
  { key: 'hospital',    label: 'Hospital / General',  icon: HospitalIcon },
  { key: 'heart',       label: 'Cardiología',         icon: HeartIcon },
  { key: 'brain',       label: 'Neurología',          icon: BrainIcon },
  { key: 'stethoscope', label: 'Medicina Clínica',    icon: StethoscopeIcon },
  { key: 'bone',        label: 'Traumatología',       icon: Bone01Icon },
  { key: 'tooth',       label: 'Odontología',         icon: DentalToothIcon },
  { key: 'eye',         label: 'Oftalmología',        icon: EyeIcon },
  { key: 'baby',        label: 'Pediatría',           icon: Baby01Icon },
  { key: 'pills',       label: 'Farmacología',        icon: PillsTabletIcon },
  { key: 'dna',         label: 'Genética',            icon: DnaIcon },
  { key: 'activity',    label: 'Urgencias',           icon: Activity01Icon },
  { key: 'ambulance',   label: 'Emergencias',         icon: AmbulanceIcon },
  { key: 'syringe',     label: 'Inmunología',         icon: SyringeIcon },
  { key: 'medical',     label: 'Atención Médica',     icon: BriefcaseMedicalIcon },
  { key: 'health',      label: 'Salud Integral',      icon: HealthIcon },
  { key: 'file',        label: 'Archivo Clínico',     icon: MedicalFileIcon },
];

const specialtyIconStore = createMetadataStore('med_specialty_icons_v1');

/**
 * Obtiene la configuración de icono para una especialidad.
 * Retorna { key, customUrl, iconComponent }
 */
export function getSpecialtyIcon(specialty) {
  if (!specialty) return { key: 'hospital', customUrl: null, iconComponent: HospitalIcon };

  const config =
    specialtyIconStore.get(specialty.id) ||
    specialtyIconStore.get(specialty.name);

  if (config) {
    if (config.customUrl) {
      return { key: 'custom', customUrl: config.customUrl, iconComponent: null };
    }
    const preset = SPECIALTY_ICON_PRESETS.find((p) => p.key === config.key);
    if (preset) {
      return { key: preset.key, customUrl: null, iconComponent: preset.icon };
    }
  }

  // Deducción inteligente por nombre de la especialidad si no tiene icono explícito
  const name = (specialty.name || '').toLowerCase();
  let defaultPreset = SPECIALTY_ICON_PRESETS[0];

  if (name.includes('cardio')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'heart');
  else if (name.includes('neuro')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'brain');
  else if (name.includes('trauma') || name.includes('ortop')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'bone');
  else if (name.includes('odon') || name.includes('dent')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'tooth');
  else if (name.includes('oftal') || name.includes('ojo') || name.includes('ocul')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'eye');
  else if (name.includes('pedia') || name.includes('infan') || name.includes('niñ')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'baby');
  else if (name.includes('clí') || name.includes('cli') || name.includes('gene')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'stethoscope');
  else if (name.includes('farma')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'pills');
  else if (name.includes('gene') || name.includes('adn') || name.includes('dna')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'dna');
  else if (name.includes('urgen')) defaultPreset = SPECIALTY_ICON_PRESETS.find((p) => p.key === 'activity');

  return {
    key: defaultPreset.key,
    customUrl: null,
    iconComponent: defaultPreset.icon,
  };
}

/**
 * Guarda el icono para una especialidad dada.
 */
export function saveSpecialtyIcon({ id, name, iconKey, customUrl }) {
  specialtyIconStore.set([id, name], {
    key: iconKey || 'hospital',
    customUrl: customUrl || null,
  });
}
