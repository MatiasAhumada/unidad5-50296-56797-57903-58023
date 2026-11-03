const AUTH_VALIDATION = {
  emailPattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Ingresá un correo electrónico válido',
  },
  adminPasswordMinLength: 8,
  dniPattern: {
    value: /^\d{7,8}$/,
    message: 'El DNI debe tener 7 u 8 dígitos',
  },
};

export { AUTH_VALIDATION };
