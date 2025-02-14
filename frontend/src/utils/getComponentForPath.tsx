// Importar los componentes de las páginas
import Dashboard from "../pages/Dashboard";
import GroupClass from "../pages/GroupClass";
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
import GroupClassCreate from "../pages/GroupClassCreate";
import GroupClassEdit from "../pages/GroupClassEdit";
import { RolesExisting } from "../types/Roles";
import { Menus } from "../data/Roles";
import ErrorPage from "../pages/ErrorPage";
import { Route } from "react-router-dom";

// Función para generar rutas dinámicamente
export const generateRoutes = (role: RolesExisting) => {
  const roleMenus = Menus[role] || Menus.default;

  return roleMenus.map((menu) => {
    if (menu.subMenu) {
      return menu.subMenu.map((subMenu) => {
        return (
          <Route
            key={subMenu.id}
            path={subMenu.path}
            element={getComponentForPath(subMenu.path)} // Llamar a la función para obtener el componente
          />
        );
      });
    }
    return (
      <Route
        key={menu.id}
        path={menu.path}
        element={getComponentForPath(menu.path)} // Llamar a la función para obtener el componente
      />
    );
  });
};

// Función para obtener el componente basado en el path
const getComponentForPath = (path: string) => {
  switch (path) {
    case "/dashboard":
      return <Dashboard />;
    case "/group-class":
      return <GroupClass />;
    case "/group-class/create":
      return <GroupClassCreate />;
    case "/group-class/edit/:id":
      return <GroupClassEdit />;
    case "/enrolls":
      return <Enrolls />;
    case "/students":
      return <Students />;
    case "/professors":
      return <Professors />;
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
    case "/student-schedule":
      return <StudentSchedule />;
    case "/my-classes":
      return <MyClasses />;
    default:
      return <ErrorPage />;
  }
};
