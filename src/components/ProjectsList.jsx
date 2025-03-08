import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";
import React from "react";

// Importamos los iconos necesarios de react-icons
import { 
  FaReact, FaVuejs, FaAngular, FaJs, FaHtml5, FaCss3Alt, FaSass,
  FaNodeJs, FaPython, FaJava, FaPhp, FaGitAlt, FaGem, FaDocker,
  FaAws, FaFigma, FaBootstrap, FaSwift, FaGithub
} from "react-icons/fa";

import { FaGolang } from "react-icons/fa6";
import { TbBrandCSharp } from "react-icons/tb";

import {
  SiTypescript, SiKotlin, SiMongodb, SiMysql, SiPostgresql,
  SiFirebase, SiKubernetes, SiTailwindcss, SiMaterialdesign, SiRedux,
  SiGraphql, SiUnity, SiGodotengine, SiUnrealengine, SiConstruct3, 
  SiAdobeaftereffects, SiAdobeillustrator, SiAdobephotoshop,
  SiAdobeindesign, SiAdobeaudition, SiCplusplus, SiBehance, SiItchdotio
} from "react-icons/si";

// Mapa de iconos para tecnologías
const techIcons = {
  react: FaReact,
  vue: FaVuejs,
  angular: FaAngular,
  js: FaJs,
  ts: SiTypescript,
  html: FaHtml5,
  css: FaCss3Alt,
  sass: FaSass,
  node: FaNodeJs,
  python: FaPython,
  java: FaJava,
  php: FaPhp,
  csharp: TbBrandCSharp,
  ruby: FaGem,
  go: FaGolang,
  swift: FaSwift,
  kotlin: SiKotlin,
  mongodb: SiMongodb,
  mysql: SiMysql,
  postgres: SiPostgresql,
  firebase: SiFirebase,
  aws: FaAws,
  docker: FaDocker,
  kubernetes: SiKubernetes,
  git: FaGitAlt,
  figma: FaFigma,
  tailwind: SiTailwindcss,
  bootstrap: FaBootstrap,
  materialui: SiMaterialdesign,
  redux: SiRedux,
  graphql: SiGraphql,
  unity: SiUnity,
  godot: SiGodotengine,
  unreal: SiUnrealengine,
  construc: SiConstruct3, 
  aftereffects: SiAdobeaftereffects,
  illustrator: SiAdobeillustrator,
  photoshop: SiAdobephotoshop,
  indesign: SiAdobeindesign,
  audition: SiAdobeaudition,
  cplusplus: SiCplusplus,
};

// Mapa de iconos para plataformas
const platformIcons = {
  github: FaGithub,
  "itch.io": SiItchdotio,
  behance: SiBehance
};

// Lista de tecnologías para el título en el hover
const techNames = {
  react: "React",
  vue: "Vue.js",
  angular: "Angular",
  js: "JavaScript",
  ts: "TypeScript",
  html: "HTML5",
  css: "CSS3",
  sass: "Sass",
  node: "Node.js",
  python: "Python",
  java: "Java",
  php: "PHP",
  csharp: "C#",
  ruby: "Ruby",
  go: "Go",
  swift: "Swift",
  kotlin: "Kotlin",
  mongodb: "MongoDB",
  mysql: "MySQL",
  postgres: "PostgreSQL",
  firebase: "Firebase",
  aws: "AWS",
  docker: "Docker",
  kubernetes: "Kubernetes",
  git: "Git",
  figma: "Figma",
  tailwind: "Tailwind CSS",
  bootstrap: "Bootstrap",
  materialui: "Material UI",
  redux: "Redux",
  graphql: "GraphQL",
  unity: "Unity",
  godot: "Godot",
  unreal: "Unreal Engine",
  construc: "Construct 3", 
  aftereffects: "After Effects",
  illustrator: "Illustrator",
  photoshop: "Photoshop",
  indesign: "In Design",
  audition: "Audition",
  cplusplus: "C++",
};

// Colores para cada tecnología
const techColors = {
  react: "#61DAFB",
  vue: "#4FC08D",
  angular: "#DD0031",
  js: "#F7DF1E",
  ts: "#3178C6",
  html: "#E34F26",
  css: "#1572B6",
  sass: "#CC6699",
  node: "#339933",
  python: "#3776AB",
  java: "#007396",
  php: "#777BB4",
  csharp: "#239120",
  ruby: "#CC342D",
  go: "#00ADD8",
  swift: "#FA7343",
  kotlin: "#7F52FF",
  mongodb: "#47A248",
  mysql: "#4479A1",
  postgres: "#336791",
  firebase: "#FFCA28",
  aws: "#FF9900",
  docker: "#2496ED",
  kubernetes: "#326CE5",
  git: "#F05032",
  figma: "#F24E1E",
  tailwind: "#06B6D4",
  bootstrap: "#7952B3",
  materialui: "#0081CB",
  redux: "#764ABC",
  graphql: "#E10098",
  unity: "#000000",
  godot: "#478CBF",
  unreal: "#0E1128",
  construc: "#00DAC2", 
  aftereffects: "#CF96FD",
  illustrator: "#FF9D08",
  photoshop: "#001E36",
  indesign: "#4F0B26",
  audition: "#090862",
  cplusplus: "#085E9F",
};

// Datos de ejemplo para cuando no hay proyectos en la base de datos
const mockProjects = [
  {
    id: "project1",
    titulo: "Powerful Design System",
    descripcion: "Figma UI Kit and Design System targeting a wide variety of use cases.",
    enlace: "https://figma.com",
    imagenUrl: "https://placehold.co/600x400.png",
    tipo: "figma",
    tecnologias: ["figma", "css", "sass"]
  },
  {
    id: "project2",
    titulo: "Modern Website",
    descripcion: "Powerful website + dashboard template for your next Chakra UI project.",
    enlace: "https://github.com",
    imagenUrl: "https://placehold.co/600x400.png",
    tipo: "github",
    tecnologias: ["react", "tailwind", "html"]
  }
];

const ProjectsList = () => {
  const q = query(collection(db, "proyectos"), orderBy("createdAt", "desc"));
  const [proyectos, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-gray-500">Cargando proyectos...</p>;
  if (error) return <p className="text-red-500">Error al cargar proyectos: {error.message}</p>;

  // Si no hay datos, usamos los datos de ejemplo
  const projectsData = proyectos && proyectos.length > 0 ? proyectos : mockProjects;
  const showingMockData = proyectos && proyectos.length === 0;

  return (
    <div>
      {/* Proyectos destacados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {projectsData.slice(0, 2).map((proyecto) => (
          <a 
            key={proyecto.id} 
            href={proyecto.enlace} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            {/* Imagen del proyecto */}
            <div className="rounded-lg overflow-hidden bg-gray-100 shadow-sm border mb-4">
              {proyecto.imagenUrl ? (
                <img 
                  src={proyecto.imagenUrl} 
                  alt={proyecto.titulo}
                  className="object-cover w-full aspect-video group-hover:scale-[1.02] transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x225?text=Proyecto";
                  }}
                />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
            </div>
            
            {/* Título y descripción */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg group-hover:text-blue-600 transition-colors">
                  {proyecto.titulo}
                </h3>
                
                {/* Icono de la plataforma */}
                {proyecto.tipo && platformIcons[proyecto.tipo] && (
                  <div className="text-gray-500">
                    {React.createElement(platformIcons[proyecto.tipo], { size: 16 })}
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mt-1">
                {proyecto.descripcion}
              </p>
              
              {/* URL simple */}
              <div className="mt-2">
                <span className="text-xs text-blue-500">
                  {/* Mostrar solo el dominio */}
                  {proyecto.enlace && proyecto.enlace.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      {/* Listado de proyectos adicionales */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Más proyectos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsData.slice(2).map((proyecto) => (
            <a 
              key={proyecto.id} 
              href={proyecto.enlace} 
              target="_blank" 
              rel="noopener noreferrer"
              className="border rounded-lg p-4 hover:shadow-sm transition-shadow group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                  {proyecto.titulo}
                </h3>
                
                {/* Icono de la plataforma */}
                {proyecto.tipo && platformIcons[proyecto.tipo] && (
                  <div className="text-gray-500">
                    {React.createElement(platformIcons[proyecto.tipo], { size: 16 })}
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {proyecto.descripcion}
              </p>
              
              {/* Tecnologías usadas */}
              {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {proyecto.tecnologias.slice(0, 3).map((techId) => {
                    // Si hay un componente de icono para esta tecnología, mostrarla
                    if (techIcons[techId]) {
                      return (
                        <span 
                          key={techId}
                          className="text-xs px-2 py-1 rounded flex items-center gap-1"
                          style={{ 
                            backgroundColor: `${techColors[techId]}15`, // Color con 15% de opacidad
                            color: techColors[techId] || "#333"
                          }}
                        >
                          {React.createElement(techIcons[techId], { size: 12 })}
                          {techNames[techId] || techId}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
              
              {/* URL con icono de enlace */}
              <div className="text-xs text-blue-500 flex items-center">
                <span>
                  {/* Mostrar solo el dominio */}
                  {proyecto.enlace && proyecto.enlace.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      {showingMockData && (
        <p className="text-xs text-gray-500 italic mt-4">
          Nota: Estos son datos de ejemplo. Agrega tus proyectos reales desde el panel de administración.
        </p>
      )}
    </div>
  );
};

export default ProjectsList;