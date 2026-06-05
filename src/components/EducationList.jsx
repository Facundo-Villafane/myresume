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

  if (loading) return <p className="text-current animate-pulse font-mono uppercase">Cargando...</p>;
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
    <div className="grid grid-cols-1 gap-3">
      {educationData.map((edu, index) => {
        // Alternar fondos entre blanco y verde lima
        const isAccent = index % 2 !== 0;

        return (
          <div key={edu.id || `${edu.titulo}-${edu.institucion}-${index}`} className={`rounded-[24px] p-4 flex flex-col justify-between min-h-[128px] overflow-hidden ${isAccent ? 'bg-[#ff9f1a] text-[#131313]' : 'bg-[#131313] text-[#fdfbfb]'}`}>
            <div className="mb-4 min-w-0">
              <span className={`rounded-md text-[9px] font-black px-2 py-1 uppercase mb-3 inline-block ${isAccent ? 'bg-[#131313] text-[#fdfbfb]' : 'bg-[#f164d8] text-[#131313]'}`}>Educación</span>
              <h3 className="font-extended font-black text-base uppercase leading-[1.05] break-words">
                {edu.titulo}
              </h3>
            </div>
            <p className="font-mono text-[10px] font-black uppercase leading-tight opacity-85">{typeof edu.institucion === 'string' ? edu.institucion : edu.institucion?.name || 'Unknown'}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EducationList;
