import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";
import React from "react";

// Importamos los iconos necesarios
import { 
  FaFigma, FaGithub, FaGitlab, FaBitbucket, FaNpm, FaDocker,
  FaJs, FaPython, FaJava, FaSlack, FaTrello
} from "react-icons/fa";

import {
  SiAdobephotoshop, SiAdobeillustrator, SiAdobexd, SiAdobeaftereffects,
  SiAdobepremierepro, SiAdobeindesign, SiAdobelightroom, SiSketch,
  SiInvision, SiBlender,
  SiIntellijidea, SiAndroidstudio, SiXcode, SiCplusplus,
  SiUnity, SiUnrealengine, SiGodotengine, SiConstruct3, SiNotion, 
  SiAsana, SiJira
} from "react-icons/si";

import { TbBrandCSharp } from "react-icons/tb";
import { DiVisualstudio } from "react-icons/di";
import { BiLogoVisualStudio } from "react-icons/bi";
import { RiFileExcel2Line, RiFileWord2Line } from "react-icons/ri";

// Mapa de iconos
const toolIcons = {
  // Adobe
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobexd,
  SiAdobeaftereffects,
  SiAdobepremierepro,
  SiAdobeindesign,
  SiAdobelightroom,
  
  // Diseño
  FaFigma,
  SiSketch,
  SiInvision,
  SiBlender,
  
  // Desarrollo
  DiVisualstudio,
  BiLogoVisualStudio,
  SiIntellijidea,
  SiAndroidstudio,
  SiXcode,
  FaGithub,
  FaGitlab,
  FaBitbucket,
  FaNpm,
  FaDocker,
  
  // Lenguajes
  SiCplusplus,
  FaJs,
  FaPython,
  FaJava,
  TbBrandCSharp,
  
  // Juegos
  SiUnity,
  SiUnrealengine,
  SiGodotengine,
  SiConstruct3,
  
  // Productividad
  SiNotion,
  FaSlack,
  FaTrello,
  SiAsana,
  SiJira,
  RiFileWord2Line,
  RiFileExcel2Line
};

// Datos de ejemplo para cuando no hay herramientas en la base de datos
const mockTools = [
  { id: "figma1", nombre: "Figma", icono: "FaFigma", categoria: "design", nivel: "expert" },
  { id: "html1", nombre: "HTML", categoria: "development", nivel: "expert" },
  { id: "css1", nombre: "CSS", categoria: "development", nivel: "expert" },
  { id: "js1", nombre: "JavaScript", icono: "FaJs", categoria: "language", nivel: "expert" },
  { id: "react1", nombre: "React JS", categoria: "development", nivel: "advanced" },
  { id: "chakra1", nombre: "Chakra UI", categoria: "development", nivel: "advanced" },
  { id: "emotion1", nombre: "Emotion", categoria: "development", nivel: "intermediate" },
  { id: "framer1", nombre: "Framer", categoria: "design", nivel: "intermediate" },
  { id: "typescript1", nombre: "TypeScript", categoria: "language", nivel: "advanced" },
  { id: "nextjs1", nombre: "Next JS", categoria: "development", nivel: "advanced" },
  { id: "wireframing1", nombre: "Wireframing", categoria: "methodology", nivel: "expert" },
  { id: "prototyping1", nombre: "Prototyping", categoria: "methodology", nivel: "expert" },
  { id: "testing1", nombre: "Testing", categoria: "methodology", nivel: "advanced" },
  { id: "web1", nombre: "Web Design", categoria: "skill", nivel: "expert" },
  { id: "mobile1", nombre: "Mobile Design", categoria: "skill", nivel: "advanced" },
  { id: "ux1", nombre: "User Experience", categoria: "skill", nivel: "expert" },
];

const ToolsList = () => {
  const q = query(collection(db, "herramientas"), orderBy("createdAt", "desc"));
  const [herramientas, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-gray-500">Cargando herramientas...</p>;
  if (error) return <p className="text-red-500">Error al cargar herramientas: {error.message}</p>;

  // Si no hay datos, usamos los datos de ejemplo
  const toolsData = herramientas && herramientas.length > 0 ? herramientas : mockTools;
  const showingMockData = herramientas && herramientas.length === 0;

  // Categorías definidas
  const categories = [
    { id: "skill", name: "Skills", color: "gray" },
    { id: "design", name: "Design", color: "green" },
    { id: "development", name: "Development", color: "blue" },
    { id: "language", name: "Languages", color: "indigo" },
    { id: "methodology", name: "Methodology", color: "purple" }
  ];

  // Componente para mostrar una etiqueta "pill"
  const ToolPill = ({ tool, color }) => {
    const IconComponent = tool.icono ? toolIcons[tool.icono] : null;
    const bgColorClass = `bg-${color}-100`;
    const textColorClass = `text-${color}-800`;
    const borderColorClass = `border-${color}-200`;
    
    return (
      <div className={`px-3 py-1 ${bgColorClass} rounded-full text-sm border ${borderColorClass} flex items-center gap-1`}>
        {IconComponent && <IconComponent size={14} className={textColorClass} />}
        <span className={textColorClass}>{tool.nombre}</span>
      </div>
    );
  };

  // Función para obtener el color de una categoría
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : "gray";
  };

  return (
    <div className="space-y-8">
      {/* Categoría Principal: Skills */}
      <div>
        <h3 className="text-lg font-medium mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {toolsData.filter(tool => tool.categoria === "skill").map(tool => (
            <ToolPill key={tool.id} tool={tool} color="gray" />
          ))}
          
          {toolsData.filter(tool => tool.categoria === "skill").length === 0 && (
            <>
              <div className="px-3 py-1 bg-gray-100 rounded-full text-sm border border-gray-200 text-gray-800">
                Web Design
              </div>
              <div className="px-3 py-1 bg-gray-100 rounded-full text-sm border border-gray-200 text-gray-800">
                Mobile Design
              </div>
              <div className="px-3 py-1 bg-gray-100 rounded-full text-sm border border-gray-200 text-gray-800">
                User Experience
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Iterar sobre todas las categorías */}
      {categories.filter(cat => cat.id !== "skill").map(category => {
        const toolsInCategory = toolsData.filter(tool => tool.categoria === category.id);
        
        if (toolsInCategory.length === 0 && category.id !== "methodology") return null;
        
        return (
          <div key={category.id}>
            <h3 className="text-lg font-medium mb-3">{category.name}</h3>
            <div className="flex flex-wrap gap-2">
              {toolsInCategory.map(tool => (
                <ToolPill key={tool.id} tool={tool} color={category.color} />
              ))}
              
              {/* Metodologías de ejemplo si no hay datos */}
              {toolsInCategory.length === 0 && category.id === "methodology" && (
                <>
                  <div className="px-3 py-1 bg-purple-100 rounded-full text-sm border border-purple-200 text-purple-800">
                    Wireframing
                  </div>
                  <div className="px-3 py-1 bg-purple-100 rounded-full text-sm border border-purple-200 text-purple-800">
                    Prototyping
                  </div>
                  <div className="px-3 py-1 bg-purple-100 rounded-full text-sm border border-purple-200 text-purple-800">
                    Testing
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Tecnologías especiales: React y sus bibliotecas */}
      <div>
        <h3 className="text-lg font-medium mb-3">React Ecosystem</h3>
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1 bg-blue-100 rounded-full text-sm border border-blue-200 text-blue-800">
            React JS
          </div>
          <div className="px-3 py-1 bg-blue-100 rounded-full text-sm border border-blue-200 text-blue-800">
            Chakra UI
          </div>
          <div className="px-3 py-1 bg-blue-100 rounded-full text-sm border border-blue-200 text-blue-800">
            Emotion
          </div>
          <div className="px-3 py-1 bg-blue-100 rounded-full text-sm border border-blue-200 text-blue-800">
            Framer
          </div>
        </div>
      </div>
      
      {showingMockData && (
        <p className="text-xs text-gray-500 italic mt-4">
          Nota: Estos son datos de ejemplo. Agrega tus herramientas reales desde el panel de administración.
        </p>
      )}
    </div>
  );
};

export default ToolsList;