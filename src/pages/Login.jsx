import { auth } from "../firebaseConfig";
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaGoogle, FaLock } from "react-icons/fa";
function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

  useEffect(() => {
    // Procesar resultado del redirect de Google
    setIsLoading(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          const user = result.user;
          if (user.uid === ADMIN_UID) {
            navigate("/admin");
          } else {
            auth.signOut();
            setError("No tienes permisos para acceder al panel de administración.");
          }
        }
      })
      .catch((err) => {
        console.error("Error en redirect:", err);
        setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
      })
      .finally(() => setIsLoading(false));

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.uid === ADMIN_UID) {
          navigate("/admin");
        } else {
          auth.signOut();
          setError("No tienes permisos para acceder al panel de administración.");
        }
      }
    });

    return () => unsubscribe();
  }, [ADMIN_UID, navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313] px-4 py-10 text-slate-950">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-[32px] bg-[#fdfbfb] shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          <div className="bg-slate-950 p-6 text-white">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#00c979] rounded-2xl flex items-center justify-center shadow-[0_8px_0_rgba(255,255,255,0.12)]">
                <FaLock className="text-slate-950 text-xl" />
              </div>
            </div>
            <h1 className="text-center text-white text-3xl font-black mt-4">Panel de Administración</h1>
            <p className="text-center text-white/55 mt-2 font-bold">Accede para gestionar tu portafolio</p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 text-sm font-bold">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="text-center text-slate-500 mb-6 font-bold">
                <p>Inicia sesión para acceder al panel de administración y gestionar el contenido de tu portafolio.</p>
              </div>
              
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="flex items-center justify-center w-full py-4 px-4 bg-slate-950 rounded-full text-sm font-black uppercase text-white transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                <FaGoogle className="mr-2 text-[#ff5b57]" />
                {isLoading ? "Iniciando sesión..." : "Continuar con Google"}
              </button>
            </div>
            
            <div className="mt-8 text-center text-xs text-slate-400 font-bold">
              <p>Este panel es solo para administradores autorizados.</p>
              <p className="mt-1">Si necesitas acceso, contacta al desarrollador.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <a href="/" className="inline-flex items-center gap-2 rounded-full bg-[#fdfbfb]/10 px-4 py-2 text-sm font-black uppercase text-white transition-colors hover:bg-[#fdfbfb]/20">
            <FaArrowLeft />
            Volver al portafolio
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
