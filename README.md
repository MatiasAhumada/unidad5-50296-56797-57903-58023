# Sistema de Turnos Médicos — Frontend (MedPortal / Portal Salud)

### Universidad Tecnológica Nacional — Facultad Regional Tucumán (UTN FRT)

**Cátedra:** Desarrollo de Software 2026  
**Trabajo Práctico Integrador — Entrega Frontend**

---

## Integrantes del Grupo

- **Malica, Gino** — Legajo: 50296
- **Cendoya, Joaquín** — Legajo: 56797
- **Ahumada, Matías Ramón** — Legajo: 57903
- **Ruiz, Samira Victoria** — Legajo: 58023

---

## Descripción del Proyecto

Aplicación web cliente desarrollada en **React 19**, construida con **Vite** y estilizada mediante **Tailwind CSS v4**. La solución implementa la gestión integral de turnos médicos en línea para un centro de salud, contemplando tanto la autogestión de turnos por parte de los pacientes como la administración clínica integral por parte del personal administrativo.

El diseño sigue estrictamente los **mockups oficiales del TPI**, adaptándose de manera fluida y responsive a dispositivos móviles y de escritorio.

---

## Arquitectura del Software (Screaming Architecture)

La estructura del código fuente está organizada por dominios funcionales independientes en `src/modules/`:

```text
src/
├── modules/
│   ├── appointments/     # Citas médicas, búsqueda avanzada, cancelación y asistencia
│   ├── auth/             # Autenticación JWT por roles (Admin y Paciente), guards y contexto
│   ├── availabilities/   # Reglas de disponibilidad horaria y cálculo de slots
│   ├── dashboard/        # Métricas, KPIs clínicos y navegación administrativa
│   ├── doctors/          # Gestión de profesionales, asignación de fotos y horarios
│   ├── patients/         # Portal del paciente, selección y confirmación de turnos
│   ├── specialties/      # Gestión de especialidades médicas e iconografía personalizada
│   └── shared/           # Componentes base (Button, Card, Input, Modal, StatusBadge, etc.)
├── App.jsx               # Enrutador principal de React Router (URLs en inglés y rutas protegidas)
└── main.jsx              # Punto de entrada de la aplicación
```

---

## Instrucciones de Instalación y Ejecución

### Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm** (versión 9 o superior)
- Backend ASP.NET Core en ejecución (`http://localhost:5278`)

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <URL_DEL_REPOSITORIO>
cd unidad5-50296-56797-57903-58023
npm install
```

### 2. Configurar Variables de Entorno

Verificar el archivo `.env.development` en la raíz del proyecto:

```env
VITE_BACKEND_URL=http://localhost:5278/
```

> El servidor de desarrollo de Vite redirige transparentemente las peticiones de `/api/*` al backend configurado.

### 3. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

La aplicación iniciará en `http://localhost:5173`.

### 4. Verificar Calidad de Código (Linter)

```bash
npm run lint
```

_Garantiza 0 errores y 0 advertencias de ESLint y Prettier._

### 5. Compilar para Producción

```bash
npm run build
```

Genera la versión optimizada en la carpeta `dist/`.

---

## Credenciales de Acceso para Pruebas

| Rol               | URL de Acceso  | Credenciales                                                                                 |
| :---------------- | :------------- | :------------------------------------------------------------------------------------------- |
| **Administrador** | `/admin/login` | **Email:** `admin@system.com`<br>**Contraseña:** `admin1234`                                 |
| **Paciente**      | `/login`       | **Email:** `paciente@test.com`<br>**DNI:** `40123456` _(se autoregistra en el primer login)_ |

---

## Endpoints del Backend Consumidos por el Frontend

Todas las URLs y endpoints de la API se gestionan en inglés y siguen las convenciones RESTful:

### Autenticación (`/api/auth`)

- `POST /api/auth/admin/login`: Autentica al personal administrativo mediante correo y contraseña. Retorna token JWT y rol `ADMINISTRADOR`.
- `POST /api/auth/patient/login`: Autentica al paciente mediante correo y DNI. Si el paciente no existe, lo registra de forma automática y retorna token JWT con rol `PACIENTE`.

### Especialidades Médicas (`/api/specialties`)

- `GET /api/specialties`: Obtiene listado paginado y filtrado de especialidades con sus métricas.
- `POST /api/specialties`: Da de alta una nueva especialidad médica.
- `PUT /api/specialties/:id`: Actualiza el nombre, descripción e icono de una especialidad existente.
- `DELETE /api/specialties/:id`: Realiza la baja lógica (_soft delete_) de la especialidad.
- `PUT /api/specialties/:id/status`: Permite reactivar o cambiar el estado activo/inactivo de la especialidad.

### Doctores / Médicos (`/api/doctors`)

- `GET /api/doctors`: Lista los médicos registrados con paginación, filtros por nombre y métricas del día.
- `GET /api/doctors/:id/availabilities`: Obtiene la disponibilidad semanal configurada para un doctor.
- `GET /api/doctors/by-specialty/:specialtyId/options`: Retorna los doctores activos asociados a una especialidad dada.
- `GET /api/doctors/:doctorId/available-slots`: Retorna los bloques de turnos disponibles de 30 minutos para reserva.
- `POST /api/doctors`: Registra un nuevo profesional médico asociando su especialidad y matrícula.
- `PUT /api/doctors/:id`: Modifica la información del médico.
- `DELETE /api/doctors/:id`: Realiza la baja lógica (_soft delete_) del médico.
- `PUT /api/doctors/:id/status`: Reactiva o conmuta el estado activo/inactivo del médico.

### Disponibilidades Horarias (`/api/availabilities`)

- `POST /api/availabilities`: Registra la franja horaria de atención semanal por días para un médico.
- `PUT /api/availabilities`: Actualiza la disponibilidad semanal y regenera los bloques de atención futuros.

### Citas / Turnos (`/api/appointments`)

- `POST /api/appointments`: Reserva un turno médico en un horario específico en estado `BOOKED`.
- `GET /api/appointments/patient?dni=:dni`: Consulta los turnos activos programados para el paciente autenticado.
- `DELETE /api/appointments/:id`: Permite al paciente cancelar un turno previamente reservado.
- `GET /api/appointments/search`: Búsqueda avanzada de citas para administración con filtros combinados (DNI/Nombre, Especialidad, Médico y Fecha).
- `PUT /api/appointments/:id/attendance`: Registra la asistencia o inasistencia del paciente al turno.

### Dashboard (`/api/dashboard`)

- `GET /api/dashboard/summary`: Provee indicadores clave de rendimiento (turnos del día, médicos activos, especialidades activas).

---

## Cumplimiento de Criterios de Evaluación

1. **Funcionalidad (40%):**
   - Flujos completos sin errores, interactuando con los endpoints reales de ASP.NET Core.
   - Manejo de concurrencia y prevención de doble reserva de turnos (`APPOINTMENT_CONFLICT`).
   - Búsqueda en tiempo real y paginación en todas las tablas de datos.
   - Soporte responsive probado en resoluciones desktop y móviles (>= 6").

2. **Calidad de Código (30%):**
   - Adopción de _Screaming Architecture_ con separación nítida de responsabilidades.
   - Componentes reutilizables unificados (`ConfirmModal`, `StatusBadge`, `BreadcrumbNav`, `FeedbackAlerts`).
   - Sin código duplicado y consistencia en el manejo de estado local y global.
   - Reglas de ESLint y Prettier 100% satisfechas.

3. **Manejo de Errores y Validaciones (20%):**
   - Validación de campos obligatorios, longitudes y formatos tanto en formularios de login como de alta/edición.
   - Mensajes de error claros y alertas contextuales en la interfaz de usuario ante respuestas `400`, `404`, `409` y `500`.

4. **Uso de Librerías (10%):**
   - Tailwind CSS v4 para diseño visual moderno y exacto respecto a los mockups.
   - React Router 7 con protección por roles y control de acceso.
   - Axios para centralización de llamadas HTTP y manejo de tokens Bearer.
   - Hugeicons y Lucide Icons para simbología médica intuitiva.
