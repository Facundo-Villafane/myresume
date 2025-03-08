import { auth } from "../../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { FaGoogle, FaLock } from "react-icons/fa";
import adminConfig from "../../src/config/adminConfig";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Obtener el UID del administrador desde el archivo de configuración
  const { ADMIN_UID } = adminConfig;

  // Verificar si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Verificar si el usuario es el administrador autorizado
        if (user.uid === ADMIN_UID) {
          navigate("/admin");
        } else {
          // Cerrar sesión si no es el administrador autorizado
          auth.signOut();
          setError("No tienes permisos para acceder al panel de administración.");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Verificar si el usuario que inició sesión es el administrador autorizado
      if (user.uid === ADMIN_UID) {
        navigate("/admin"); // Redirige al panel si el login es exitoso y es el admin
      } else {
        // Cerrar sesión si no es el administrador autorizado
        await auth.signOut();
        setError("No tienes permisos para acceder al panel de administración.");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError(
        error.code === 'auth/popup-closed-by-user' 
          ? "Inicio de sesión cancelado. Por favor, intenta de nuevo." 
          : "Error al iniciar sesión. Por favor, intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4">
      <div className="w-full max-w-md">
        {/* Tarjeta de login */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Cabecera */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <FaLock className="text-blue-600 text-xl" />
              </div>
            </div>
            <h1 className="text-center text-white text-2xl font-bold mt-4">Panel de Administración</h1>
            <p className="text-center text-blue-100 mt-2">Accede para gestionar tu portafolio</p>
          </div>
          
          {/* Cuerpo */}
          <div className="p-8">
            {/* Mensaje de error si existe */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="text-center text-gray-500 mb-6">
                <p>Inicia sesión para acceder al panel de administración y gestionar el contenido de tu portafolio.</p>
              </div>
              
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors relative overflow-hidden group"
              >
                <span className={`absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-full bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:translate-x-0 ${isLoading ? 'translate-x-0' : ''}`}></span>
                <span className="relative flex items-center justify-center">
                  <FaGoogle className={`mr-2 ${isLoading ? 'text-white' : 'text-red-500'} group-hover:text-white`} />
                  <span className={`${isLoading ? 'text-white' : ''} group-hover:text-white`}>
                    {isLoading ? "Iniciando sesión..." : "Continuar con Google"}
                  </span>
                </span>
              </button>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-400">
              <p>Este panel es solo para administradores autorizados.</p>
              <p className="mt-1">Si necesitas acceso, contacta al desarrollador.</p>
            </div>
          </div>
        </div>
        
        {/* Enlace para volver al inicio */}
        <div className="text-center mt-6">
          <a href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            ← Volver al portafolio
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
