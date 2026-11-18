import { ICONS } from '../../shared/constants/icons';

const DEFAULT_ICON_RULES = [
  { icon: ICONS.heart, keywords: ['cardio'] },
  { icon: ICONS.brain, keywords: ['neuro', 'psiqu', 'psico'] },
  { icon: ICONS.bone, keywords: ['trauma', 'ortop'] },
  { icon: ICONS.tooth, keywords: ['odon', 'dent'] },
  { icon: ICONS.eye, keywords: ['oftal', 'ojo', 'ocul'] },
  { icon: ICONS.baby, keywords: ['pedia', 'infan', 'niñ', 'neonat'] },
  { icon: ICONS.dna, keywords: ['genét', 'genet', 'adn', 'dna'] },
  { icon: ICONS.stethoscope, keywords: ['clí', 'cli', 'general', 'inter'] },
  { icon: ICONS.pills, keywords: ['farma'] },
  { icon: ICONS.activity, keywords: ['urgen', 'emergen', 'terapia'] },
  { icon: ICONS.syringe, keywords: ['inmuno', 'vacun', 'alerg'] },
];

/**
 * Resuelve de forma determinística el icono representativo de una especialidad
 * a partir de su nombre, usando el catálogo centralizado ICONS.
 */
function getSpecialtyIcon(specialty) {
  const normalizedName = (specialty?.name || '').trim().toLowerCase();

  if (!normalizedName) {
    return ICONS.hospital;
  }

  const matchedRule = DEFAULT_ICON_RULES.find(({ keywords }) =>
    keywords.some((keyword) => normalizedName.includes(keyword))
  );

  return matchedRule ? matchedRule.icon : ICONS.hospital;
}

export { getSpecialtyIcon };
