import { useState } from 'react';
import FormField from '../../shared/components/FormField';
import Icon from '../../shared/components/Icon';
import IconButton from '../../shared/components/IconButton';
import Input from '../../shared/components/Input';
import { ICONS } from '../../shared/constants/icons';
import { AUTH_VALIDATION } from '../constants/validation';

function AuthPasswordField({ register, error, disabled, id }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField id={id} label="Contraseña" error={error} required>
      {(fieldProps) => (
        <div className="relative">
          <span
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted"
            aria-hidden="true"
          >
            <Icon icon={ICONS.lock} size={16} />
          </span>
          <Input
            type={isVisible ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={disabled}
            className="py-2.5 pl-10 pr-12 text-sm"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: AUTH_VALIDATION.adminPasswordMinLength,
                message: 'La contraseña debe tener al menos 8 caracteres',
              },
            })}
            {...fieldProps}
          />
          <IconButton
            type="button"
            icon={isVisible ? ICONS.eyeOff : ICONS.eye}
            label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={isVisible}
            disabled={disabled}
            size={16}
            onClick={() => setIsVisible((visible) => !visible)}
            className="absolute inset-y-0 right-0 text-med-text-muted hover:text-med-text-main"
          />
        </div>
      )}
    </FormField>
  );
}

export default AuthPasswordField;
