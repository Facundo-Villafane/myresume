import React from "react";
import DataManager from "./DataManager";

// Gestor de Proyectos
const ProjectManager = () => {
  // Lista de tipos de proyecto
  const projectTypes = [
    { id: "github", name: "GitHub" },
    { id: "itch.io", name: "Itch.io" },
    { id: "behance", name: "Behance" },
    { id: "figma", name: "Figma" },
    { id: "other", name: "Otro" }
  ];
  
  // Lista de tecnologías disponibles (ejemplo)
  const availableTechs = [
    { id: "react", name: "React" },
    { id: "vue", name: "Vue.js" },
    { id: "angular", name: "Angular" },
    { id: "js", name: "JavaScript" },
    { id: "ts", name: "TypeScript" },
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
    { id: "sass", name: "Sass" },
    { id: "tailwind", name: "Tailwind CSS" },
    { id: "bootstrap", name: "Bootstrap" },
    { id: "node", name: "Node.js" },
    { id: "python", name: "Python" },
    { id: "django", name: "Django" },
    { id: "flask", name: "Flask" },
    { id: "mongodb", name: "MongoDB" },
    { id: "mysql", name: "MySQL" },
    { id: "postgres", name: "PostgreSQL" },
    { id: "firebase", name: "Firebase" },
    { id: "figma", name: "Figma" },
    { id: "photoshop", name: "Photoshop" },
    { id: "illustrator", name: "Illustrator" },
  ];
  
  // Función para obtener el nombre del tipo de proyecto
  const getTypeName = (typeId) => {
    const type = projectTypes.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };
  
  // Función para obtener los nombres de las tecnologías a partir de sus IDs
  const getTechNames = (techIds) => {
    if (!techIds || !Array.isArray(techIds)) return "—";
    
    return techIds.map(id => {
      const tech = availableTechs.find(t => t.id === id);
      return tech ? tech.name : id;
    }).join(", ");
  };
  
  // Definir los campos a mostrar en la tabla
  const displayFields = [
    { 
      key: "titulo", 
      label: "Título" 
    },
    { 
      key: "descripcion", 
      label: "Descripción",
      render: (value) => {
        return value ? (
          <div className="truncate max-w-xs">
            {value}
          </div>
        ) : "—";
      }
    },
    { 
      key: "tipo", 
      label: "Tipo",
      render: (value) => getTypeName(value)
    },
    { 
      key: "enlace", 
      label: "Enlace",
      render: (value) => {
        return value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline truncate block max-w-xs"
          >
            {value.replace(/^https?:\/\//i, '')}
          </a>
        ) : "—";
      }
    },
    { 
      key: "tecnologias", 
      label: "Tecnologías",
      render: (value) => getTechNames(value)
    }
  ];
  
  // Componente personalizado para editar proyectos
  const ProjectEditForm = ({ data, onChange, onSave, onCancel }) => {
    // Manejar la selección de tecnologías
    const handleTechToggle = (techId) => {
      let updatedTechs;
      
      if (!data.tecnologias) {
        // Si no hay tecnologías, crear array con ésta
        updatedTechs = [techId];
      } else if (data.tecnologias.includes(techId)) {
        // Si ya está seleccionada, quitarla
        updatedTechs = data.tecnologias.filter(id => id !== techId);
      } else {
        // Si no está seleccionada, añadirla
        updatedTechs = [...data.tecnologias, techId];
      }
      
      // Simular un evento para el onChange
      onChange({
        target: {
          name: 'tecnologias',
          value: updatedTechs
        }
      });
    };
    
    return (
      <div className="space-y-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-medium text-lg">Editar proyecto</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Título:</label>
          <input
            type="text"
            name="titulo"
            value={data.titulo || ''}
            onChange={onChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Descripción:</label>
          <textarea
            name="descripcion"
            value={data.descripcion || ''}
            onChange={onChange}
            className="border p-2 rounded w-full min-h-[100px]"
            placeholder="Descripción del proyecto"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Enlace:</label>
            <input
              type="url"
              name="enlace"
              value={data.enlace || ''}
              onChange={onChange}
              className="border p-2 rounded w-full"
              placeholder="https://ejemplo.com/proyecto"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tipo:</label>
            <select
              name="tipo"
              value={data.tipo || 'other'}
              onChange={onChange}
              className="border p-2 rounded w-full"
            >
              {projectTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">URL de la imagen:</label>
          <input
            type="url"
            name="imagenUrl"
            value={data.imagenUrl || ''}
            onChange={onChange}
            className="border p-2 rounded w-full"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          
          {data.imagenUrl && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
              <img 
                src={data.imagenUrl} 
                alt="Vista previa de imagen" 
                className="h-32 object-cover rounded border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x200?text=Error+de+imagen";
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 mb-2">Tecnologías:</label>
          <div className="border rounded p-3 max-h-40 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {availableTechs.map(tech => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleTechToggle(tech.id)}
                  className={`text-xs px-2 py-1 rounded-full transition-colors ${
                    data.tecnologias && data.tecnologias.includes(tech.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestionar Proyectos</h2>
      <p className="text-gray-600 mb-6">
        Aquí puedes editar o eliminar los proyectos que has añadido a tu perfil.
      </p>
      
      <DataManager
        collectionName="proyectos"
        displayFields={displayFields}
        title="Proyectos"
        sortField="createdAt"
        customEditForm={<ProjectEditForm />}
      />
    </div>
  );
};

export default ProjectManager;