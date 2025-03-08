import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import EducationList from "../components/EducationList";
import ExperienceList from "../components/ExperienceList";
import LanguagesList from "../components/LanguagesList";
import ProjectsList from "../components/ProjectsList";
import ToolsList from "../components/ToolsList";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaGithub, FaLinkedin, FaInstagram, FaItchIo } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: "Tu Nombre",
    title: "Desarrollador Full-Stack",
    imageUrl: "https://via.placeholder.com/300",
    quote: "Las grandes cosas nunca vienen de la zona de confort",
    quoteAuthor: "Anónimo",
    email: "tu.email@ejemplo.com",
    website: "https://tudominio.com",
    phone: "(+xx) xxx xxx xxx",
    location: "Tu Ciudad, País",
    github: "https://github.com/tu-usuario",
    linkedin: "https://linkedin.com/in/tu-usuario",
    instagram: "",
    twitter: ""
  });
  
  // Cargar datos del perfil
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRef = doc(db, "perfil", "datos");
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setProfileData(prevData => ({
            ...prevData,
            ...profileSnap.data()
          }));
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor principal */}
      <div className="container mx-auto py-8 px-4 md:px-0">
        
        {/* Grid para dividir en columna lateral y contenido principal */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Columna lateral izquierda */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              {/* Cabecera con foto y nombre */}
              <div className="p-6 border-b relative bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center">
                  {/* Foto de perfil */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                    <img 
                      src={profileData.imageUrl} 
                      alt={profileData.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x600.png";
                      }}
                    />
                  </div>
                  
                  {/* Nombre y título */}
                  <h1 className="text-2xl font-bold text-gray-800">{profileData.fullName}</h1>
                  <p className="text-indigo-600 mt-1">{profileData.title}</p>
                  
                  {/* Cita */}
                  {profileData.quote && (
                    <div className="mt-4 text-center">
                      <blockquote className="italic text-gray-600 text-sm">
                        "{profileData.quote}"
                      </blockquote>
                      <cite className="text-xs text-gray-500 mt-1 block">— {profileData.quoteAuthor || "Anónimo"}</cite>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Información de contacto */}
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Contacto</h2>
                
                <ul className="space-y-3">
                  {profileData.email && (
                    <li className="flex items-center text-gray-600">
                      <FaEnvelope className="w-5 h-5 mr-3 text-indigo-500" />
                      <a href={`mailto:${profileData.email}`} className="hover:text-indigo-600 transition-colors">
                        {profileData.email}
                      </a>
                    </li>
                  )}
                  
                  {profileData.website && (
                    <li className="flex items-center text-gray-600">
                      <FaGlobe className="w-5 h-5 mr-3 text-indigo-500" />
                      <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                        {profileData.website.replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    </li>
                  )}
                  
                  {profileData.phone && (
                    <li className="flex items-center text-gray-600">
                      <FaPhone className="w-5 h-5 mr-3 text-indigo-500" />
                      <span>{profileData.phone}</span>
                    </li>
                  )}
                  
                  {profileData.location && (
                    <li className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="w-5 h-5 mr-3 text-indigo-500" />
                      <span>{profileData.location}</span>
                    </li>
                  )}
                </ul>
              </div>
              
              {/* Redes sociales */}
              <div className="p-6 pt-0">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Redes Sociales</h2>
                
                <div className="flex items-center gap-4">
                  {profileData.github && (
                    <a 
                      href={profileData.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <FaGithub className="w-5 h-5 text-gray-700" />
                    </a>
                  )}
                  
                  {profileData.linkedin && (
                    <a 
                      href={profileData.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <FaLinkedin className="w-5 h-5 text-gray-700" />
                    </a>
                  )}
                  
                  {profileData.instagram && (
                    <a 
                      href={profileData.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <FaInstagram className="w-5 h-5 text-gray-700" />
                    </a>
                  )}
                  
                  {profileData.x && (
                    <a 
                      href={profileData.x} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <FaXTwitter className="w-5 h-5 text-gray-700" />
                    </a>
                  )}

                  {profileData.itchio && (
                    <a 
                      href={profileData.itchio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <FaItchIo className="w-5 h-5 text-gray-700" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Idiomas */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h2 className="text-xl font-semibold text-gray-800">Idiomas</h2>
                </div>
                
                <LanguagesList />
              </div>
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Experiencia */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h2 className="text-xl font-semibold text-gray-800">Experiencia</h2>
                </div>
                
                <ExperienceList />
              </div>
            </div>
            
            {/* Educación */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h2 className="text-xl font-semibold text-gray-800">Educación</h2>
                </div>
                
                <EducationList />
              </div>
            </div>
            
            {/* Habilidades */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h2 className="text-xl font-semibold text-gray-800">Habilidades</h2>
                </div>
                
                <ToolsList />
              </div>
            </div>
            
            {/* Proyectos */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h2 className="text-xl font-semibold text-gray-800">Proyectos</h2>
                </div>
                
                <ProjectsList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;