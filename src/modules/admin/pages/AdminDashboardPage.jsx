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
      <section className="mb-[26px] flex flex-col items-start justify-between gap-[25px] lg:flex-row lg:items-end">
        <div>
          <p className="mb-[7px] mt-0 text-[11px] font-bold tracking-[.12em] text-[#7e91a2] uppercase">Panel de administración</p>
          <h1 className="m-0 font-[Manrope,sans-serif] text-[clamp(28px,3vw,35px)] leading-[1.2] tracking-[-.055em] text-[#052f5d]">Vista general de gestión</h1>
          <p className="mt-[9px] mb-0 text-sm text-[#718193]">
            Configurá el personal médico y las especialidades del departamento.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto">
          <button
            className="inline-flex min-h-[45px] items-center justify-center gap-2 whitespace-nowrap rounded-[5px] px-[17px] text-[12px] font-bold tracking-[.01em] transition hover:-translate-y-px hover:shadow-[0_7px_13px_rgba(8,59,99,.14)] border border-[#052f5d] bg-[#052f5d] text-white"
            type="button"
            onClick={() =>
              setToast(
                'El formulario para agregar un doctor estará disponible próximamente.'
              )
            }
          >
            <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Agregar nuevo doctor
          </button>
          <button
            className="inline-flex min-h-[45px] items-center justify-center gap-2 whitespace-nowrap rounded-[5px] px-[17px] text-[12px] font-bold tracking-[.01em] transition hover:-translate-y-px hover:shadow-[0_7px_13px_rgba(8,59,99,.14)] border border-[#0b5d91] bg-transparent text-[#0c5987] hover:bg-[#e6f4fb]"
            type="button"
            onClick={() => navigate('/admin/specialties')}
          >
            <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 4 3 5H9l3-5ZM6 14h5v5H6zM13 14h5v5h-5zM12 9v3" />
            </svg>
            Agregar especialidad
          </button>
        </div>
      </section>

      <section className="mb-[25px] grid grid-cols-1 gap-[14px] md:grid-cols-3" aria-label="Resumen de actividad">
        <article className="min-h-[105px] rounded-[5px] border border-[#cfdae3] bg-[rgba(255,255,255,.76)] px-[15px] pt-[15px] pb-[14px] shadow-[0_6px_20px_rgba(24,65,91,.025)] md:min-h-[120px]">
          <div className="flex min-h-10 items-start justify-between">
            <span className="grid h-[31px] w-[31px] place-items-center rounded-[9px] bg-[#f0f5fa] text-[#093d78]">
              <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24">
                <path d="M5 8h14v12H5zM8.5 8V6.5A2.5 2.5 0 0 1 11 4h2a2.5 2.5 0 0 1 2.5 2.5V8M12 11v5M9.5 13.5h5" />
              </svg>
            </span>
            <span className="rounded-[3px] bg-[#effcf9] px-[7px] py-1 text-[10px] font-bold text-[#13a695]">+4 este mes</span>
          </div>
          <p className="mt-0 mb-[5px] text-xs font-semibold uppercase text-[#354b61]">Doctores activos</p>
          <strong className="font-[Manrope,sans-serif] text-[29px] tracking-[-.04em] text-[#052f5d]">124</strong>
        </article>
        <article className="min-h-[105px] rounded-[5px] border border-[#cfdae3] bg-[rgba(255,255,255,.76)] px-[15px] pt-[15px] pb-[14px] shadow-[0_6px_20px_rgba(24,65,91,.025)] md:min-h-[120px]">
          <div className="flex min-h-10 items-start justify-between">
            <span className="grid h-[31px] w-[31px] place-items-center rounded-[9px] bg-[#edf8fc] text-[#0780b8]">
              <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
              </svg>
            </span>
            <span className="rounded-[3px] bg-[#f3f6f8] px-[7px] py-1 text-[10px] font-bold text-[#6d7d8e]">Estable</span>
          </div>
          <p className="mt-0 mb-[5px] text-xs font-semibold uppercase text-[#354b61]">Especialidades activas</p>
          <strong className="font-[Manrope,sans-serif] text-[29px] tracking-[-.04em] text-[#052f5d]">32</strong>
        </article>
        <article className="min-h-[105px] rounded-[5px] border border-[#cfdae3] bg-[rgba(255,255,255,.76)] px-[15px] pt-[15px] pb-[14px] shadow-[0_6px_20px_rgba(24,65,91,.025)] md:min-h-[120px]">
          <div className="flex min-h-10 items-start justify-between">
            <span className="grid h-[31px] w-[31px] place-items-center rounded-[9px] bg-[#f0f8f5] text-[#197866]">
              <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24">
                <rect x="5" y="6" width="14" height="14" rx="2" />
                <path d="M8 4v4M16 4v4M5 10h14M9 14.2l2 2 4-4" />
              </svg>
            </span>
            <span className="rounded-[3px] bg-[#eef4ff] px-[7px] py-1 text-[10px] font-bold text-[#2978da]">Hoy</span>
          </div>
          <p className="mt-0 mb-[5px] text-xs font-semibold uppercase text-[#354b61]">Turnos confirmados para hoy</p>
          <strong className="font-[Manrope,sans-serif] text-[29px] tracking-[-.04em] text-[#052f5d]">48</strong>
        </article>
      </section>

      <DoctorDirectory onAction={setToast} />
      <div
        className={`pointer-events-none fixed right-[25px] bottom-6 z-[30] max-w-[280px] translate-y-2 rounded-[5px] border border-[#bce5dc] bg-[#effbf8] px-4 py-3 text-[11px] text-[#08796d] opacity-0 shadow-[0_9px_25px_rgba(24,75,86,.16)] transition duration-200 ${toast ? 'translate-y-0 opacity-100' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}

export default AdminDashboardPage;
