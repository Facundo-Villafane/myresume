import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";

// Logos de empresas conocidas
const defaultCompanyLogos = {
  "Google": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
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

const ExperienceList = () => {
  const q = query(collection(db, "experiencia"), orderBy("timestamp", "desc"));
  const [experiencias, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-gray-500">Cargando experiencia...</p>;
  if (error) return <p className="text-red-500">Error al cargar experiencia: {error.message}</p>;

  // Si no hay datos, mostramos ejemplos
  const showExamples = !experiencias || experiencias.length === 0;
  
  // Datos de ejemplo que se mostrarán si no hay datos reales
  const ejemplos = [
    {
      id: "example1",
      cargo: "VR Designer",
      empresa: "Meta",
      ubicacion: "Menlo Park, California",
      fechaInicio: new Date(2022, 0, 1),
      fechaFin: null, // Presente
      descripcion: "Diseño de interfaces de usuario para experiencias de realidad virtual."
    },
    {
      id: "example2",
      cargo: "Product Designer",
      empresa: "Apple",
      ubicacion: "Cupertino, California",
      fechaInicio: new Date(2020, 6, 1),
      fechaFin: new Date(2022, 0, 1),
      descripcion: "Diseño de productos hardware y software para ecosistema Apple."
    },
    {
      id: "example3",
      cargo: "UX Designer",
      empresa: "Tesla",
      ubicacion: "Austin, Texas",
      fechaInicio: new Date(2015, 9, 1),
      fechaFin: new Date(2020, 2, 1),
      descripcion: "Diseño de interfaces para vehículos eléctricos y aplicaciones complementarias."
    }
  ];

  const dataToShow = showExamples ? ejemplos : experiencias;

  // Función para formatear fechas
  const formatDate = (dateObj) => {
    if (!dateObj) return "Presente";
    
    // Asegurarse de que dateObj sea un objeto Date válido
    let date;
    try {
      // Si es un objeto de Firestore con método toDate()
      if (dateObj && typeof dateObj.toDate === 'function') {
        date = dateObj.toDate();
      } 
      // Si ya es un objeto Date
      else if (dateObj instanceof Date) {
        date = dateObj;
      } 
      // Si es un timestamp o un string, convertirlo a Date
      else if (typeof dateObj === 'number' || typeof dateObj === 'string') {
        date = new Date(dateObj);
      } 
      // En cualquier otro caso, usar la fecha actual
      else {
        console.warn('Formato de fecha desconocido:', dateObj);
        return "Fecha desconocida";
      }

      // Formatear la fecha
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${month} ${year}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error, dateObj);
      return "Fecha inválida";
    }
  };

  // Obtener el logo de una empresa
  const getCompanyLogo = (companyName) => {
    // Intentar primero el logo guardado en el documento
    if (typeof companyName === 'object' && companyName !== null) {
      // Para manejar el caso donde la empresa es un objeto con un campo logo
      return companyName.logo || defaultCompanyLogos[companyName.name] || null;
    }
    
    // Comprobar si hay un logo en los datos de la experiencia
    const expData = dataToShow.find(exp => exp.empresa === companyName);
    if (expData && expData.logo) {
      return expData.logo;
    }
    
    // Usar el logo predeterminado
    return defaultCompanyLogos[companyName] || null;
  };

  return (
    <div className="space-y-6">
      {dataToShow.map((exp) => (
        <div key={exp.id} className="flex gap-4">
          {/* Logo de la empresa */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {exp.logo || getCompanyLogo(exp.empresa) ? (
                <img 
                  src={exp.logo || getCompanyLogo(exp.empresa)}
                  alt={typeof exp.empresa === 'string' ? exp.empresa : exp.empresa.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    const companyName = typeof exp.empresa === 'string' ? exp.empresa : exp.empresa.name;
                    e.target.src = `https://via.placeholder.com/40?text=${companyName.charAt(0)}`;
                  }}
                />
              ) : (
                <span className="text-xl font-bold text-gray-500">
                  {typeof exp.empresa === 'string' 
                    ? exp.empresa.charAt(0)
                    : (exp.empresa.name ? exp.empresa.name.charAt(0) : 'C')}
                </span>
              )}
            </div>
          </div>
          
          {/* Detalles del trabajo */}
          <div className="flex-grow">
            <div className="flex flex-wrap justify-between items-start mb-1">
              <div>
                <h3 className="font-medium text-gray-900">{exp.cargo}</h3>
                <p className="text-gray-600">
                  {typeof exp.empresa === 'string' ? exp.empresa : exp.empresa.name}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {formatDate(exp.fechaInicio)} — {formatDate(exp.fechaFin)}
                </p>
                {exp.ubicacion && (
                  <p className="text-xs text-gray-400 mt-1">
                    {exp.ubicacion}
                  </p>
                )}
              </div>
            </div>
            
            {exp.descripcion && (
              <p className="text-sm text-gray-600 mt-2">
                {exp.descripcion}
              </p>
            )}
          </div>
        </div>
      ))}
      
      {showExamples && (
        <p className="text-xs text-gray-500 italic mt-4">
          Nota: Estos son datos de ejemplo. Agrega experiencia real desde el panel de administración.
        </p>
      )}
    </div>
  );
};

export default ExperienceList;