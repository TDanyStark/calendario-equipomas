import {Roles} from "../data/Roles";

export const rolRedirect = (rol: string) => {
  switch (rol) {
    case Roles.admin:
      return "/dashboard";
    case Roles.student:
      return "/student-schedule";
    case Roles.professor:
      return "/my-classes";
    default:
      return "/error";
  }
};