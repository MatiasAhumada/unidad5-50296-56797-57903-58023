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
      className="specialty-form-view"
      aria-labelledby="specialty-form-title"
    >
      <div className="form-breadcrumb">
        <button type="button" onClick={onCancel}>
          Especialidades
        </button>
        <span aria-hidden="true">›</span>
        <span>
          {editing ? 'Editar especialidad' : 'Agregar nueva especialidad'}
        </span>
      </div>
      <div className="specialty-form-heading">
        <h1 id="specialty-form-title">
          {editing ? 'Editar especialidad' : 'Registrar nueva especialidad'}
        </h1>
        <p>
          Completá la información técnica y administrativa de la especialidad
          médica.
        </p>
      </div>
      <form className="specialty-form-card" onSubmit={submit} noValidate>
        <div className="form-field">
          <label htmlFor="specialty-name">Nombre de la especialidad</label>
          <input
            id="specialty-name"
            name="name"
            value={values.name}
            onChange={updateField}
            placeholder="Ej. Cardiología intervencionista"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'specialty-name-error' : undefined}
          />
          {errors.name && (
            <span className="form-error" id="specialty-name-error" role="alert">
              {errors.name}
            </span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="specialty-description">Descripción</label>
          <textarea
            id="specialty-description"
            name="description"
            value={values.description}
            onChange={updateField}
            placeholder="Describí el alcance de la especialidad y sus principales procedimientos..."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? 'specialty-description-error' : undefined
            }
          />
          {errors.description && (
            <span
              className="form-error"
              id="specialty-description-error"
              role="alert"
            >
              {errors.description}
            </span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="specialty-status">Estado inicial</label>
          <select
            id="specialty-status"
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
        <div className="specialty-form-actions">
          <button
            className="button button--cancel"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button className="button button--primary" type="submit">
            <svg viewBox="0 0 24 24" aria-hidden="true">
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
