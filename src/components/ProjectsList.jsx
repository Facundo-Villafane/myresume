import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";
import React from "react";

const mockProjects = [
  {
    id: "project1",
    titulo: "THE LAST ROOM",
    descripcion: "Un estudiante queda atrapado en su propio juego. Solo una linterna y su ingenio lo separan del despertar... o no.",
    enlace: "https://itch.io",
    imagenUrl: "",
    tipo: "itch.io",
    tecnologias: ["unity", "c#", "3d"]
  },
  {
    id: "project2",
    titulo: "ARCANE TRIALS\nTOWER_DEFENSE",
    descripcion: "Tower Defense 2D dinámico con mecánicas de gestión de maná y oleadas de dificultad progresiva generadas proceduralmente.",
    enlace: "https://github.com",
    imagenUrl: "",
    tipo: "github",
    tecnologias: ["godot", "2d", "pixel art"]
  }
];

const ProjectsList = () => {
  const q = query(collection(db, "proyectos"), orderBy("createdAt", "desc"));
  const [proyectos, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-neo-border animate-pulse font-mono uppercase">Cargando...</p>;
  if (error) return <p className="text-red-500 font-bold uppercase">Error: {error.message}</p>;

  const projectsData = proyectos && proyectos.length > 0 ? proyectos : mockProjects;

  return (
    <div className="flex flex-wrap gap-8 lg:gap-10 w-full justify-start">
      {projectsData.map((proyecto, index) => {
        // Alternate styling based on index (White vs LIME)
        const isAccent = index % 2 !== 0;

        return (
          <article
            key={proyecto.id}
            className="w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.666rem)] flex-shrink-0 min-w-[320px] border-2 border-neo-border flex flex-col group"
          >

            {/* Square Image Block */}
            <div className="w-full aspect-square border-b-2 border-neo-border relative overflow-hidden bg-neo-panel">
              {proyecto.imagenUrl ? (
                <img
                  src={proyecto.imagenUrl}
                  alt={proyecto.titulo}
                  className="w-full h-full object-cover filter grayscale contrast-[1.15] group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center text-neo-border opacity-20 font-extended">
                  <span className="text-4xl font-black">IMG</span>
                  <span className="text-sm">Not Found</span>
                </div>
              )}
            </div>

            {/* Content Bottom Block */}
            <div className={`p-6 flex flex-col flex-grow ${isAccent ? 'bg-neo-accent text-black border-t-2 border-neo-border' : 'bg-neo-panel text-neo-border'}`}>

              <div className="flex justify-between items-start mb-4 gap-2">
                <h3 className="font-extended font-black text-xl md:text-2xl uppercase tracking-tighter leading-[0.9] break-words whitespace-pre-line">
                  {proyecto.titulo}
                </h3>
                <span className="text-lg leading-none pt-1">
                  {proyecto.tipo === 'itch.io' && '🎮'}
                  {proyecto.tipo === 'github' && '⌨️'}
                </span>
              </div>

              <p className={`font-mono text-xs font-bold mb-6 leading-relaxed flex-grow ${isAccent ? 'text-black' : 'text-neo-border'}`}>
                {proyecto.descripcion}
              </p>

              <div className="mt-auto">
                {/* Stack of Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proyecto.tecnologias && proyecto.tecnologias.map((tech, i) => (
                    <span key={i} className={`border px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest bg-transparent ${isAccent ? 'border-black text-black' : 'border-neo-border text-neo-border'}`}>
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={proyecto.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border-2 border-neo-border bg-neo-panel py-2 font-extended font-black text-xs tracking-widest uppercase hover:bg-neo-border hover:text-neo-panel transition-colors"
                >
                  {proyecto.tipo === 'github' ? 'Explorar' : 'Ver en Itch'}
                </a>
              </div>

            </div>

          </article>
        );
      })}
    </div>
  );
};

export default ProjectsList;
