import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";
import React from "react";

const ToolsList = () => {
  const q = collection(db, "herramientas");
  const [herramientas, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-neo-border animate-pulse font-mono uppercase">Cargando habilidades...</p>;
  if (error) return <p className="text-red-500 font-bold uppercase">Error: {error.message}</p>;

  // Fallback a algunas mockTools por si la base está completamente vacía (puramente para diseño demostrativo)
  const baseData = herramientas && herramientas.length > 0 ? herramientas : [
    { id: "js1", nombre: "JAVASCRIPT", categoria: "hard", nivel: "expert" },
    { id: "react1", nombre: "REACT JS", categoria: "hard", nivel: "advanced" },
    { id: "figma1", nombre: "FIGMA", categoria: "hard", nivel: "expert" },
    { id: "unity1", nombre: "UNITY", categoria: "hard", nivel: "expert" },
    { id: "ux", nombre: "USER EXPERIENCE", categoria: "soft", nivel: "expert" },
    { id: "team", nombre: "TEAMWORK", categoria: "soft", nivel: "advanced" }
  ];

  // Separar en Hard Skills (Tools/Tech) y Soft Skills
  const hardSkills = baseData.filter(t => t.categoria === "hard" || !t.categoria);
  const softSkills = baseData.filter(t => t.categoria === "soft");

  return (
    <div className="flex flex-col gap-8">

      {/* --- CORE TECH (HARD SKILLS) --- */}
      {hardSkills.length > 0 && (
        <div className="bg-neo-panel border-2 border-neo-border p-4 py-8 relative">
          <div className="absolute top-0 left-0 bg-neo-border text-neo-panel text-[10px] uppercase font-black px-2 py-1 tracking-widest">
            CORE TECH
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {hardSkills.map(tool => (
              <div
                key={tool.id}
                className="border-2 border-neo-border bg-neo-panel px-4 py-2 hover:bg-neo-accent transition-colors cursor-default shadow-[2px_2px_0px_var(--color-neo-border)]"
              >
                <span className="font-bold text-xs md:text-sm tracking-widest text-neo-border uppercase">{tool.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PROCESS & MINDSET (SOFT SKILLS) --- */}
      {softSkills.length > 0 && (
        <div className="bg-neo-accent border-2 border-neo-border p-4 py-8 relative">
          <div className="absolute top-0 left-0 bg-neo-border text-neo-accent text-[10px] uppercase font-black px-2 py-1 tracking-widest">
            PROCESS & MINDSET
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {softSkills.map(skill => (
              <div
                key={skill.id}
                className="border-2 border-neo-border bg-transparent px-3 py-1.5 cursor-default"
              >
                <span className="font-bold text-[10px] md:text-xs tracking-widest text-neo-border uppercase">{skill.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ToolsList;
