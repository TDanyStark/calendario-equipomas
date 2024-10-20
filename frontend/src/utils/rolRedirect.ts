import { rolRedirectInfo } from '../data/Roles';
import { RolesExisting } from '../types/Roles';

export const rolRedirect = (rol: RolesExisting) => {
  return rolRedirectInfo[rol] || rolRedirectInfo.default;
};