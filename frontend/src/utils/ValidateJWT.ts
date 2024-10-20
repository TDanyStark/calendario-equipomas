import { URL_BACKEND } from "../variables";

export const ValidateJWT = async (JWT: string) => {
  try {
    const response = await fetch(`${URL_BACKEND}validateJWT`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWT}`,
      },
    });
    if (response.ok) {
      const res = await response.json();
      return res.data.isValid;
    }

    return false;
  } catch (error) {
    console.error('Error al validar el token:', error);
    return false;
  }
};