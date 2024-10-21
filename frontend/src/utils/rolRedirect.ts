import { rolRedirectInfo } from '../data/Roles';
import { RolesExisting } from '../types/Roles';

export const rolRedirect = (rol: RolesExisting) => {
  console.log("rolRedirect", rol);
  console.log(rolRedirectInfo[rol] || rolRedirectInfo.default);
  return rolRedirectInfo[rol] || rolRedirectInfo.default;
};