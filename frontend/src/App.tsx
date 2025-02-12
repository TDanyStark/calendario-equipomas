// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import { setSchedule } from "./store/scheduleSlice";
import DefaultLayout from "./layout/DefaultLayout";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import { Roles } from "./data/Roles";
import { generateRoutes } from "./utils/getComponentForPath";
import { rolRedirect } from "./utils/rolRedirect";
import getUserRole from "./utils/getUserRole";
import useFetchDaysOfWeek from "./hooks/useFetchDaysOfWeek";
import { useDispatch } from "react-redux";
import { ScheduleStateType } from "./types/Api";
import { useEffect } from "react";
import { ReactQueryDevtools } from "react-query/devtools";


function App() {
  const dispatch = useDispatch();
  
  const { daysOfWeek } = useFetchDaysOfWeek<ScheduleStateType>();
  useEffect(() => {
    if (daysOfWeek?.scheduleDays && daysOfWeek?.recurrence && daysOfWeek?.academicPeriod) {
      dispatch(
        setSchedule({
          scheduleDays: daysOfWeek.scheduleDays,
          recurrence: daysOfWeek.recurrence,
          academicPeriod: daysOfWeek.academicPeriod,
        })
      );
    }
  }, [daysOfWeek, dispatch]); 

  const userRole = getUserRole();

  return (
    <>
    <Routes>
      {/* Rutas publicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Redirección en la ruta raíz según el rol activo */}
      <Route
        path="/"
        element={<Navigate to={rolRedirect(userRole ?? Roles.default)} />}
      />

      {/* Rutas para Admin */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole={Roles.admin}>
            <DefaultLayout role={Roles.admin} />
          </ProtectedRoute>
        }
      >
        {generateRoutes(Roles.admin)}
      </Route>

      {/* Rutas para Estudiantes */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole={Roles.student}>
            <DefaultLayout role={Roles.student} />
          </ProtectedRoute>
        }
      >
        {generateRoutes(Roles.student)}
      </Route>

      {/* Rutas para Profesores */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole={Roles.professor}>
            <DefaultLayout role={Roles.professor} />
          </ProtectedRoute>
        }
      >
        {generateRoutes(Roles.professor)}
      </Route>

      {/* Ruta comodín para manejar errores */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
    <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;
