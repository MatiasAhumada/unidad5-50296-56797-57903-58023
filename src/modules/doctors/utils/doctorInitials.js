const HONORIFICS = new Set(['dr', 'dr.', 'dra', 'dra.', 'lic', 'lic.']);

function getDoctorInitials(name) {
  const words = (name || '')
    .trim()
    .split(/\s+/)
    .filter((word) => word && !HONORIFICS.has(word.toLowerCase()));

  if (words.length === 0) return 'DR';

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export { getDoctorInitials };
