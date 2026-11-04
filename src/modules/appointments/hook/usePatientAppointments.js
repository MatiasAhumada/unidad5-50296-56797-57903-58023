import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../shared/api/apiError';
import useAuth from '../../auth/hook/useAuth';
import {
  cancelAppointment as cancelAppointmentRequest,
  getPatientAppointments,
} from '../services/appointmentsService';

function usePatientAppointments() {
  const { patientDni } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    if (!patientDni) {
      setAppointments([]);
      setLoadError(
        'No encontramos el DNI de esta sesión. Cerrá la sesión e ingresá nuevamente.'
      );
      setIsLoading(false);

      return () => controller.abort();
    }

    setIsLoading(true);
    setLoadError('');

    getPatientAppointments(patientDni, controller.signal)
      .then((data) => setAppointments(data))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setLoadError(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [patientDni, refreshKey]);

  const cancelAppointment = async (appointmentId) => {
    setCancellingId(appointmentId);
    setActionError('');
    setSuccessMessage('');

    try {
      await cancelAppointmentRequest(appointmentId);
      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (appointment) => appointment.appointmentsId !== appointmentId
        )
      );
      setSuccessMessage('El turno se canceló correctamente.');
      setRefreshKey((currentKey) => currentKey + 1);
    } catch (error) {
      setActionError(
        error?.status === 409
          ? 'El turno ya no se puede cancelar. Actualizamos la lista; volvé a revisar su estado.'
          : getApiErrorMessage(error)
      );

      if (error?.status === 409) {
        setRefreshKey((currentKey) => currentKey + 1);
      }
    } finally {
      setCancellingId(null);
    }
  };

  const reloadAppointments = () => {
    setRefreshKey((currentKey) => currentKey + 1);
  };

  return {
    actionError,
    appointments,
    cancelAppointment,
    cancellingId,
    isLoading,
    loadError,
    reloadAppointments,
    successMessage,
  };
}

export default usePatientAppointments;
