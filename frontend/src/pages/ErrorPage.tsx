// src/pages/ErrorPage.js
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-8xl text-white mb-4">Error</h1>
      <h2 className="text-4xl text-white mb-4">Página no encontrada</h2>
      <p className="text-white mb-4">
        Para acceder a la aplicación es necesario iniciar sesión
      </p>
      <div className="flex gap-2">
        <Link
          to="/"
          className="text-white border border-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center"
        >
          Volver al Inicio
        </Link>
        <Link
          to="/login"
          className="text-white bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
