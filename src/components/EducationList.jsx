import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebaseConfig";
import React from "react";

const mockEducation = [
  { id: "coder1", institucion: "Centro de e-learning UTN.BA", titulo: "Experto Universitario en Game Design", año: "2024" },
  { id: "mit1", institucion: "UTN Nacional", titulo: "Tecnicatura Desarrollo de Videojuegos", año: "2022" }
];

const EducationList = () => {
  const q = collection(db, "educacion");
  const [educacion, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-black animate-pulse font-mono uppercase">Cargando...</p>;
  if (error) return <p className="text-red-500 font-bold uppercase">Error: {error.message}</p>;

  let educationData = educacion && educacion.length > 0 ? educacion : mockEducation;

  const normalizarAño = (año) => {
    if (!año) return 0;
    if (typeof año === 'string') {
      const numAño = parseInt(año, 10);
      return isNaN(numAño) ? 0 : numAño;
    }
    if (typeof año === 'number') return año;
    return 0;
  };

  educationData = [...educationData].sort((a, b) => {
    if (a.cursando && !b.cursando) return -1;
    if (!a.cursando && b.cursando) return 1;
    return normalizarAño(b.año) - normalizarAño(a.año);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {educationData.map((edu, index) => {
        // Alternar fondos entre blanco y verde lima
        const isAccent = index % 2 !== 0;

        return (
          <div key={edu.id} className={`p-6 border-2 border-neo-border flex flex-col justify-between min-h-[150px] ${isAccent ? 'bg-neo-accent text-neo-border' : 'bg-neo-panel text-neo-border'}`}>
            <div className="mb-4">
              <span className="bg-neo-border text-neo-panel text-[9px] font-black px-2 py-1 uppercase tracking-widest mb-3 inline-block">Educación</span>
              <h3 className="font-extended font-black text-lg md:text-xl uppercase tracking-tighter leading-tight">
                {edu.titulo}
              </h3>
            </div>
            <p className="font-mono text-[10px] uppercase">{typeof edu.institucion === 'string' ? edu.institucion : edu.institucion?.name || 'Unknown'}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EducationList;
