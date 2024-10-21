import { Roles } from "../data/Roles";

// Definir el tipo de un ítem del menú
export type MenuItem = {
  id: number;
  name: string;
  icon: string;
  path: string;
  subMenu?: MenuItem[]; // Submenú opcional, que es una lista de MenuItem
};

export type RolesExisting = typeof Roles[keyof typeof Roles];

export type TypeRolRedirectInfo = {
  [K in RolesExisting]: string; // Cada clave será un valor de Roles y su valor será una string (la ruta de redirección)
};

// Tipo para el objeto `Menus`, donde las claves son los valores de Roles y los valores son arreglos de `MenuItem`
export type TypeMenusByRole = {
  [K in RolesExisting]: MenuItem[];
};