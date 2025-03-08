import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";

// Logos de instituciones educativas conocidas
const institutionLogos = {
  "Coursera": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/1200px-Coursera-Logo_600x600.svg.png",
  "Udemy": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/2560px-Udemy_logo.svg.png",
  "edX": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/EdX.svg/1280px-EdX.svg.png",
  "LinkedIn Learning": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Linkedin_icon.svg/640px-Linkedin_icon.svg.png",
  "Google": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/768px-Google_%22G%22_Logo.svg.png",
  "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
  "Harvard University": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/1200px-Harvard_University_logo.svg.png",
  "MIT": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/2560px-MIT_logo.svg.png",
  "Stanford University": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png",
  "Universidad Tecnológica Nacional": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Loguito.svg/641px-Loguito.svg.png",
  "Centro de E-learning UTN.BA": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Logo_Centro_de_e-Learning_UTN_BA.png",
  "Coderhouse": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Logo_blackbg.png/640px-Logo_blackbg.png",
  "Ciac Avea": "https://www.avea-argentina.com/images/Logo/avea.png",
};

// Datos de ejemplo para cuando no hay educación registrada
const mockEducation = [
  {
    id: "coderhouse1",
    institucion: "Coderhouse",
    titulo: "Build a design system",
    año: "2021",
    descripcion: "Curso especializado en diseño de sistemas",
    logo: institutionLogos["Memorisely"]
  },
  {
    id: "mit1",
    institucion: "MIT",
    titulo: "UX Design certificate",
    año: "2020",
    descripcion: "Certificado profesional en diseño UX",
    logo: institutionLogos["UX Academy"]
  },
  {
    id: "coursera1",
    institucion: "Coursera",
    titulo: "Usera research course",
    año: "2019",
    descripcion: "Curso avanzado de investigación de usuarios",
    logo: institutionLogos["Coursera"]
  }
];

const EducationList = () => {
  const q = query(collection(db, "educacion"), orderBy("createdAt", "desc"));
  const [educacion, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-gray-500">Cargando educación...</p>;
  if (error) return <p className="text-red-500">Error al cargar educación: {error.message}</p>;

  // Si no hay datos, usamos los datos de ejemplo
  const educationData = educacion && educacion.length > 0 ? educacion : mockEducation;
  const showingMockData = educacion && educacion.length === 0;

  // Función para obtener el logo de una institución
  const getInstitutionLogo = (institution) => {
    return institutionLogos[institution] || null;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {educationData.map((edu) => (
          <div key={edu.id} className="bg-gray-50 border rounded-lg p-4">
            <div className="flex items-start gap-3">
              {/* Logo de la institución */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                  {edu.logo || getInstitutionLogo(edu.institucion) ? (
                    <img 
                      src={edu.logo || getInstitutionLogo(edu.institucion)}
                      alt={edu.institucion}
                      className="w-9 h-9 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/40?text=${edu.institucion.charAt(0)}`;
                      }}
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-500">
                      {edu.institucion.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Detalles de la educación */}
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">{edu.titulo}</h3>
                <p className="text-gray-600 text-sm">{edu.institucion}</p>
                
                <p className="text-xs text-gray-500 mt-1">
                  {edu.cursando ? "Actualmente cursando" : edu.año}
                </p>
                
                {edu.descripcion && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {edu.descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showingMockData && (
        <p className="text-xs text-gray-500 italic mt-4">
          Nota: Estos son datos de ejemplo. Agrega educación real desde el panel de administración.
        </p>
      )}
    </div>
  );
};

export default EducationList;