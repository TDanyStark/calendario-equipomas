// src/pages/Login.js
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { URL_BASE, URL_BACKEND } from "../variables";
import { ValidateJWT } from "../utils/ValidateJWT"; // Importa tu validación de JWT
import {jwtDecode} from "jwt-decode";
import { rolRedirect } from "../utils/rolRedirect";
import { RolesExisting } from "../types/Roles";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Código que obtiene el JWT desde el localStorage y redirige según el rol
  const JWT = localStorage.getItem("JWT");

  let from = "/"; // Fallback en caso de que no haya JWT o no sea válido

  try {
    if (JWT) {
      const decodedToken = jwtDecode<{ role: RolesExisting }>(JWT);
      
      // Aquí usamos rolRedirect para obtener la ruta según el rol
      from = rolRedirect(decodedToken.role);
    }
  } catch (error) {
    console.error("Error decodificando el JWT", error);
    from = "/error";
  }

  useEffect(() => {
    if (JWT) {
      const validateToken = async () => {
        try {
          const isValid = await ValidateJWT(JWT);
          if (isValid) {
            // Si el token es válido, despacha el login y redirige
            dispatch(login({ JWT }));
            navigate(from, { replace: true });
          } else {
            localStorage.removeItem("JWT");
          }
        } catch (error) {
          console.error("Error validando el token:", error);
        }
      };
      validateToken();
    }
  }, [JWT, navigate, from, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${URL_BACKEND}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error al iniciar sesión: " + errorData.data.message);
        throw new Error("Error al iniciar sesión");
      }

      const res = await response.json();
      const { JWT } = res.data;

      dispatch(login({ JWT }));
      from = rolRedirect(jwtDecode<{ role: RolesExisting }>(JWT).role);

      // Redirigir al usuario
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
      console.error("Error durante el login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-principal-bg">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <NavLink
          to="/"
          className="flex items-center mb-6 text-2xl font-semiboldtext-white"
        >
          <img
            className="w-32 mr-2"
            src={URL_BASE + "images/logos/maslogo.webp"}
            alt="logo"
          />
        </NavLink>
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-secondary-bg border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Iniciar Sesión con tus datos registrados en administración
            </h1>
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Cédula
                </label>
                <input
                  type="text"
                  name="id"
                  id="id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 
                  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@gmail.com"
                  value={formData.id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 
                  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 
                dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={loading}
              >
                {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
