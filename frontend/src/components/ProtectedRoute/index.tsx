// src/components/ProtectedRoute.js
import { useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Asegúrate de tener este import
import { ValidateJWT } from "../../utils/ValidateJWT";
import { Loader } from "../Loader/Loader";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const JWT = useSelector((state: { auth: { JWT: string } }) => state.auth.JWT);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute JWT:");
    const validateToken = async () => {
      if (!JWT) {
        setIsValidToken(false);
        return;
      }

      try {
        const { exp, role } = jwtDecode<{ exp: number, role:string }>(JWT); // Desestructurar solo lo que necesitas
        const now = Date.now() / 1000;

        if (exp && exp < now) {
          localStorage.removeItem("JWT");
          setIsValidToken(false);
          return;
        }

        if (requiredRole && role !== requiredRole) {
          setIsValidToken(false);
          localStorage.removeItem("JWT");
          return;
        }

        
        const isValid = await ValidateJWT(JWT);
        setIsValidToken(isValid);
        if (!isValid) {
          localStorage.removeItem("JWT");
        }
      } catch (error) {
        console.error("Error validando el token:", error);
        setIsValidToken(false);
      }
    };

    validateToken();
    return () => {
      console.log("ProtectedRoute cleanup");
    }
  }, [JWT, location.pathname, requiredRole]);

  if (isValidToken === null) {
    return <Loader />;
  }

  if (!isValidToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
