import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
import { FaHome, FaBriefcase, FaGraduationCap, FaTools, FaLanguage, FaFolder, FaCog, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Asegúrate de exportar auth desde tu firebaseConfig

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Lista de secciones del panel
  const sections = [
    { path: "/admin", name: "Inicio", icon: <FaHome className="mr-2" /> },
    { path: "/admin/profile", name: "Perfil", icon: <FaCog className="mr-2" /> },
    { path: "/admin/experience", name: "Experiencia", icon: <FaBriefcase className="mr-2" /> },
    { path: "/admin/education", name: "Educación", icon: <FaGraduationCap className="mr-2" /> },
    { path: "/admin/projects", name: "Proyectos", icon: <FaFolder className="mr-2" /> },
    { path: "/admin/tools", name: "Herramientas", icon: <FaTools className="mr-2" /> },
    { path: "/admin/languages", name: "Idiomas", icon: <FaLanguage className="mr-2" /> },
  ];
  
  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirigir al usuario a la página de inicio de sesión
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  // Verificar si una ruta está activa
  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10">
        <div className="flex flex-col flex-grow bg-white shadow-lg overflow-y-auto">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
            <h1 className="text-lg font-bold text-white">Panel de Administración</h1>
          </div>
          <div className="flex-grow flex flex-col pb-4 pt-2">
            <nav className="flex-1 px-2 space-y-1">
              {sections.map((section) => (
                <Link
                  key={section.path}
                  to={section.path}
                  className={`${
                    isActive(section.path)
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  {section.icon}
                  {section.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Botón de cerrar sesión */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Cerrar sesión
            </button>
          </div>
          
          <div className="p-4 border-t text-xs text-gray-500">
            <p>Panel de Administración v1.0</p>
          </div>
        </div>
      </div>
      
      {/* Header para móvil */}
      <div className="md:hidden bg-white shadow-sm flex items-center justify-between h-16 px-4 fixed top-0 inset-x-0 z-10">
        <h1 className="text-lg font-bold text-gray-900">Panel de Administración</h1>
        <div className="flex items-center">
          {/* Botón de cerrar sesión en móvil */}
          <button
            onClick={handleLogout}
            className="mr-2 p-2 text-red-600 rounded-full hover:bg-red-50"
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt />
          </button>
          
          {/* Botón de menú */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <span className="sr-only">Abrir menú</span>
            {/* Icono de hamburguesa */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex bg-black bg-opacity-25">
          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Cerrar menú</span>
                {/* Icono X */}
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {sections.map((section) => (
                  <Link
                    key={section.path}
                    to={section.path}
                    className={`${
                      isActive(section.path)
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {section.icon}
                    {section.name}
                  </Link>
                ))}
                
                {/* Cerrar sesión en el menú móvil */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-2 py-2 text-base font-medium text-red-600 rounded-md hover:bg-red-50"
                >
                  <FaSignOutAlt className="mr-2" />
                  Cerrar sesión
                </button>
              </nav>
            </div>
          </div>
          <div className="flex-shrink-0 w-14"></div>
        </div>
      )}
      
      {/* Contenido principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8 pt-4 md:py-8 px-4 md:px-8 mt-16 md:mt-0">
          {/* Renderizar la ruta activa */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;