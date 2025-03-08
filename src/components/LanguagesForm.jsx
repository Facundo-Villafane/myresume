import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Escala de niveles de idioma con descripciones
const languageLevels = {
  A1: "Principiante",
  A2: "Básico",
  B1: "Intermedio",
  B2: "Intermedio Alto",
  C1: "Avanzado",
  C2: "Experto",
};

// Lista de idiomas comunes con sus banderas
const commonLanguages = [
  { code: "en", name: "English", flag: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg", country: "United Kingdom" },
  { code: "es", name: "Spanish", flag: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg", country: "Spain" },
  { code: "fr", name: "French", flag: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg", country: "France" },
  { code: "de", name: "German", flag: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg", country: "Germany" },
  { code: "it", name: "Italian", flag: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg", country: "Italy" },
  { code: "pt", name: "Portuguese", flag: "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg", country: "Brasil" },
  { code: "nl", name: "Dutch", flag: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg", country: "Netherlands" },
  { code: "ru", name: "Russian", flag: "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg", country: "Russia" },
  { code: "zh", name: "Chinese", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg", country: "China" },
  { code: "ja", name: "Japanese", flag: "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg", country: "Japan" },
  { code: "ko", name: "Korean", flag: "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg", country: "South Korea" },
  { code: "ar", name: "Arabic", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg", country: "Saudi Arabia" },
  { code: "hi", name: "Hindi", flag: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg", country: "India" },
  { code: "tr", name: "Turkish", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg", country: "Turkey" },
  { code: "pl", name: "Polish", flag: "https://upload.wikimedia.org/wikipedia/en/1/12/Flag_of_Poland.svg", country: "Poland" },
  { code: "sv", name: "Swedish", flag: "https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg", country: "Sweden" },
  { code: "da", name: "Danish", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Denmark.svg", country: "Denmark" },
  { code: "fi", name: "Finnish", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg", country: "Finland" },
  { code: "el", name: "Greek", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Greece.svg", country: "Greece" },
  { code: "he", name: "Hebrew", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Israel.svg", country: "Israel" },
];

const LanguagesForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState("B1");
  const [customLanguage, setCustomLanguage] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [customFlag, setCustomFlag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar idiomas por búsqueda
  const filteredLanguages = commonLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar que hay un idioma seleccionado o personalizado
    if (!selectedLanguage && !customLanguage) {
      return alert("Por favor, selecciona un idioma o ingresa uno personalizado");
    }
    
    setIsLoading(true);
    
    try {
      // Determinar los datos a guardar
      let languageData = {};
      
      if (selectedLanguage) {
        // Si es un idioma seleccionado de la lista
        const langData = commonLanguages.find(l => l.code === selectedLanguage);
        languageData = {
          nombre: langData.name,
          level: level,
          bandera: langData.flag,
          pais: langData.country,
          createdAt: serverTimestamp(),
        };
      } else {
        // Si es un idioma personalizado
        languageData = {
          nombre: customLanguage,
          level: level,
          bandera: customFlag || "",
          pais: customCountry || "",
          createdAt: serverTimestamp(),
        };
      }
      
      // Guardar en Firestore
      await addDoc(collection(db, "lenguajes"), languageData);
      
      // Resetear el formulario
      setSelectedLanguage("");
      setCustomLanguage("");
      setCustomCountry("");
      setCustomFlag("");
      setLevel("B1");
      setSearchQuery("");
      
      alert("Idioma guardado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el idioma");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
      <h2 className="text-lg font-semibold">Agregar Idioma</h2>
      
      {/* Búsqueda de idioma */}
      <div>
        <label className="block text-sm font-medium mb-2">Buscar idioma:</label>
        <input
          type="text"
          placeholder="Buscar por idioma o país..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      
      {/* Selector de idioma con banderas */}
      <div className="border p-3 rounded bg-gray-50 max-h-60 overflow-y-auto">
        <h3 className="text-sm font-medium mb-2">Idiomas disponibles:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredLanguages.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setSelectedLanguage(lang.code);
                setCustomLanguage("");
                setCustomCountry("");
                setCustomFlag("");
              }}
              className={`p-2 rounded flex items-center gap-2 transition-colors text-left ${
                selectedLanguage === lang.code
                  ? 'bg-blue-100 border border-blue-500'
                  : 'bg-white border hover:bg-gray-100'
              }`}
            >
              <img
                src={lang.flag}
                alt={`Flag of ${lang.name}`}
                className="w-6 h-4 object-cover border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/24x16?text=?";
                }}
              />
              <div>
                <span className="text-sm font-medium">{lang.name}</span>
                <span className="text-xs text-gray-500 block">{lang.country}</span>
              </div>
            </button>
          ))}
        </div>
        
        {filteredLanguages.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            No se encontraron idiomas. Puedes agregar uno personalizado.
          </p>
        )}
      </div>
      
      {/* O idioma personalizado */}
      <div className="border-t pt-3">
        <h3 className="text-sm font-medium mb-2">O agrega un idioma personalizado:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nombre del idioma:</label>
            <input
              type="text"
              placeholder="Ej: Catalán"
              value={customLanguage}
              onChange={(e) => {
                setCustomLanguage(e.target.value);
                setSelectedLanguage("");
              }}
              className="border p-2 rounded w-full"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">País:</label>
            <input
              type="text"
              placeholder="Ej: España"
              value={customCountry}
              onChange={(e) => setCustomCountry(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">URL de la bandera (opcional):</label>
            <input
              type="url"
              placeholder="https://example.com/bandera.png"
              value={customFlag}
              onChange={(e) => setCustomFlag(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes buscar imágenes de banderas en sitios como{" "}
              <a 
                href="https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Wikipedia
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Selector de nivel */}
      <div>
        <h3 className="text-sm font-medium mb-2">Nivel de dominio:</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(languageLevels).map(([code, description]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLevel(code)}
              className={`py-1 border rounded transition-colors ${
                level === code
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className="text-sm">{code}</div>
              <div className="text-xs">{description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Vista previa */}
      {(selectedLanguage || customLanguage) && (
        <div className="bg-white border rounded-lg p-3 flex items-center gap-3">
          <div className="flex-shrink-0">
            {selectedLanguage ? (
              <img
                src={commonLanguages.find(l => l.code === selectedLanguage)?.flag}
                alt="Flag preview"
                className="w-10 h-6 object-cover border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/32x24?text=?";
                }}
              />
            ) : customFlag ? (
              <img
                src={customFlag}
                alt="Flag preview"
                className="w-10 h-6 object-cover border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/32x24?text=?";
                }}
              />
            ) : (
              <div className="w-10 h-6 bg-gray-200 flex items-center justify-center text-xs border">
                ?
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium">
              {selectedLanguage 
                ? commonLanguages.find(l => l.code === selectedLanguage)?.name 
                : customLanguage}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{level}</span>
              <span className="text-xs text-gray-500">
                {languageLevels[level]}
              </span>
              {selectedLanguage ? (
                <span className="text-xs text-gray-400 ml-2">
                  {commonLanguages.find(l => l.code === selectedLanguage)?.country}
                </span>
              ) : customCountry ? (
                <span className="text-xs text-gray-400 ml-2">
                  {customCountry}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )}
      
      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading || (!selectedLanguage && !customLanguage)}
      >
        {isLoading ? "Guardando..." : "Guardar Idioma"}
      </button>
    </form>
  );
};

export default LanguagesForm;

