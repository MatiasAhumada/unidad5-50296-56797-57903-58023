import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Icon from '../../shared/components/Icon';
import IconButton from '../../shared/components/IconButton';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  confirmAction,
  showError,
  showSuccess,
} from '../../shared/notifications/notifications';
import {
  createDoctorAvailability,
  updateDoctorAvailability,
} from '../../availabilities/services/availabilitiesService';
import { getDoctors } from '../services/doctorsService';
import { getDoctorInitials } from '../utils/doctorInitials';

const WEEK_DAYS = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' },
];

function createEmptyBlock() {
  return {
    id: crypto.randomUUID(),
    day: 'Lunes',
    startTime: '09:00',
    endTime: '13:00',
  };
}

function toTimeSpanString(timeValue) {
  return timeValue.length === 5 ? `${timeValue}:00` : timeValue;
}

function DoctorSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');

  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(
    !location.state?.doctor
  );
  const [blocks, setBlocks] = useState([createEmptyBlock()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!doctorId || location.state?.doctor) {
      setIsLoadingDoctor(false);

      return;
    }

    const controller = new AbortController();

    setIsLoadingDoctor(true);

    getDoctors(controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setApiError(error.message);

          return;
        }

        const found = data?.find((d) => String(d.id) === String(doctorId));

        if (found) {
          setDoctor(found);
        } else {
          setApiError('No se encontró el profesional especificado.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingDoctor(false);
        }
      });

    return () => controller.abort();
  }, [doctorId, location.state]);

  const handleBlockChange = (blockId, field, value) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, [field]: value } : block
      )
    );
  };

  const handleAddBlock = () => {
    setBlocks((prev) => [...prev, createEmptyBlock()]);
  };

  const handleRemoveBlock = (blockId) => {
    setBlocks((prev) =>
      prev.length > 1 ? prev.filter((block) => block.id !== blockId) : prev
    );
  };

  const validateBlocks = () => {
    if (blocks.length === 0) {
      setApiError('Debe agregar al menos una franja horaria.');

      return false;
    }

    for (const block of blocks) {
      if (!block.day || !block.startTime || !block.endTime) {
        setApiError(
          'Complete día, hora de inicio y hora de fin en todas las franjas.'
        );

        return false;
      }

      if (block.startTime >= block.endTime) {
        setApiError(
          `En "${block.day}", la hora de inicio debe ser anterior a la hora de fin.`
        );

        return false;
      }
    }

    setApiError('');

    return true;
  };

  const handleSubmit = async (overwrite) => {
    if (!doctorId || !validateBlocks()) return;

    if (overwrite) {
      const confirmed = await confirmAction(
        '¿Desea sobrescribir la disponibilidad futura de este mes? Los turnos ya reservados no se modificarán.'
      );

      if (!confirmed) return;
    }

    setIsSubmitting(true);
    setApiError('');

    const payload = {
      doctorId,
      days: blocks.map((block) => ({
        day: block.day,
        startTime: toTimeSpanString(block.startTime),
        endTime: toTimeSpanString(block.endTime),
      })),
    };

    const result = overwrite
      ? await updateDoctorAvailability(payload)
      : await createDoctorAvailability(payload);

    setIsSubmitting(false);

    if (result.error) {
      setApiError(result.error.message);
      showError(result.error.message);

      return;
    }

    const generatedCount = Array.isArray(result.data) ? result.data.length : 0;

    showSuccess(
      overwrite
        ? `Disponibilidad actualizada (${generatedCount} turnos generados para el mes).`
        : `Disponibilidad generada (${generatedCount} turnos creados para el mes).`
    );

    navigate(ROUTES.adminDoctors);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <nav
          className="flex items-center gap-2 text-xs text-med-text-muted"
          aria-label="Migas de pan"
        >
          <Link
            to={ROUTES.adminDoctors}
            className="hover:text-med-primary-900 transition flex items-center gap-1"
          >
            <Icon icon={ICONS.previous} size={12} />
            <span>Doctores</span>
          </Link>
          <span>/</span>
          <span className="font-medium text-med-primary-900">
            Horarios de Atención
          </span>
        </nav>

        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          Configurar Horarios del Profesional
        </h1>
        <p className="text-sm text-med-text-sub">
          Defina los días y franjas horarias para generar los turnos disponibles
          del mes actual.
        </p>
      </div>

      <Card className="p-6">
        {isLoadingDoctor ? (
          <p className="p-6 text-sm text-med-text-sub" role="status">
            Cargando información del profesional…
          </p>
        ) : !doctorId ? (
          <p className="text-sm text-red-600">
            No se especificó el profesional a configurar.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {doctor && (
              <div className="flex items-center gap-4 rounded-xl bg-med-primary-50/60 px-4 py-3 border border-med-primary-100">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-med-primary-700 text-xs font-bold text-white shadow-sm">
                  {getDoctorInitials(doctor.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-med-primary-900 truncate">
                    {doctor.name}
                  </p>
                  <p className="text-xs text-med-text-sub truncate">
                    Matrícula: {doctor.licenseNumber} ·{' '}
                    {doctor.specialty?.name ?? 'Sin especialidad'}
                  </p>
                </div>
              </div>
            )}

            {apiError && (
              <div
                className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200"
                role="alert"
              >
                {apiError}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-med-primary-900">
                    Franjas Horarias Semanales
                  </h2>
                  <p className="text-xs text-med-text-sub">
                    Cada franja genera bloques de turnos automáticos dentro del
                    mes en curso.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddBlock}
                  className="text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Icon icon={ICONS.add} size={14} />
                  <span>Agregar franja</span>
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-med-border bg-med-bg/40 p-3 sm:grid-cols-12 sm:items-end"
                  >
                    <div className="sm:col-span-5">
                      <label className="mb-1 block text-xs font-semibold text-med-text-sub">
                        Día de la semana
                      </label>
                      <Select
                        value={block.day}
                        onChange={(e) =>
                          handleBlockChange(block.id, 'day', e.target.value)
                        }
                        options={WEEK_DAYS}
                        className="py-2 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-xs font-semibold text-med-text-sub">
                        Hora inicio
                      </label>
                      <Input
                        type="time"
                        value={block.startTime}
                        onChange={(e) =>
                          handleBlockChange(
                            block.id,
                            'startTime',
                            e.target.value
                          )
                        }
                        className="py-2 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-xs font-semibold text-med-text-sub">
                        Hora fin
                      </label>
                      <Input
                        type="time"
                        value={block.endTime}
                        onChange={(e) =>
                          handleBlockChange(block.id, 'endTime', e.target.value)
                        }
                        className="py-2 text-xs"
                      />
                    </div>

                    <div className="flex justify-end sm:col-span-1">
                      <IconButton
                        type="button"
                        icon={ICONS.delete}
                        label="Quitar franja"
                        variant="ghost"
                        disabled={blocks.length === 1}
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveBlock(block.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-med-border-subtle">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.adminDoctors)}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm"
              >
                Sobrescribir Mes
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold shadow-sm"
              >
                {isSubmitting ? 'Generando…' : 'Generar Disponibilidad'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default DoctorSchedulePage;
