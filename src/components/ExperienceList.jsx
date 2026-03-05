import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";
import React from "react";

const ExperienceList = () => {
  const q = collection(db, "experiencia");
  const [experiencias, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-neo-border animate-pulse font-mono uppercase">Cargando datos...</p>;
  if (error) return <p className="text-red-500 font-bold uppercase">Error: {error.message}</p>;

  const showExamples = !experiencias || experiencias.length === 0;
  const ejemplos = [
    {
      id: "example1", cargo: "Junior Software Testing Engineer", empresa: "EPAM SYSTEMS", ubicacion: "Buenos Aires, Argentina",
      fechaInicio: new Date(2023, 4, 1), fechaFin: null
    },
    {
      id: "example2", cargo: "Profesor Adjunto Transporte Aéreo", empresa: "CENTRO DE E-LEARNING UTN BA", ubicacion: "Buenos Aires, Argentina",
      fechaInicio: new Date(2023, 1, 1), fechaFin: new Date(2025, 3, 1)
    }
  ];

  let dataToShow = showExamples ? ejemplos : experiencias;

  const normalizarFecha = (dateObj) => {
    if (!dateObj) return new Date(3000, 0, 1);
    try {
      if (typeof dateObj.toDate === 'function') return dateObj.toDate();
      if (dateObj instanceof Date) return dateObj;
      if (typeof dateObj === 'number' || typeof dateObj === 'string') return new Date(dateObj);
      return new Date(0);
    } catch { return new Date(0); }
  };

  dataToShow = [...dataToShow].sort((a, b) => {
    const aEsPresente = !a.fechaFin;
    const bEsPresente = !b.fechaFin;
    if (aEsPresente && !bEsPresente) return -1;
    if (!aEsPresente && bEsPresente) return 1;
    return normalizarFecha(b.fechaInicio) - normalizarFecha(a.fechaInicio);
  });

  const formatDate = (dateObj) => {
    if (!dateObj) return "PRESENTE";
    try {
      let date;
      if (typeof dateObj.toDate === 'function') date = dateObj.toDate();
      else if (dateObj instanceof Date) date = dateObj;
      else if (typeof dateObj === 'number' || typeof dateObj === 'string') date = new Date(dateObj);
      else return "ERR";
      return `${date.toLocaleString('default', { month: 'short' }).toUpperCase()} ${date.getFullYear()}`;
    } catch { return "ERR"; }
  };

  return (
    <div className="relative pl-6 space-y-12">
      {/* Editorial Timeline Line */}
      <div className="absolute top-2 bottom-0 left-0 w-px bg-neo-border opacity-20"></div>

      {dataToShow.map((exp) => (
        <div key={exp.id} className="relative flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          {/* Editorial Square Bullet */}
          <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-neo-border"></div>

          <div className="md:w-3/4">
            <h3 className="font-extended font-black text-xl md:text-2xl leading-tight uppercase tracking-tighter mb-2">
              {exp.cargo}
            </h3>
            <p className="font-bold text-xs uppercase tracking-widest mb-1">{typeof exp.empresa === 'string' ? exp.empresa : exp.empresa?.name || 'Unknown'}</p>
            <p className="font-mono text-[10px] text-neo-border opacity-70 uppercase">{exp.ubicacion || ''}</p>
          </div>

          <div className="md:w-1/4 md:text-right mt-2 md:mt-0">
            <span className="font-mono text-[10px] uppercase font-bold text-neo-border opacity-80 block leading-tight">
              {formatDate(exp.fechaInicio)} —<br />{formatDate(exp.fechaFin)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
