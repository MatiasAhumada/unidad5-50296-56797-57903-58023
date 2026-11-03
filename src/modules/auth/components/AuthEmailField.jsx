import FormField from '../../shared/components/FormField';
import Icon from '../../shared/components/Icon';
import Input from '../../shared/components/Input';
import { ICONS } from '../../shared/constants/icons';
import { AUTH_VALIDATION } from '../constants/validation';

function AuthEmailField({ register, error, disabled, id, placeholder }) {
  return (
    <FormField id={id} label="Correo electrónico" error={error} required>
      {(fieldProps) => (
        <div className="relative">
          <span
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted"
            aria-hidden="true"
          >
            <Icon icon={ICONS.mail} size={16} />
          </span>
          <Input
            type="email"
            autoComplete="email"
            placeholder={placeholder}
            disabled={disabled}
            className="py-2.5 pl-10 pr-3.5 text-sm"
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: AUTH_VALIDATION.emailPattern,
            })}
            {...fieldProps}
          />
        </div>
      )}
    </FormField>
  );
}

export default AuthEmailField;
