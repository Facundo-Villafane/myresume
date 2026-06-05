import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { FaBars, FaBriefcase, FaCog, FaFolder, FaGraduationCap, FaHome, FaLanguage, FaSignOutAlt, FaTimes, FaTools } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { path: "/admin", name: "Inicio", hint: "Vista general", icon: <FaHome /> },
    { path: "/admin/profile", name: "Perfil", hint: "Hero y contacto", icon: <FaCog /> },
    { path: "/admin/experience", name: "Experiencia", hint: "Timeline laboral", icon: <FaBriefcase /> },
    { path: "/admin/education", name: "Educación", hint: "Formación", icon: <FaGraduationCap /> },
    { path: "/admin/projects", name: "Proyectos", hint: "Catálogo público", icon: <FaFolder /> },
    { path: "/admin/tools", name: "Herramientas", hint: "Skills", icon: <FaTools /> },
    { path: "/admin/languages", name: "Idiomas", hint: "Niveles", icon: <FaLanguage /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const isActive = (path) => (path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path));
  const activeSection = sections.find((section) => isActive(section.path)) || sections[0];

  const Navigation = ({ onNavigate }) => (
    <nav className="space-y-2">
      {sections.map((section) => (
        <Link
          key={section.path}
          to={section.path}
          onClick={onNavigate}
          className={`admin-nav-link ${isActive(section.path) ? "admin-nav-link-active" : ""}`}
        >
          <span className="admin-nav-icon">{section.icon}</span>
          <span>
            <span className="block font-black">{section.name}</span>
            <span className="block text-xs opacity-60">{section.hint}</span>
          </span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="admin-shell min-h-screen bg-[#f4f0ea] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white/85 p-5 shadow-[12px_0_40px_rgba(15,23,42,0.06)] backdrop-blur md:block">
        <div className="flex h-full flex-col">
          <Link to="/admin" className="mb-8 block rounded-[28px] bg-slate-950 p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/50">Portfolio</p>
            <h1 className="mt-2 font-extended text-3xl leading-none">Admin</h1>
            <p className="mt-3 text-sm font-bold text-white/60">Contenido, catálogo y perfil público.</p>
          </Link>

          <Navigation />

          <div className="mt-auto space-y-3">
            <a href="/" className="admin-secondary-btn block text-center">
              Ver portfolio
            </a>
            <button onClick={handleLogout} className="admin-danger-btn w-full">
              <FaSignOutAlt />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-slate-400">Admin</p>
            <h1 className="text-lg font-black">{activeSection.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout} className="rounded-full bg-red-50 p-3 text-red-600" aria-label="Cerrar sesión">
              <FaSignOutAlt />
            </button>
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-full bg-slate-950 p-3 text-white"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/40 p-4 pt-24 md:hidden">
          <div className="rounded-[28px] bg-white p-4 shadow-2xl">
            <Navigation onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="md:pl-72">
        <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 md:px-8 md:pt-8">
          <div className="mb-6 rounded-[32px] bg-slate-950 p-6 text-white md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">{activeSection.hint}</p>
            <h2 className="mt-2 font-extended text-4xl leading-none md:text-5xl">{activeSection.name}</h2>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
