import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from './pages/NotFound';
import './App.css';

// Importar componentes para las secciones del admin
import ProfileForm from "./components/ProfileForm";
import ExperienceForm from "./components/ExperienceForm";
import ExperienceManager from "./components/ExperienceManager";
import EducationForm from "./components/EducationForm";
import EducationManager from "./components/EducationManager";
import ProjectForm from "./components/ProjectForm";
import ProjectManager from "./components/ProjectManager";
import ToolsForm from "./components/ToolsForm";
import ToolsManager from "./components/ToolsManager";
import LanguagesForm from "./components/LanguagesForm";
import LanguagesManager from "./components/LanguagesManager";
import { FaBriefcase, FaCog, FaFolder, FaGraduationCap, FaLanguage, FaTools } from "react-icons/fa";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound/>} />
      
      {/* Rutas de Administración */}
      <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>}>
        {/* Estas rutas serán manejadas dentro del componente AdminPanel */}
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<ProfileForm />} />
        <Route path="experience" element={
          <div className="space-y-8">
            <ExperienceForm />
            <ExperienceManager />
          </div>
        } />
        <Route path="education" element={
          <div className="space-y-8">
            <EducationForm />
            <EducationManager />
          </div>
        } />
        <Route path="projects" element={
          <div className="space-y-8">
            <ProjectForm />
            <ProjectManager />
          </div>
        } />
        <Route path="tools" element={
          <div className="space-y-8">
            <ToolsForm />
            <ToolsManager />
          </div>
        } />
        <Route path="languages" element={
          <div className="space-y-8">
            <LanguagesForm />
            <LanguagesManager />
          </div>
        } />
      </Route>
    </Routes>
  );
}

// Componente simple para el dashboard
const AdminDashboard = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    <DashboardCard title="Perfil" path="/admin/profile" icon={<FaCog />} color="#1398ff" description="Nombre, foto, redes y hero público." />
    <DashboardCard title="Experiencia" path="/admin/experience" icon={<FaBriefcase />} color="#00c979" description="Trabajos y timeline profesional." />
    <DashboardCard title="Educación" path="/admin/education" icon={<FaGraduationCap />} color="#ff9f1a" description="Cursos, instituciones y formación." />
    <DashboardCard title="Proyectos" path="/admin/projects" icon={<FaFolder />} color="#f164d8" description="Catálogo separado por categorías." />
    <DashboardCard title="Herramientas" path="/admin/tools" icon={<FaTools />} color="#ff5b57" description="Hard skills, soft skills y tecnologías." />
    <DashboardCard title="Idiomas" path="/admin/languages" icon={<FaLanguage />} color="#8b5cf6" description="Idiomas visibles en el portfolio." />
  </div>
);

// Tarjeta para el dashboard
const DashboardCard = ({ title, path, icon, color, description }) => (
  <a 
    href={path}
    className="admin-card group block hover:-translate-y-1 transition-transform"
  >
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl text-slate-950" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">{description}</p>
      </div>
    </div>
  </a>
);

export default App;
