import React from "react";
import DataManager from "./DataManager";
import { extractDominantColorFromImage } from "../utils/imageColor";

// Gestor de Proyectos
const ProjectManager = () => {
  const projectCategories = [
    { id: "juegos", name: "Juegos" },
    { id: "paginas-web", name: "Páginas web" },
    { id: "apps", name: "Apps" },
    { id: "herramientas", name: "Herramientas" },
    { id: "arte", name: "Arte" },
  ];

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

  const getCategoryName = (categoryId) => {
    const category = projectCategories.find(category => category.id === categoryId);
    return category ? category.name : "Sin categoría";
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
      key: "brief",
      label: "Pedido",
      render: (value) => value ? <div className="truncate max-w-xs">{value}</div> : "—"
    },
    {
      key: "solucion",
      label: "Solución",
      render: (value) => value ? <div className="truncate max-w-xs">{value}</div> : "—"
    },
    { 
      key: "tipo", 
      label: "Tipo",
      render: (value) => getTypeName(value)
    },
    {
      key: "categoria",
      label: "Categoría",
      render: (value) => (
        <span className="rounded-full bg-slate-950 px-2 py-1 text-xs font-black text-white">
          {getCategoryName(value)}
        </span>
      )
    },
    {
      key: "accentColor",
      label: "Color",
      render: (value) => value ? (
        <span className="inline-flex items-center gap-2 font-black">
          <span className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: value }} />
          {value}
        </span>
      ) : "—"
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
    const colorInputValue = /^#[0-9a-f]{6}$/i.test(data.accentColor || "") ? data.accentColor : "#00c979";

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

    const handlePickImageColor = async () => {
      try {
        const color = await extractDominantColorFromImage(data.imagenUrl);
        onChange({
          target: {
            name: "accentColor",
            value: color
          }
        });
      } catch (error) {
        alert(error.message);
      }
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

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <label className="block text-sm font-black mb-2">Color de énfasis de la card:</label>
          <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <input
              type="color"
              name="accentColor"
              value={colorInputValue}
              onChange={onChange}
              className="h-11 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
            />
            <input
              type="text"
              name="accentColor"
              value={data.accentColor || ""}
              onChange={onChange}
              className="border p-2 rounded w-full"
              placeholder="#00c979"
            />
            <button
              type="button"
              onClick={handlePickImageColor}
              className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-black text-white disabled:opacity-40"
              disabled={!data.imagenUrl}
            >
              Tomar de imagen
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Si la URL externa bloquea lectura de píxeles, usá el selector manual.
          </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pedido / problema:</label>
            <textarea
              name="brief"
              value={data.brief || ''}
              onChange={onChange}
              className="border p-2 rounded w-full min-h-[90px]"
              placeholder="Ej: Necesito mostrar mis juegos de forma más clara."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Respuesta / solución:</label>
            <textarea
              name="solucion"
              value={data.solucion || ''}
              onChange={onChange}
              className="border p-2 rounded w-full min-h-[90px]"
              placeholder="Ej: Armé una experiencia con categorías, previews y CTA."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría del portfolio:</label>
          <select
            name="categoria"
            value={data.categoria || 'herramientas'}
            onChange={onChange}
            className="border p-2 rounded w-full"
          >
            {projectCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Este campo define en qué bloque aparece el proyecto en el portfolio público.
          </p>
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
      <div className="mb-6">
        <p className="admin-eyebrow">Catálogo público</p>
        <h2 className="text-2xl font-black text-slate-950">Gestionar proyectos</h2>
        <p className="text-slate-500">
          Editá enlaces, imágenes, tecnologías y la categoría donde aparece cada proyecto.
        </p>
      </div>
      
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
