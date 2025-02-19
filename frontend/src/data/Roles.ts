import { TypeMenusByRole, TypeRolRedirectInfo } from "../types/Roles";

export const Roles = {
  admin: "admin",
  student: "student",
  professor: "professor",
  default: "default",
} as const;

export const Menus: TypeMenusByRole = {
  [Roles.admin]: [
    { id: 1, name: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { id: 2, name: "Clases grupales", icon: "group-class", path: "/group-class" },
    { id: 3, name: "Matriculas", icon: "enrolls", path: "/enrolls" },
    { id: 4, name: "Estudiantes", icon: "students", path: "/students" },
    { id: 5, name: "Profesores", icon: "professors", path: "/professors" },
    { 
      id: 6,
      name: "Configuraciones", 
      icon: "settings", 
      path: "#", 
      subMenu: [
        { id: 7, name: "Instrumentos", icon: "instruments", path: "/instruments" },
        { id: 8, name: "Salones", icon: "rooms", path: "/rooms" },
        { id: 9, name: "Cursos", icon: "courses", path: "/courses" },
        { id: 10, name: "Semestres", icon: "semesters", path: "/semesters", isHidden:true },
        { id: 11, name: "Usuarios", icon: "users", path: "/users" },
        { id: 12, name: "Generales", icon: "general-settings", path: "/general-settings" },
        { id: 13, name: "Clases grupales", icon: "group-class", path: "/group-class/create", isHidden:true  },
        { id: 14, name: "Clases grupales", icon: "group-class", path: "/group-class/edit/:id", isHidden:true  },
        { id: 15, name: "Asignar Profesores", icon: "professors", path: "/professors/assign", isHidden:true  },
      ],
    },
  ],
  [Roles.student]: [
    { id: 1, name: "Horario", icon: "schedule", path: "/student-schedule" },
  ],
  [Roles.professor]: [
    { id: 1, name: "Mis Clases", icon: "classes", path: "/my-classes" },
  ],
  default: [],
};

export const rolRedirectInfo: TypeRolRedirectInfo = {
  [Roles.admin]: "/dashboard",
  [Roles.student]: "/student-schedule",
  [Roles.professor]: "/my-classes",
  default: "/login/?sms=no-role",
}
