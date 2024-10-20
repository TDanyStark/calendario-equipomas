// src/pages/ErrorPage.js
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-8xl text-white mb-4">Error</h1>
      <h2 className="text-4xl text-white mb-4">Página no encontrada</h2>
      <Link to="/" className="text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        Volver al Inicio
      </Link>
    </div>
  );
};

export default ErrorPage;