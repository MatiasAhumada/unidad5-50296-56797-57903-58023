import { useState } from 'react';

function SpecialtyForm({ specialty, onSave, onCancel }) {
  const [values, setValues] = useState({
    name: specialty?.name ?? '',
    description: specialty?.description ?? '',
    status: specialty?.status ?? 'active',
  });
  const [errors, setErrors] = useState({});
  const editing = Boolean(specialty);

  const updateField = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {
      name: values.name.trim() ? '' : 'El nombre es obligatorio.',
      description: values.description.trim()
        ? ''
        : 'La descripción es obligatoria.',
    };

    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.description) return;

    onSave({
      ...specialty,
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <section
      aria-labelledby="specialty-form-title"
    >
      <div className="mb-[14px] -mt-[6px] flex items-center gap-[9px] text-[11px] text-[#8292a1]">
        <button className="border-0 bg-transparent p-0 font-[inherit] text-[#385b7c] hover:text-[#052f5d] hover:underline" type="button" onClick={onCancel}>
          Especialidades
        </button>
        <span aria-hidden="true">›</span>
        <span>
          {editing ? 'Editar especialidad' : 'Agregar nueva especialidad'}
        </span>
      </div>
      <div className="mb-[17px]">
        <h1 className="mb-[5px] mt-0 font-[Manrope,sans-serif] text-xl font-bold text-[#052f5d]" id="specialty-form-title">
          {editing ? 'Editar especialidad' : 'Registrar nueva especialidad'}
        </h1>
        <p className="m-0 text-xs leading-[1.6] text-[#596b7c]">
          Completá la información técnica y administrativa de la especialidad
          médica.
        </p>
      </div>
      <form className="max-w-[680px] rounded-[2px] border border-[#cfdae3] bg-[rgba(255,255,255,.88)] px-3 py-[14px] shadow-[0_2px_5px_rgba(27,70,96,.04)] sm:px-[15px] sm:py-[17px]" onSubmit={submit} noValidate>
        <div className="mb-[15px] grid gap-[5px]">
          <label className="text-[11px] font-semibold text-[#36495c]" htmlFor="specialty-name">Nombre de la especialidad</label>
          <input
            id="specialty-name"
            name="name"
            value={values.name}
            onChange={updateField}
            className="min-h-[39px] w-full rounded-[3px] border border-[#cbd7e0] bg-white px-[11px] py-[9px] text-[11px] text-[#263d54] outline-none placeholder:text-[#9cabb8] focus:border-[#4783ad] focus:shadow-[0_0_0_2px_rgba(71,131,173,.12)]"
            placeholder="Ej. Cardiología intervencionista"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'specialty-name-error' : undefined}
          />
          {errors.name && (
            <span className="text-[11px] text-[#b4232d]" id="specialty-name-error" role="alert">
              {errors.name}
            </span>
          )}
        </div>
        <div className="mb-[15px] grid gap-[5px]">
          <label className="text-[11px] font-semibold text-[#36495c]" htmlFor="specialty-description">Descripción</label>
          <textarea
            id="specialty-description"
            name="description"
            value={values.description}
            onChange={updateField}
            className="min-h-[112px] w-full resize-y rounded-[3px] border border-[#cbd7e0] bg-white px-[11px] py-[9px] text-[11px] text-[#263d54] outline-none placeholder:text-[#9cabb8] focus:border-[#4783ad] focus:shadow-[0_0_0_2px_rgba(71,131,173,.12)]"
            placeholder="Describí el alcance de la especialidad y sus principales procedimientos..."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? 'specialty-description-error' : undefined
            }
          />
          {errors.description && (
            <span
              className="text-[11px] text-[#b4232d]"
              id="specialty-description-error"
              role="alert"
            >
              {errors.description}
            </span>
          )}
        </div>
        <div className="mb-[15px] grid gap-[5px]">
          <label className="text-[11px] font-semibold text-[#36495c]" htmlFor="specialty-status">Estado inicial</label>
          <select
            id="specialty-status"
            className="min-h-[39px] w-full rounded-[3px] border border-[#cbd7e0] bg-white px-[11px] py-[9px] text-[11px] text-[#263d54] outline-none focus:border-[#4783ad] focus:shadow-[0_0_0_2px_rgba(71,131,173,.12)]"
            name="status"
            value={values.status}
            onChange={updateField}
          >
            <option value="active">
              Activo - Disponible para programación
            </option>
            <option value="inactive">
              Inactivo - No disponible para programación
            </option>
          </select>
        </div>
        <div className="mt-1 flex flex-col-reverse justify-end gap-[9px] border-t border-[#e4ebf0] pt-[14px] sm:flex-row sm:items-center">
          <button
            className="inline-flex min-h-[45px] items-center justify-center gap-2 whitespace-nowrap rounded-[5px] px-[17px] text-[12px] font-bold tracking-[.01em] transition hover:-translate-y-px hover:shadow-[0_7px_13px_rgba(8,59,99,.14)] border border-[#477eab] bg-white text-[#28658f] hover:bg-[#f3f9fc]"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button className="inline-flex min-h-[45px] items-center justify-center gap-2 whitespace-nowrap rounded-[5px] px-[17px] text-[12px] font-bold tracking-[.01em] transition hover:-translate-y-px hover:shadow-[0_7px_13px_rgba(8,59,99,.14)] border border-[#052f5d] bg-[#052f5d] text-white" type="submit">
            <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 4h12l3 3v13H5z" />
              <path d="M8 4v6h8V4M8 20v-7h8v7" />
            </svg>
            {editing ? 'Guardar cambios' : 'Guardar especialidad'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SpecialtyForm;
