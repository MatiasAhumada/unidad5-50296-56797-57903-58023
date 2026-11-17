import { useEffect, useState } from 'react';
import { getDoctors } from '../../doctors/services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import { getApiErrorMessage } from '../../shared/api/apiError';
import useNotificationError from '../../shared/notifications/useNotificationError';
import AppointmentSearchFilters from '../components/AppointmentSearchFilters';
import AppointmentSearchResults from '../components/AppointmentSearchResults';
import {
  getAppointmentsByDate,
  searchAppointments,
} from '../services/appointmentsService';

const EMPTY_FILTERS = {
  dni: '',
  specialtyId: '',
  doctorId: '',
  date: '',
};

const PAGE_SIZE = 10;

function AppointmentsSearchPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [pageIndex, setPageIndex] = useState(1);
  const [appointmentsPage, setAppointmentsPage] = useState({
    data: [],
    pageSize: PAGE_SIZE,
    pageIndex: 1,
    total: 0,
  });
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [catalogError, setCatalogError] = useState('');
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [catalogRequestKey, setCatalogRequestKey] = useState(0);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');
  const [appointmentsRequestKey, setAppointmentsRequestKey] = useState(0);

  useNotificationError(catalogError);
  useNotificationError(appointmentsError);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoadingCatalogs(true);
    setCatalogError('');

    Promise.all([
      getSpecialties(controller.signal),
      getDoctors(controller.signal),
    ])
      .then(([specialtiesResult, doctorsResult]) => {
        if (controller.signal.aborted) return;

        const requestError = specialtiesResult.error || doctorsResult.error;

        if (requestError) {
          setCatalogError(requestError.message);

          return;
        }

        setSpecialties(specialtiesResult.data);
        setDoctors(doctorsResult.data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setCatalogError(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingCatalogs(false);
        }
      });

    return () => controller.abort();
  }, [catalogRequestKey]);

  useEffect(() => {
    const controller = new AbortController();
    const dni = appliedFilters.dni.replace(/\D/g, '');
    const searchFilters = {
      pageSize: PAGE_SIZE,
      pageIndex,
      dni: dni || undefined,
      specialtyId: appliedFilters.specialtyId || undefined,
      doctorId: appliedFilters.doctorId || undefined,
      date: appliedFilters.date || undefined,
    };
    const isDailySearch =
      Boolean(appliedFilters.date) &&
      !dni &&
      !appliedFilters.specialtyId &&
      !appliedFilters.doctorId;

    setIsLoadingAppointments(true);
    setAppointmentsError('');
    setAppointmentsPage((current) => ({
      ...current,
      data: [],
      pageIndex,
      total: 0,
    }));

    const dailyFilters = {
      date: appliedFilters.date,
      pageSize: PAGE_SIZE,
      pageIndex,
    };
    const request = isDailySearch
      ? getAppointmentsByDate(dailyFilters, controller.signal)
      : searchAppointments(searchFilters, controller.signal);

    request
      .then((result) => {
        if (controller.signal.aborted) return;

        if (result.error) {
          setAppointmentsError(result.error.message);

          return;
        }

        setAppointmentsPage(result.data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setAppointmentsError(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingAppointments(false);
        }
      });

    return () => controller.abort();
  }, [appliedFilters, appointmentsRequestKey, pageIndex]);

  const applyFilters = (event) => {
    event.preventDefault();
    setAppliedFilters({ ...filters });
    setPageIndex(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPageIndex(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="mt-1 text-sm text-med-text-sub">
          Consultá los turnos registrados según sus filtros.
        </p>
      </div>

      <AppointmentSearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onApply={applyFilters}
        onClear={clearFilters}
        specialties={specialties}
        doctors={doctors}
        isLoadingCatalogs={isLoadingCatalogs}
        catalogError={catalogError}
        onRetryCatalogs={() => setCatalogRequestKey((key) => key + 1)}
      />

      <AppointmentSearchResults
        appointmentsPage={appointmentsPage}
        isLoading={isLoadingAppointments}
        error={appointmentsError}
        onRetry={() => setAppointmentsRequestKey((key) => key + 1)}
        onPageChange={setPageIndex}
      />
    </div>
  );
}

export default AppointmentsSearchPage;
