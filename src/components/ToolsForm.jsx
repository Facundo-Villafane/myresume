import { useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Lista de herramientas comunes con sus iconos
const availableTools = [
  // Hard Skills (Técnicas)
  // Diseño y Creatividad
  { id: "photoshop", name: "Adobe Photoshop", icon: "SiAdobephotoshop", category: "hard" },
  { id: "illustrator", name: "Adobe Illustrator", icon: "SiAdobeillustrator", category: "hard" },
  { id: "xd", name: "Adobe XD", icon: "SiAdobexd", category: "hard" },
  { id: "aftereffects", name: "Adobe After Effects", icon: "SiAdobeaftereffects", category: "hard" },
  { id: "premierepro", name: "Adobe Premiere Pro", icon: "SiAdobepremierepro", category: "hard" },
  { id: "indesign", name: "Adobe InDesign", icon: "SiAdobeindesign", category: "hard" },
  { id: "lightroom", name: "Adobe Lightroom", icon: "SiAdobelightroom", category: "hard" },
  { id: "figma", name: "Figma", icon: "FaFigma", category: "hard" },
  { id: "sketch", name: "Sketch", icon: "SiSketch", category: "hard" },
  { id: "invision", name: "InVision", icon: "SiInvision", category: "hard" },
  { id: "blender", name: "Blender", icon: "SiBlender", category: "hard" },
  
  // Desarrollo y Programación
  { id: "vscode", name: "Visual Studio Code", icon: "DiVisualstudio", category: "hard" },
  { id: "visualstudio", name: "Visual Studio", icon: "BiLogoVisualStudio", category: "hard" },
  { id: "intellij", name: "IntelliJ IDEA", icon: "SiIntellijidea", category: "hard" },
  { id: "androidstudio", name: "Android Studio", icon: "SiAndroidstudio", category: "hard" },
  { id: "xcode", name: "Xcode", icon: "SiXcode", category: "hard" },
  { id: "github", name: "GitHub", icon: "FaGithub", category: "hard" },
  { id: "gitlab", name: "GitLab", icon: "FaGitlab", category: "hard" },
  { id: "bitbucket", name: "Bitbucket", icon: "FaBitbucket", category: "hard" },
  { id: "npm", name: "npm", icon: "FaNpm", category: "hard" },
  { id: "docker", name: "Docker", icon: "FaDocker", category: "hard" },
  { id: "html", name: "HTML", icon: "", category: "hard" },
  { id: "css", name: "CSS", icon: "", category: "hard" },
  { id: "reactjs", name: "React JS", icon: "", category: "hard" },
  { id: "nextjs", name: "Next JS", icon: "", category: "hard" },
  { id: "chakraui", name: "Chakra UI", icon: "", category: "hard" },
  { id: "emotion", name: "Emotion", icon: "", category: "hard" },
  { id: "framer", name: "Framer", icon: "", category: "hard" },
  
  // Lenguajes de Programación
  { id: "cplusplus", name: "C++", icon: "SiCplusplus", category: "hard" },
  { id: "javascript", name: "JavaScript", icon: "FaJs", category: "hard" },
  { id: "typescript", name: "TypeScript", icon: "", category: "hard" },
  { id: "python", name: "Python", icon: "FaPython", category: "hard" },
  { id: "java", name: "Java", icon: "FaJava", category: "hard" },
  { id: "csharp", name: "C#", icon: "TbBrandCSharp", category: "hard" },
  
  // Juegos
  { id: "unity", name: "Unity", icon: "SiUnity", category: "hard" },
  { id: "unreal", name: "Unreal Engine", icon: "SiUnrealengine", category: "hard" },
  { id: "godot", name: "Godot", icon: "SiGodotengine", category: "hard" },
  { id: "construct3", name: "Construct 3", icon: "SiConstruct3", category: "hard" },
  
  // Soft Skills
  { id: "wireframing", name: "Wireframing", icon: "", category: "soft" },
  { id: "prototyping", name: "Prototyping", icon: "", category: "soft" },
  { id: "testing", name: "Testing", icon: "", category: "soft" },
  { id: "webdesign", name: "Web Design", icon: "", category: "soft" },
  { id: "mobiledesign", name: "Mobile Design", icon: "", category: "soft" },
  { id: "uxdesign", name: "User Experience", icon: "", category: "soft" },
  { id: "communication", name: "Communication", icon: "", category: "soft" },
  { id: "teamwork", name: "Teamwork", icon: "", category: "soft" },
  { id: "leadership", name: "Leadership", icon: "", category: "soft" },
  { id: "problemsolving", name: "Problem-solving", icon: "", category: "soft" },
  { id: "creativity", name: "Creativity", icon: "", category: "soft" },
  { id: "timemanagement", name: "Time Management", icon: "", category: "soft" },
  
  // Herramientas de productividad (se pueden considerar hard o soft según el uso)
  { id: "notion", name: "Notion", icon: "SiNotion", category: "hard" },
  { id: "slack", name: "Slack", icon: "FaSlack", category: "hard" },
  { id: "trello", name: "Trello", icon: "FaTrello", category: "hard" },
  { id: "asana", name: "Asana", icon: "SiAsana", category: "hard" },
  { id: "jira", name: "Jira", icon: "SiJira", category: "hard" },
  { id: "word", name: "Microsoft Word", icon: "RiFileWord2Line", category: "hard" },
  { id: "excel", name: "Microsoft Excel", icon: "RiFileExcel2Line", category: "hard" },
];

// Categorías simplificadas
const categories = [
  { id: "all", name: "Todas" },
  { id: "hard", name: "Hard Skills (Técnicas)" },
  { id: "soft", name: "Soft Skills" },
];

const ToolsForm = () => {
  const [name, setName] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [customIcon, setCustomIcon] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [proficiency, setProficiency] = useState("intermediate"); // basic, intermediate, advanced, expert
  const [isLoading, setIsLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState("hard"); // Por defecto, nueva herramienta es "hard"

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si no hay herramienta seleccionada ni nombre personalizado
    if (!selectedTool && !name) {
      return alert("Selecciona una herramienta o ingresa un nombre");
    }
    
    setIsLoading(true);
    
    try {
      // Preparar datos para guardar
      const toolData = {
        nombre: selectedTool ? selectedTool.name : name,
        icono: selectedTool ? selectedTool.icon : customIcon,
        categoria: selectedTool ? selectedTool.category : customCategory,
        nivel: proficiency,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "herramientas"), toolData);
      
      // Resetear el formulario
      setName("");
      setSelectedTool(null);
      setCustomIcon("");
      setProficiency("intermediate");
      setCustomCategory("hard");
      
      alert("Herramienta guardada correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar la herramienta");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar herramientas por categoría y búsqueda
  const filteredTools = availableTools.filter(tool => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
      <h2 className="text-lg font-semibold">Agregar Herramienta</h2>
      
      {/* Filtro por categoría */}
      <div className="mb-2">
        <h3 className="text-sm font-medium mb-2">Filtrar por categoría:</h3>
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
          placeholder="Buscar herramienta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      
      {/* Lista de herramientas disponibles */}
      <div className="border p-3 rounded bg-gray-50 max-h-60 overflow-y-auto">
        <h3 className="text-sm font-medium mb-2">Herramientas disponibles:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredTools.map(tool => (
            <button
              key={tool.id}
              type="button"
              onClick={() => {
                setSelectedTool(tool);
                setName("");
              }}
              className={`text-xs p-2 rounded flex items-center gap-1 transition-colors text-left ${
                selectedTool?.id === tool.id
                  ? 'bg-blue-100 border border-blue-500'
                  : 'bg-white border hover:bg-gray-100'
              }`}
            >
              <div className="w-4 h-4 flex-shrink-0"></div> {/* Espacio para el icono */}
              <span className="truncate">{tool.name}</span>
            </button>
          ))}
        </div>
        
        {filteredTools.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            No se encontraron herramientas. Puedes agregar una personalizada.
          </p>
        )}
      </div>
      
      {/* O herramienta personalizada */}
      <div className="border-t pt-3">
        <h3 className="text-sm font-medium mb-2">O agrega una herramienta personalizada:</h3>
        <input
          type="text"
          placeholder="Nombre de la herramienta"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSelectedTool(null);
          }}
          className="border p-2 rounded w-full"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <input
              type="text"
              placeholder="Nombre del icono (opcional)"
              value={customIcon}
              onChange={(e) => setCustomIcon(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si conoces el nombre del icono en <a href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer" className="text-blue-500">react-icons</a>, puedes ingresarlo aquí (ej: FaReact, SiAdobephotoshop)
            </p>
          </div>
          
          <div>
            <select
              className="border p-2 rounded w-full"
              value={selectedTool ? selectedTool.category : customCategory}
              onChange={(e) => {
                if (selectedTool) {
                  setSelectedTool({...selectedTool, category: e.target.value});
                } else {
                  setCustomCategory(e.target.value);
                }
              }}
            >
              <option value="hard">Hard Skill (Técnica)</option>
              <option value="soft">Soft Skill</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecciona si es una habilidad técnica (hard) o interpersonal (soft)
            </p>
          </div>
        </div>
      </div>
      
      {/* Nivel de conocimiento */}
      <div>
        <h3 className="text-sm font-medium mb-2">Nivel de dominio:</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: "basic", name: "Básico" },
            { id: "intermediate", name: "Intermedio" },
            { id: "advanced", name: "Avanzado" },
            { id: "expert", name: "Experto" }
          ].map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => setProficiency(level.id)}
              className={`text-xs px-2 py-1 border rounded transition-colors ${
                proficiency === level.id
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Vista previa */}
      {(selectedTool || name) && (
        <div className="bg-white border rounded-lg p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            {selectedTool ? (
              <div className="text-blue-500">{/* Aquí iría el icono */}</div>
            ) : (
              <div className="text-gray-400">{customIcon ? "Icon" : "?"}</div>
            )}
          </div>
          <div>
            <h3 className="font-medium">{selectedTool ? selectedTool.name : name}</h3>
            <p className="text-xs text-gray-500">
              {selectedTool ? 
                (selectedTool.category === "hard" ? "Hard Skill" : "Soft Skill") : 
                (customCategory === "hard" ? "Hard Skill" : "Soft Skill")
              } • {
                proficiency === "basic" ? "Básico" :
                proficiency === "intermediate" ? "Intermedio" :
                proficiency === "advanced" ? "Avanzado" : "Experto"
              }
            </p>
          </div>
        </div>
      )}
      
      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading || (!selectedTool && !name)}
      >
        {isLoading ? "Guardando..." : "Guardar Herramienta"}
      </button>
    </form>
  );
};

export default ToolsForm;
