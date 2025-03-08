import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Lista de tecnologías disponibles (se puede expandir según necesidades)
const availableTechnologies = [
  { id: "react", name: "React", icon: "FaReact" },
  { id: "vue", name: "Vue.js", icon: "FaVuejs" },
  { id: "angular", name: "Angular", icon: "FaAngular" },
  { id: "js", name: "JavaScript", icon: "FaJs" },
  { id: "ts", name: "TypeScript", icon: "SiTypescript" },
  { id: "html", name: "HTML5", icon: "FaHtml5" },
  { id: "css", name: "CSS3", icon: "FaCss3Alt" },
  { id: "sass", name: "Sass", icon: "FaSass" },
  { id: "node", name: "Node.js", icon: "FaNodeJs" },
  { id: "python", name: "Python", icon: "FaPython" },
  { id: "java", name: "Java", icon: "FaJava" },
  { id: "php", name: "PHP", icon: "FaPhp" },
  { id: "csharp", name: "C#", icon: "TbBrandCSharp" },
  { id: "ruby", name: "Ruby", icon: "FaGem" },
  { id: "go", name: "Go", icon: "FaGolang" },
  { id: "swift", name: "Swift", icon: "FaSwift" },
  { id: "kotlin", name: "Kotlin", icon: "SiKotlin" },
  { id: "mongodb", name: "MongoDB", icon: "SiMongodb" },
  { id: "mysql", name: "MySQL", icon: "SiMysql" },
  { id: "postgres", name: "PostgreSQL", icon: "SiPostgresql" },
  { id: "firebase", name: "Firebase", icon: "SiFirebase" },
  { id: "aws", name: "AWS", icon: "FaAws" },
  { id: "docker", name: "Docker", icon: "FaDocker" },
  { id: "kubernetes", name: "Kubernetes", icon: "SiKubernetes" },
  { id: "git", name: "Git", icon: "FaGitAlt" },
  { id: "figma", name: "Figma", icon: "FaFigma" },
  { id: "tailwind", name: "Tailwind CSS", icon: "SiTailwindcss" },
  { id: "bootstrap", name: "Bootstrap", icon: "FaBootstrap" },
  { id: "materialui", name: "Material UI", icon: "SiMaterialdesign" },
  { id: "redux", name: "Redux", icon: "SiRedux" },
  { id: "graphql", name: "GraphQL", icon: "SiGraphql" },
  { id: "unity", name: "Unity", icon: "SiUnity" },
  { id: "godot", name: "Godot", icon: "SiGodotengine" },
  { id: "unreal", name: "Unreal Engine", icon: "SiUnrealengine" },
  { id: "construct", name: "Construct 3", icon: "SiConstruct3" },
  { id: "aftereffects", name: "After Effects", icon: "SiAdobeaftereffects" },
  { id: "illustrator", name: "Illustrator", icon: "SiAdobeillustrator" },
  { id: "photoshop", name: "Photoshop", icon: "SiAdobephotoshop" },
  { id: "indesign", name: "In Design", icon: "SiAdobeindesign" },
  { id: "audition", name: "Audition", icon: "SiAdobeaudition" },
  { id: "cplusplus", name: "C++", icon: "SiCplusplus" },
];

const ProjectForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkType, setLinkType] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  
  // Detectar el tipo de enlace y generar una imagen de vista previa
  useEffect(() => {
    if (!link) {
      setImageUrl("");
      setLinkType("");
      return;
    }

    try {
      const url = new URL(link);
      
      // Determinar el tipo de enlace y establecer una imagen de vista previa
      if (url.hostname.includes("github.com")) {
        // Para GitHub: Usar la API de GitHub para conseguir la imagen del repo
        const parts = url.pathname.split('/').filter(part => part);
        if (parts.length >= 2) {
          const username = parts[0];
          const repo = parts[1];
          setImageUrl(`https://opengraph.githubassets.com/1/${username}/${repo}`);
          setLinkType("github");
        } else {
          // Si es un perfil de GitHub u otro enlace de GitHub
          setImageUrl("https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png");
          setLinkType("github");
        }
      } else if (url.hostname.includes("itch.io")) {
        // Para itch.io: Usar el dominio del juego como identificador
        setImageUrl(`https://img.itch.zone/aW1nLzEyMzQ1Njc4OTAvMzYweDIxOC8xMjM0NTYvc2NyZWVuc2hvdC5wbmc=/original/abc123.png`);
        setLinkType("itch.io");
        // Nota: No hay forma fácil de obtener la imagen desde itch.io sin scraping
        // Esto es solo un marcador de posición
      } else if (url.hostname.includes("behance.net")) {
        // Para Behance: Usar un logo genérico de Behance
        setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Behance_logo.svg/1280px-Behance_logo.svg.png");
        setLinkType("behance");
        // Nota: Behance no ofrece una API pública fácil para esto
      } else {
        // Para otros enlaces: Usar una imagen genérica basada en el dominio
        setImageUrl(`https://logo.clearbit.com/${url.hostname}`);
        setLinkType("other");
      }
    } catch (error) {
      console.error("URL inválida:", error);
      setImageUrl("");
      setLinkType("");
    }
  }, [link]);

  const handleTechnologySelection = (techId) => {
    setSelectedTechnologies(prevSelected => {
      // Si ya está seleccionada, la removemos
      if (prevSelected.includes(techId)) {
        return prevSelected.filter(id => id !== techId);
      }
      
      // Si ya tenemos 3 tecnologías seleccionadas, no permitimos más
      if (prevSelected.length >= 3) {
        return prevSelected;
      }
      
      // Agregamos la nueva tecnología
      return [...prevSelected, techId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !link) return alert("Completa todos los campos");
    
    setIsLoading(true);
    
    try {
      await addDoc(collection(db, "proyectos"), {
        titulo: title,
        descripcion: description,
        enlace: link,
        imagenUrl: imageUrl,    // URL de la imagen
        tipo: linkType,         // Tipo de enlace
        tecnologias: selectedTechnologies, // IDs de las tecnologías utilizadas
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setLink("");
      setImageUrl("");
      setLinkType("");
      setSelectedTechnologies([]);
      
      alert("Proyecto guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el proyecto");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar la subida manual de imágenes usando imgbb.com (gratuito)
  const handleManualImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
      alert("Para guardar esta imagen de forma permanente, necesitarás subirla a un servicio como ImgBB y pegar el enlace que te proporcionen en el campo 'URL de la imagen'.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
      <h2 className="text-lg font-semibold">Agregar Proyecto</h2>
      
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
        required
      />
      
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded min-h-[100px]"
        required
      />
      
      <div className="space-y-2">
        <label htmlFor="link" className="block text-sm font-medium">Enlace del proyecto:</label>
        <input
          id="link"
          type="url"
          placeholder="https://ejemplo.com/proyecto"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Selector de tecnologías */}
      <div className="border p-3 rounded bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Tecnologías utilizadas (máximo 3):</h3>
        <div className="flex flex-wrap gap-2">
          {availableTechnologies.map(tech => (
            <button
              key={tech.id}
              type="button"
              onClick={() => handleTechnologySelection(tech.id)}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                selectedTechnologies.includes(tech.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {tech.name}
            </button>
          ))}
        </div>
        {selectedTechnologies.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-medium">Tecnologías seleccionadas:</h4>
            <div className="flex gap-2 mt-1">
              {selectedTechnologies.map(techId => {
                const tech = availableTechnologies.find(t => t.id === techId);
                return (
                  <div key={techId} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {tech.name}
                    <button
                      type="button"
                      onClick={() => handleTechnologySelection(techId)}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Vista previa de la imagen */}
      <div className="border p-3 rounded bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Vista previa de la imagen:</h3>
        
        {imageUrl ? (
          <div className="space-y-2">
            <div className="relative aspect-video w-full bg-gray-200 overflow-hidden rounded">
              <img 
                src={imageUrl} 
                alt="Vista previa"
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x225?text=Vista+previa+no+disponible";
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Tipo detectado: {linkType || "No detectado"}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center aspect-video w-full bg-gray-200 rounded">
            <p className="text-gray-500 text-sm">Sin vista previa</p>
          </div>
        )}
        
        <div className="mt-3">
          <p className="text-sm font-medium">Imagen personalizada:</p>
          <div className="mt-2 flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleManualImageUpload}
              className="text-sm"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm">o URL de imagen:</span>
              <input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="border p-1 rounded flex-1 text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">
              Consejo: Puedes subir tu imagen a servicios gratuitos como 
              <a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1">
                ImgBB
              </a> y pegar la URL aquí.
            </p>
          </div>
        </div>
      </div>
      
      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar Proyecto"}
      </button>
    </form>
  );
};

export default ProjectForm;