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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <DashboardCard title="Perfil" path="/admin/profile" icon="👤" />
    <DashboardCard title="Experiencia" path="/admin/experience" icon="💼" />
    <DashboardCard title="Educación" path="/admin/education" icon="🎓" />
    <DashboardCard title="Proyectos" path="/admin/projects" icon="📁" />
    <DashboardCard title="Herramientas" path="/admin/tools" icon="🔧" />
    <DashboardCard title="Idiomas" path="/admin/languages" icon="🌐" />
  </div>
);

// Tarjeta para el dashboard
const DashboardCard = ({ title, path, icon }) => (
  <a 
    href={path}
    className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center">
      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
        <div className="text-white text-2xl">{icon}</div>
      </div>
      <div className="ml-5">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">Administrar {title.toLowerCase()}</p>
      </div>
    </div>
  </a>
);

export default App;