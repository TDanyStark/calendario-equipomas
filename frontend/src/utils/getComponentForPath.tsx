import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { RolesExisting } from "../types/Roles";
import { Menus } from "../data/Roles";
import ErrorPage from "../pages/ErrorPage";

// 📌 Lazy load SOLO para algunos componentes
const GroupClass = lazy(() => import("../pages/GroupClass"));
const GroupClassCreate = lazy(() => import("../pages/GroupClassCreate"));
const GroupClassEdit = lazy(() => import("../pages/GroupClassEdit"));

// 📌 Importación normal para los demás
import Dashboard from "../pages/Dashboard";
import Enrolls from "../pages/Enrolls";
import Students from "../pages/Students";
import Professors from "../pages/Professors";
import Instruments from "../pages/Instruments";
import Rooms from "../pages/Rooms";
import Courses from "../pages/Courses";
import Semesters from "../pages/Semesters";
import Users from "../pages/Users";
import GeneralSettings from "../pages/GeneralSettings";
import StudentSchedule from "../pages/StudentSchedule";
import MyClasses from "../pages/MyClasses";
import { Loader } from "@/components/Loader/Loader";

// 🔹 Generar rutas dinámicas con carga mixta
export const generateRoutes = (role: RolesExisting) => {
  const roleMenus = Menus[role] || Menus.default;

  return roleMenus.flatMap((menu) => {
    const routes = [];

    if (menu.subMenu) {
      routes.push(
        ...menu.subMenu.map((subMenu) => (
          <Route
            key={subMenu.id}
            path={subMenu.path}
            element={getComponentForPath(subMenu.path)}
          />
        ))
      );
    }

    routes.push(
      <Route
        key={menu.id}
        path={menu.path}
        element={getComponentForPath(menu.path)}
      />
    );

    return routes;
  });
};

// 🔹 Función para obtener el componente basado en el path
const getComponentForPath = (path: string) => {
  switch (path) {
    // 🔸 Carga diferida solo para estos componentes
    case "/group-class/create":
    case "/group-class/edit/:id":
    case "/instruments":
    case "/rooms":
    case "/courses":
    case "/semesters":
    case "/users":
    case "/general-settings":
      return <Suspense fallback={<Loader />}>{lazyComponent(path)}</Suspense>;

    // 🔸 Importación normal para los demás
    case "/dashboard":
      return <Dashboard />;
    case "/enrolls":
      return <Enrolls />;
    case "/group-class":
      return <GroupClass />;
    case "/students":
      return <Students />;
    case "/professors":
      return <Professors />;

    case "/student-schedule":
      return <StudentSchedule />;
    case "/my-classes":
      return <MyClasses />;
    default:
      return <ErrorPage />;
  }
};

// 🔹 Función auxiliar para retornar el componente lazy correspondiente
const lazyComponent = (path: string) => {
  switch (path) {
    case "/group-class/create":
      return <GroupClassCreate />;
    case "/group-class/edit/:id":
      return <GroupClassEdit />;
    case "/instruments":
      return <Instruments />;
    case "/rooms":
      return <Rooms />;
    case "/courses":
      return <Courses />;
    case "/semesters":
      return <Semesters />;
    case "/users":
      return <Users />;
    case "/general-settings":
      return <GeneralSettings />;
    default:
      return <ErrorPage />;
  }
};
