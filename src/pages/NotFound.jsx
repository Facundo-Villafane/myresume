import React from 'react';
import { Link } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <section className="flex items-center h-full p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl mb-4">¡Ups! Página no encontrada... sorprendente, ¿verdad?</p>
          
          <p className="mb-8 dark:text-gray-600 text-sm italic">
            Mientras tanto, el desarrollador definitivamente esta "trabajando" en arreglarlo y no jugando League of Legends o Pokemon.
          </p>
          <Link to="/" className="px-8 py-3 font-semibold rounded bg-violet-600 text-white flex items-center justify-center space-x-2">
            <FaArrowLeft />
            <span>Volver a una página que sí funciona</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;