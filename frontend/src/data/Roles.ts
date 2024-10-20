import { MenusByRole } from "../types/Roles";

export const Roles = {
  admin: "admin",
  student: "student",
  professor: "professor",
} as const;

export const Menus: MenusByRole = {
  [Roles.admin]: [
    { name: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { name: "Clases grupales", icon: "group-class", path: "/group-class" },
    { name: "Matriculas", icon: "enrolls", path: "/enrolls" },
    { name: "Estudiantes", icon: "students", path: "/students" },
    { name: "Profesores", icon: "professors", path: "/professors" },
    { 
      name: "Configuraciones", 
      icon: "settings", 
      path: "#", 
      subMenu: [
      { name: "Instrumentos", icon: "instruments", path: "/instruments" },
      { name: "Salones", icon: "rooms", path: "/rooms" },
      { name: "Cursos", icon: "courses", path: "/courses" },
      { name: "Semestres", icon: "semesters", path: "/semesters" },
      { name: "Usuarios", icon: "users", path: "/users" },
      { name: "Generales", icon: "general-settings", path: "/general-settings" },
    ],
  },
  ],
  [Roles.student]: [
    { name: "Horario", icon: "schedule", path: "/student-schedule" },
  ],
  [Roles.professor]: [
    { name: "Mis Clases", icon: "classes", path: "/my-classes" },
  ],
};