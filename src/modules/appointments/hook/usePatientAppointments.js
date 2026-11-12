import { useEffect, useState } from 'react';
import useAuth from '../../auth/hook/useAuth';
import {
  cancelAppointment as cancelAppointmentRequest,
  getPatientAppointments,
} from '../services/appointmentsService';

function usePatientAppointments() {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    if (!isAuthenticated) {
      setAppointments([]);
      setLoadError('Necesitás iniciar sesión para consultar tus turnos.');
      setIsLoading(false);

      return () => controller.abort();
    }

    setIsLoading(true);
    setLoadError('');

    getPatientAppointments(controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setLoadError(error.message);

          return;
        }

        setAppointments(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, refreshKey]);

  const cancelAppointment = async (appointmentId) => {
    setCancellingId(appointmentId);

    const { error } = await cancelAppointmentRequest(appointmentId);

    if (error) {
      if (error.status === 409) {
        setRefreshKey((currentKey) => currentKey + 1);
      }

      setCancellingId(null);

      return { error };
    } else {
      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (appointment) => appointment.appointmentsId !== appointmentId
        )
      );
      setRefreshKey((currentKey) => currentKey + 1);
    }

    setCancellingId(null);

    return { error: null };
  };

  const reloadAppointments = () => {
    setRefreshKey((currentKey) => currentKey + 1);
  };

  return {
    appointments,
    cancelAppointment,
    cancellingId,
    isLoading,
    loadError,
    reloadAppointments,
  };
}

export default usePatientAppointments;
