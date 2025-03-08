import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";

// Escala de niveles de idioma con descripciones
const languageLevels = {
  A1: "Principiante",
  A2: "Básico",
  B1: "Intermedio",
  B2: "Intermedio Alto",
  C1: "Avanzado",
  C2: "Experto",
};

// Datos de ejemplo para cuando no hay idiomas en la base de datos
const mockLanguages = [
  { 
    id: "italian1", 
    nombre: "Italian", 
    level: "C1", 
    bandera: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg",
    pais: "Italy"
  },
  { 
    id: "greek1", 
    nombre: "Greek", 
    level: "C1", 
    bandera: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Greece.svg",
    pais: "Greece"
  },
  { 
    id: "english1", 
    nombre: "English", 
    level: "C2", 
    bandera: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
    pais: "United Kingdom"
  },
  { 
    id: "spanish1", 
    nombre: "Spanish", 
    level: "B1", 
    bandera: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",
    pais: "Spain"
  }
];

const LanguagesList = () => {
  const q = query(collection(db, "lenguajes"), orderBy("nombre", "asc"));
  const [lenguajes, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-gray-500">Cargando idiomas...</p>;
  if (error) return <p className="text-red-500">Error al cargar idiomas: {error.message}</p>;

  // Si no hay datos, usamos los datos de ejemplo
  const languageData = lenguajes && lenguajes.length > 0 ? lenguajes : mockLanguages;
  const showingMockData = lenguajes && lenguajes.length === 0;

  return (
    <div>
      {/* Listado de idiomas con banderas */}
      <div className="languages-grid">
        {languageData.map((lang) => (
          <div key={lang.id} className="flex items-center gap-3 mb-4">
            {/* Bandera del idioma */}
            <div className="flex-shrink-0">
              {lang.bandera ? (
                <img
                  src={lang.bandera}
                  alt={`Flag of ${lang.nombre}`}
                  className="w-8 h-6 object-contain border border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/32x24?text=?";
                  }}
                />
              ) : (
                <div className="w-8 h-6 bg-gray-200 flex items-center justify-center text-xs border">
                  ?
                </div>
              )}
            </div>
            
            {/* Información del idioma */}
            <div>
              <div className="flex items-baseline">
                <h3 className="font-medium">{lang.nombre}</h3>
                
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-medium">{lang.level}</span>
                <span className="text-xs text-gray-500 ml-1">{languageLevels[lang.level]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showingMockData && (
        <p className="text-xs text-gray-500 italic mt-4">
          Nota: Estos son datos de ejemplo. Agrega tus idiomas reales desde el panel de administración.
        </p>
      )}
    </div>
  );
};

export default LanguagesList;
