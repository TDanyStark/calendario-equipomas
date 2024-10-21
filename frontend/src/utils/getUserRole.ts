import {jwtDecode} from "jwt-decode";
import { RolesExisting } from "../types/Roles";

const getUserRole = () => {
  // get JWT localstorage
  const JWT = localStorage.getItem('JWT');
  // decode JWT
  if (!JWT) {
    return null;
  }

  try {
    const decoded = jwtDecode<{ role: RolesExisting }>(JWT);
    return decoded.role;
  } catch (error) {
    console.error("Error decodificando el JWT", error);
    return null;
  }
}

export default getUserRole;