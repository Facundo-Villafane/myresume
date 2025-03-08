import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";

// Logos de empresas conocidas (respaldo inicial)
const defaultCompanyLogos = {
  "Google": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
  "Apple": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
  "Meta": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1280px-Meta_Platforms_Inc._logo.svg.png",
  "Tesla": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/1024px-Tesla_T_symbol.svg.png",
  "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
  "Amazon": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png", 
  "Netflix": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
  "Adobe": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/1280px-Adobe_Corporate_Logo.png",
  "IBM": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
  "Airbnb": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png",
  "Facebook": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/F_icon.svg/2048px-F_icon.svg.png",
  "Twitter": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png"
};

const ExperienceForm = () => {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPosition, setCurrentPosition] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [customLogo, setCustomLogo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para almacenar empresas desde Firestore
  const [companyLogos, setCompanyLogos] = useState(defaultCompanyLogos);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Cargar empresas existentes desde Firestore
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoadingCompanies(true);
        
        // Intentar cargar de una colección especial para empresas si existe
        const companiesRef = collection(db, "empresas");
        const companiesSnapshot = await getDocs(companiesRef);
        
        if (!companiesSnapshot.empty) {
          const companiesData = {};
          companiesSnapshot.forEach(doc => {
            const data = doc.data();
            companiesData[data.nombre] = data.logo;
          });
          
          // Combinar con las empresas predeterminadas
          setCompanyLogos({...defaultCompanyLogos, ...companiesData});
        } else {
          // Si no hay colección específica, intentar extraer de experiencia existente
          const experienceRef = collection(db, "experiencia");
          const experienceQuery = query(experienceRef, orderBy("timestamp", "desc"));
          const experienceSnapshot = await getDocs(experienceQuery);
          
          if (!experienceSnapshot.empty) {
            const extractedCompanies = {};
            experienceSnapshot.forEach(doc => {
              const data = doc.data();
              if (data.empresa && data.logo && !defaultCompanyLogos[data.empresa]) {
                extractedCompanies[data.empresa] = data.logo;
              }
            });
            
            // Combinar con las empresas predeterminadas
            setCompanyLogos({...defaultCompanyLogos, ...extractedCompanies});
          }
        }
      } catch (error) {
        console.error("Error cargando empresas:", error);
      } finally {
        setLoadingCompanies(false);
      }
    };
    
    loadCompanies();
  }, []);

  // Lista de empresas disponibles
  const availableCompanies = Object.keys(companyLogos).map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name: name,
    logo: companyLogos[name],
    category: "company"
  }));

  // Categorías para empresas
  const categories = [
    { id: "all", name: "Todas" },
    { id: "company", name: "Empresas" }
  ];

  // Filtrar empresas por búsqueda
  const filteredCompanies = availableCompanies.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Formatear fechas para vista previa
  const formatPreviewDate = (dateString) => {
    if (!dateString) return "Presente";
    
    try {
      const date = new Date(dateString);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${month} ${year}`;
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!company || !position || !startDate || (!endDate && !currentPosition) || !location) {
      return alert("Por favor, completa todos los campos obligatorios");
    }
    
    setIsLoading(true);
    
    try {
      // Logo a utilizar
      const logoUrl = customLogo || companyLogos[company] || "";
      
      // Convertir fechas a objetos Date para Firestore
      const startDateObj = new Date(startDate);
      let endDateObj = null;
      if (!currentPosition && endDate) {
        endDateObj = new Date(endDate);
      }
      
      // Preparar los datos para guardar
      const experienceData = {
        empresa: company,
        cargo: position,
        fechaInicio: startDateObj,
        fechaFin: currentPosition ? null : endDateObj,
        ubicacion: location,
        descripcion: description,
        logo: logoUrl,
        timestamp: serverTimestamp(),
      };
      
      // Guardar en Firestore
      await addDoc(collection(db, "experiencia"), experienceData);
      
      // Si es una nueva empresa con logo, guardarla en la colección de empresas
      if (logoUrl && !companyLogos[company]) {
        try {
          // Primero verificar si ya existe la colección
          const companiesRef = collection(db, "empresas");
          await addDoc(companiesRef, {
            nombre: company,
            logo: logoUrl,
            createdAt: serverTimestamp()
          });
          
          // Actualizar el estado local
          setCompanyLogos(prevLogos => ({
            ...prevLogos,
            [company]: logoUrl
          }));
        } catch (error) {
          console.error("Error al guardar la empresa:", error);
          // No interrumpimos el flujo principal si esto falla
        }
      }
      
      // Resetear el formulario
      setCompany("");
      setPosition("");
      setStartDate("");
      setEndDate("");
      setCurrentPosition(false);
      setLocation("");
      setDescription("");
      setCustomLogo("");
      setSearchQuery("");
      
      alert("Experiencia guardada correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar la experiencia");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
      <h2 className="text-lg font-semibold">Agregar Experiencia</h2>
      
      {/* Filtro por categoría */}
      <div className="mb-2">
        <h3 className="text-sm font-medium mb-2">Filtrar empresas:</h3>
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
          placeholder="Buscar empresa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      
      {/* Lista de empresas disponibles */}
      <div className="border p-3 rounded bg-gray-50 max-h-60 overflow-y-auto">
        <h3 className="text-sm font-medium mb-2">Empresas disponibles:</h3>
        {loadingCompanies ? (
          <p className="text-sm text-gray-500 text-center py-2">
            Cargando empresas...
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredCompanies.map(comp => (
              <button
                key={comp.id}
                type="button"
                onClick={() => {
                  setCompany(comp.name);
                  setCustomLogo("");
                }}
                className={`text-xs p-2 rounded flex items-center gap-1 transition-colors text-left ${
                  company === comp.name
                    ? 'bg-blue-100 border border-blue-500'
                    : 'bg-white border hover:bg-gray-100'
                }`}
              >
                <div className="w-6 h-6 flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                  {comp.logo ? (
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/24x24?text=${comp.name.charAt(0)}`;
                      }}
                    />
                  ) : (
                    <span className="text-xs font-medium">{comp.name.charAt(0)}</span>
                  )}
                </div>
                <span className="truncate">{comp.name}</span>
              </button>
            ))}
          </div>
        )}
        
        {!loadingCompanies && filteredCompanies.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            No se encontraron empresas. Puedes agregar una personalizada.
          </p>
        )}
      </div>
      
      {/* O empresa personalizada */}
      <div className="border-t pt-3">
        <h3 className="text-sm font-medium mb-2">O agrega una empresa personalizada:</h3>
        <input
          type="text"
          placeholder="Nombre de la empresa"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
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
          Si agregas una URL de logo, la empresa se guardará para futuras selecciones.
        </p>
      </div>
      
      {/* Cargo */}
      <div>
        <label className="block text-sm font-medium mb-2">Cargo:</label>
        <input
          type="text"
          placeholder="Ej: UX Designer"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      
      {/* Ubicación */}
      <div>
        <label className="block text-sm font-medium mb-2">Ubicación:</label>
        <input
          type="text"
          placeholder="Ej: San Francisco, CA"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      
      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Fecha de inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Fecha de fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full"
            disabled={currentPosition}
            required={!currentPosition}
          />
        </div>
      </div>
      
      {/* Trabajo actual */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="currentPosition"
          checked={currentPosition}
          onChange={() => setCurrentPosition(!currentPosition)}
          className="mr-2"
        />
        <label htmlFor="currentPosition" className="text-sm">
          Posición actual
        </label>
      </div>
      
      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium mb-2">Descripción:</label>
        <textarea
          placeholder="Describe tus responsabilidades y logros"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full min-h-[80px]"
        />
      </div>
      
      {/* Vista previa */}
      {(company || position) && (
        <div className="bg-white border rounded-lg p-4 mt-2">
          <div className="flex gap-4">
            {/* Logo de la empresa */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {customLogo || companyLogos[company] ? (
                  <img 
                    src={customLogo || companyLogos[company]}
                    alt={company}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/40?text=${company.charAt(0)}`;
                    }}
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-500">
                    {company.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Detalles del trabajo */}
            <div className="flex-grow">
              <div className="flex flex-wrap justify-between items-start mb-1">
                <div>
                  <h3 className="font-medium text-gray-900">{position || "Cargo"}</h3>
                  <p className="text-gray-600">{company || "Empresa"}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {startDate ? formatPreviewDate(startDate) : "Fecha inicio"} — {currentPosition ? "Presente" : (endDate ? formatPreviewDate(endDate) : "Fecha fin")}
                  </p>
                  {location && (
                    <p className="text-xs text-gray-400 mt-1">
                      {location}
                    </p>
                  )}
                </div>
              </div>
              
              {description && (
                <p className="text-sm text-gray-600 mt-2">
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
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar Experiencia"}
      </button>
    </form>
  );
};

export default ExperienceForm;

