import { MenusByRole } from "../types/Roles";

export const Roles = {
  admin: "admin",
  student: "student",
  professor: "professor",
} as const;

export const Menus: MenusByRole = {
  [Roles.admin]: [
    { name: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { 
      name: "Configuraciones", 
      icon: "settings", 
      path: "#", 
      subMenu: [
      { name: "Instrumentos", icon: "instruments", path: "/instruments" },
      { name: "Salones", icon: "rooms", path: "/rooms" },
      { name: "Cursos", icon: "courses", path: "/courses" },
      { name: "Semestres", icon: "semesters", path: "/semesters" },
      { name: "Generales", icon: "general-settings", path: "/general-settings" },
    ],
  },
    { name: "Gestión de Usuarios", icon: "users", path: "/manage-users" },
  ],
  [Roles.student]: [
    { name: "Horario", icon: "schedule", path: "/student-schedule" },
  ],
  [Roles.professor]: [
    { name: "Mis Clases", icon: "classes", path: "/my-classes" },
  ],
};