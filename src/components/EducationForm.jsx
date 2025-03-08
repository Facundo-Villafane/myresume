import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";

// Logos de instituciones educativas conocidas (respaldo inicial)
const defaultInstitutionLogos = {
  "Coursera": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/1200px-Coursera-Logo_600x600.svg.png",
  "Udemy": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/2560px-Udemy_logo.svg.png",
  "edX": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/EdX.svg/1280px-EdX.svg.png",
  "LinkedIn Learning": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Linkedin_icon.svg/640px-Linkedin_icon.svg.png",
  "Google": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
  "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
  "Harvard University": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/1200px-Harvard_University_logo.svg.png",
  "MIT": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/2560px-MIT_logo.svg.png",
  "Stanford University": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png",
  "Universidad Tecnológica Nacional": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Loguito.svg/641px-Loguito.svg.png",
  "Centro de E-learning UTN.BA": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Logo_Centro_de_e-Learning_UTN_BA.png",
  "Coderhouse": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Logo_blackbg.png/640px-Logo_blackbg.png",
  "Ciac Avea": "https://www.avea-argentina.com/images/Logo/avea.png",
};

const EducationForm = () => {
  const [institution, setInstitution] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [currentlyStudying, setCurrentlyStudying] = useState(false);
  const [description, setDescription] = useState("");
  const [customLogo, setCustomLogo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Estado para almacenar instituciones desde Firestore
  const [institutionLogos, setInstitutionLogos] = useState(defaultInstitutionLogos);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);

  // Cargar instituciones existentes desde Firestore
  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        setLoadingInstitutions(true);
        
        // Intentar cargar de una colección especial para instituciones si existe
        const institutionsRef = collection(db, "instituciones");
        const institutionsSnapshot = await getDocs(institutionsRef);
        
        if (!institutionsSnapshot.empty) {
          const institutionsData = {};
          institutionsSnapshot.forEach(doc => {
            const data = doc.data();
            institutionsData[data.nombre] = data.logo;
          });
          
          // Combinar con las instituciones predeterminadas
          setInstitutionLogos({...defaultInstitutionLogos, ...institutionsData});
        } else {
          // Si no hay colección específica, intentar extraer de educación existente
          const educationRef = collection(db, "educacion");
          const educationQuery = query(educationRef, orderBy("createdAt", "desc"));
          const educationSnapshot = await getDocs(educationQuery);
          
          if (!educationSnapshot.empty) {
            const extractedInstitutions = {};
            educationSnapshot.forEach(doc => {
              const data = doc.data();
              if (data.institucion && data.logo && !defaultInstitutionLogos[data.institucion]) {
                extractedInstitutions[data.institucion] = data.logo;
              }
            });
            
            // Combinar con las instituciones predeterminadas
            setInstitutionLogos({...defaultInstitutionLogos, ...extractedInstitutions});
          }
        }
      } catch (error) {
        console.error("Error cargando instituciones:", error);
      } finally {
        setLoadingInstitutions(false);
      }
    };
    
    loadInstitutions();
  }, []);

  // Lista de instituciones disponibles
  const availableInstitutions = Object.keys(institutionLogos).map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name: name,
    logo: institutionLogos[name],
    category: "education"
  }));

  // Categorías para instituciones
  const categories = [
    { id: "all", name: "Todas" },
    { id: "education", name: "Instituciones" }
  ];

  // Filtrar instituciones por búsqueda
  const filteredInstitutions = availableInstitutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!institution || !title || (!year && !currentlyStudying)) {
      return alert("Completa los campos requeridos");
    }
    
    setIsLoading(true);
    
    try {
      // Logo a utilizar
      const logoUrl = customLogo || institutionLogos[institution] || "";
      
      // Preparar los datos para guardar
      const educationData = {
        institucion: institution,
        titulo: title,
        año: currentlyStudying ? "Cursando" : year,
        cursando: currentlyStudying,
        descripcion: description,
        logo: logoUrl,
        createdAt: serverTimestamp(),
      };
      
      // Guardar en Firestore
      await addDoc(collection(db, "educacion"), educationData);
      
      // Si es una nueva institución con logo, guardarla en la colección de instituciones
      if (logoUrl && !institutionLogos[institution]) {
        try {
          // Primero verificar si ya existe la colección
          const institutionsRef = collection(db, "instituciones");
          await addDoc(institutionsRef, {
            nombre: institution,
            logo: logoUrl,
            createdAt: serverTimestamp()
          });
          
          // Actualizar el estado local
          setInstitutionLogos(prevLogos => ({
            ...prevLogos,
            [institution]: logoUrl
          }));
        } catch (error) {
          console.error("Error al guardar la institución:", error);
          // No interrumpimos el flujo principal si esto falla
        }
      }
      
      // Resetear el formulario
      setInstitution("");
      setTitle("");
      setYear(new Date().getFullYear().toString());
      setCurrentlyStudying(false);
      setDescription("");
      setCustomLogo("");
      setSearchQuery("");
      
      alert("Educación guardada correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar la educación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
      <h2 className="text-lg font-semibold">Agregar Educación</h2>
      
      {/* Filtro por categoría */}
      <div className="mb-2">
        <h3 className="text-sm font-medium mb-2">Filtrar instituciones:</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Búsqueda */}
      <div>
        <input
          type="text"
          placeholder="Buscar institución..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      
      {/* Lista de instituciones disponibles */}
      <div className="border p-3 rounded bg-gray-50 max-h-60 overflow-y-auto">
        <h3 className="text-sm font-medium mb-2">Instituciones disponibles:</h3>
        {loadingInstitutions ? (
          <p className="text-sm text-gray-500 text-center py-2">
            Cargando instituciones...
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredInstitutions.map(inst => (
              <button
                key={inst.id}
                type="button"
                onClick={() => {
                  setInstitution(inst.name);
                  setCustomLogo("");
                }}
                className={`text-xs p-2 rounded flex items-center gap-1 transition-colors text-left ${
                  institution === inst.name
                    ? 'bg-blue-100 border border-blue-500'
                    : 'bg-white border hover:bg-gray-100'
                }`}
              >
                <div className="w-6 h-6 flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                  {inst.logo ? (
                    <img
                      src={inst.logo}
                      alt={inst.name}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/24x24?text=${inst.name.charAt(0)}`;
                      }}
                    />
                  ) : (
                    <span className="text-xs font-medium">{inst.name.charAt(0)}</span>
                  )}
                </div>
                <span className="truncate">{inst.name}</span>
              </button>
            ))}
          </div>
        )}
        
        {!loadingInstitutions && filteredInstitutions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            No se encontraron instituciones. Puedes agregar una personalizada.
          </p>
        )}
      </div>
      
      {/* O institución personalizada */}
      <div className="border-t pt-3">
        <h3 className="text-sm font-medium mb-2">O agrega una institución personalizada:</h3>
        <input
          type="text"
          placeholder="Nombre de la institución"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        
        <input
          type="url"
          placeholder="URL del logo (opcional)"
          value={customLogo}
          onChange={(e) => setCustomLogo(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Si agregas una URL de logo, la institución se guardará para futuras selecciones.
        </p>
      </div>
      
      {/* Título del curso/certificado */}
      <div>
        <label className="block text-sm font-medium mb-2">Título:</label>
        <input
          type="text"
          placeholder="Ej: Certificado en UX Design"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      
      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium mb-2">Descripción (opcional):</label>
        <textarea
          placeholder="Breve descripción del curso o certificado"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full min-h-[80px]"
        />
      </div>
      
      {/* Año y estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Año:</label>
          <input
            type="number"
            placeholder="Año de finalización"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded w-full"
            disabled={currentlyStudying}
            min="1900"
            max="2100"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="currentlyStudying"
            checked={currentlyStudying}
            onChange={() => setCurrentlyStudying(!currentlyStudying)}
            className="mr-2"
          />
          <label htmlFor="currentlyStudying" className="text-sm">
            Actualmente cursando
          </label>
        </div>
      </div>
      
      {/* Vista previa */}
      {(institution || title) && (
        <div className="bg-gray-50 border rounded-lg p-4 mt-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                {customLogo || institutionLogos[institution] ? (
                  <img 
                    src={customLogo || institutionLogos[institution]}
                    alt={institution}
                    className="w-9 h-9 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/40?text=${institution.charAt(0)}`;
                    }}
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-500">
                    {institution.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900">{title || "Título del curso"}</h3>
              <p className="text-gray-600 text-sm">{institution || "Nombre de la institución"}</p>
              
              <p className="text-xs text-gray-500 mt-1">
                {currentlyStudying ? "Actualmente cursando" : year}
              </p>
              
              {description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading || !institution || !title || (!year && !currentlyStudying)}
      >
        {isLoading ? "Guardando..." : "Guardar Educación"}
      </button>
    </form>
  );
};

export default EducationForm;
