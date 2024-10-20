import { Roles } from "../data/Roles";

// Definir el tipo de un ítem del menú
type MenuItem = {
  name: string;
  icon: string;
  path: string;
  subMenu?: MenuItem[]; // Submenú opcional, que es una lista de MenuItem
};

// Definir el tipo de menú por rol
type MenusByRole = {
  [key in keyof typeof Roles]: MenuItem[]; // Un array de MenuItem por cada rol
};
