import React from "react";
import DataManager from "./DataManager";

// Gestor de Herramientas
const ToolsManager = () => {
  // Categorías disponibles
  const categories = [
    { id: "design", name: "Diseño" },
    { id: "development", name: "Desarrollo" },
    { id: "language", name: "Lenguaje" },
    { id: "game", name: "Juegos" },
    { id: "productivity", name: "Productividad" },
    { id: "methodology", name: "Metodología" },
    { id: "skill", name: "Habilidad" },
    { id: "other", name: "Otro" }
  ];
  
  // Niveles de competencia
  const levels = [
    { id: "basic", name: "Básico" },
    { id: "intermediate", name: "Intermedio" },
    { id: "advanced", name: "Avanzado" },
    { id: "expert", name: "Experto" }
  ];

  // Función para obtener el nombre de la categoría
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Función para obtener el nombre del nivel
  const getLevelName = (levelId) => {
    const level = levels.find(lvl => lvl.id === levelId);
    return level ? level.name : levelId;
  };
  
  // Definir los campos a mostrar en la tabla
  const displayFields = [
    { 
      key: "nombre", 
      label: "Nombre" 
    },
    { 
      key: "categoria", 
      label: "Categoría", 
      render: (value) => getCategoryName(value)
    },
    { 
      key: "nivel", 
      label: "Nivel", 
      render: (value) => getLevelName(value)
    },
    { 
      key: "icono", 
      label: "Icono", 
      render: (value) => {
        return value ? (
          <div className="flex items-center">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{value}</code>
          </div>
        ) : "—";
      }
    }
  ];
  
  // Componente personalizado para editar herramientas
  const ToolEditForm = ({ data, onChange, onSave, onCancel }) => {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Editar herramienta</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={data.nombre || ''}
            onChange={onChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categoría:</label>
            <select
              name="categoria"
              value={data.categoria || 'other'}
              onChange={onChange}
              className="border p-2 rounded w-full"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nivel:</label>
            <select
              name="nivel"
              value={data.nivel || 'intermediate'}
              onChange={onChange}
              className="border p-2 rounded w-full"
            >
              {levels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Nombre del icono (opcional):</label>
          <input
            type="text"
            name="icono"
            value={data.icono || ''}
            onChange={onChange}
            className="border p-2 rounded w-full"
            placeholder="Ej: FaReact, SiAdobephotoshop"
          />
          <p className="text-xs text-gray-500 mt-1">
            Nombre del icono de react-icons (FaReact, SiTypescript, etc.)
          </p>
        </div>
        
        <div className="mt-4 bg-gray-50 p-3 rounded border">
          <h4 className="text-sm font-medium mb-2">Vista previa:</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {data.icono ? (
                <span className="text-blue-500">{data.icono.charAt(0) + data.icono.charAt(1)}</span>
              ) : (
                <span className="text-gray-400">?</span>
              )}
            </div>
            <div>
              <p className="font-medium">{data.nombre || "Nombre de la herramienta"}</p>
              <p className="text-xs text-gray-500">
                {getCategoryName(data.categoria || "other")} • {getLevelName(data.nivel || "intermediate")}
              </p>
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
      <h2 className="text-xl font-bold mb-4">Gestionar Herramientas</h2>
      <p className="text-gray-600 mb-6">
        Aquí puedes editar o eliminar las herramientas y habilidades técnicas que has añadido a tu perfil.
      </p>
      
      <DataManager
        collectionName="herramientas"
        displayFields={displayFields}
        title="Herramientas y Habilidades"
        sortField="createdAt"
        customEditForm={<ToolEditForm />}
      />
    </div>
  );
};

export default ToolsManager;