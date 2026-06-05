import React from 'react';
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebaseConfig";

const LanguagesList = () => {
  const q = collection(db, "idiomas");
  const [idiomas, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-neo-panel animate-pulse font-mono text-xs uppercase">Cargando...</p>;
  if (error) return <p className="text-red-500 font-bold text-xs uppercase">Error: {error.message}</p>;

  // Datos mockeados por defecto si no hay conectados
  const displayData = idiomas && idiomas.length > 0 ? idiomas : [
    { id: "en", idioma: "English", nivel: "Bilingüe" },
    { id: "pt", idioma: "Portugués", nivel: "Avanzado" },
    { id: "es", idioma: "Spanish", nivel: "Nativo" }
  ];

  return (
    <ul className="space-y-4">
      {displayData.map((idioma) => (
        <li key={idioma.id} className="flex justify-between items-center gap-3 border-b border-[#fdfbfb]/10 pb-3 last:border-0">
          <span className="font-bold text-sm text-[#fdfbfb]">{idioma.idioma || idioma.nombre}</span>
          <span className="rounded-lg bg-[#00c979] text-[#131313] font-black text-[10px] uppercase px-2 py-1">
            {idioma.nivel || idioma.level}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default LanguagesList;
