import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DoctorDirectory from '../components/DoctorDirectory';

function AdminDashboardPage() {
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(''), 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="section-kicker">Panel de administración</p>
          <h1>Vista general de gestión</h1>
          <p>
            Configurá el personal médico y las especialidades del departamento.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button button--primary"
            type="button"
            onClick={() =>
              setToast(
                'El formulario para agregar un doctor estará disponible próximamente.'
              )
            }
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Agregar nuevo doctor
          </button>
          <button
            className="button button--outline"
            type="button"
            onClick={() => navigate('/admin/specialties')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 4 3 5H9l3-5ZM6 14h5v5H6zM13 14h5v5h-5zM12 9v3" />
            </svg>
            Agregar especialidad
          </button>
        </div>
      </section>

      <section className="stats-grid" aria-label="Resumen de actividad">
        <article className="stat-card">
          <div className="stat-card__top">
            <span className="stat-icon stat-icon--blue">
              <svg viewBox="0 0 24 24">
                <path d="M5 8h14v12H5zM8.5 8V6.5A2.5 2.5 0 0 1 11 4h2a2.5 2.5 0 0 1 2.5 2.5V8M12 11v5M9.5 13.5h5" />
              </svg>
            </span>
            <span className="trend trend--up">+4 este mes</span>
          </div>
          <p>Doctores activos</p>
          <strong>124</strong>
        </article>
        <article className="stat-card">
          <div className="stat-card__top">
            <span className="stat-icon stat-icon--cyan">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
              </svg>
            </span>
            <span className="trend">Estable</span>
          </div>
          <p>Especialidades activas</p>
          <strong>32</strong>
        </article>
        <article className="stat-card">
          <div className="stat-card__top">
            <span className="stat-icon stat-icon--green">
              <svg viewBox="0 0 24 24">
                <rect x="5" y="6" width="14" height="14" rx="2" />
                <path d="M8 4v4M16 4v4M5 10h14M9 14.2l2 2 4-4" />
              </svg>
            </span>
            <span className="trend trend--today">Hoy</span>
          </div>
          <p>Turnos confirmados para hoy</p>
          <strong>48</strong>
        </article>
      </section>

      <DoctorDirectory onAction={setToast} />
      <div
        className={`toast${toast ? ' is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}

export default AdminDashboardPage;
