import React from "react";
import DataManager from "./DataManager";

// Gestor de Idiomas
const LanguagesManager = () => {
  // Niveles de idioma
  const languageLevels = {
    A1: "Principiante",
    A2: "Básico",
    B1: "Intermedio",
    B2: "Intermedio Alto",
    C1: "Avanzado",
    C2: "Experto",
  };

  // Definir los campos a mostrar en la tabla
  const displayFields = [
    { 
      key: "nombre", 
      label: "Idioma" 
    },
    { 
      key: "pais", 
      label: "País" 
    },
    { 
      key: "level", 
      label: "Nivel",
      render: (value) => {
        return `${value} - ${languageLevels[value] || ""}`;
      }
    },
    { 
      key: "bandera", 
      label: "Bandera", 
      render: (value) => {
        return value ? (
          <div className="flex items-center gap-2">
            <img 
              src={value} 
              alt="Bandera" 
              className="w-8 h-5 object-cover border" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/32x20?text=?";
              }}
            />
            <span className="text-xs text-gray-500 truncate max-w-xs">{value}</span>
          </div>
        ) : "—";
      }
    }
  ];
  
  // Componente personalizado para editar idiomas
  const LanguageEditForm = ({ data, onChange, onSave, onCancel }) => {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Editar idioma</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Idioma:</label>
            <input
              type="text"
              name="nombre"
              value={data.nombre || ''}
              onChange={onChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">País:</label>
            <input
              type="text"
              name="pais"
              value={data.pais || ''}
              onChange={onChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Nivel:</label>
          <select
            name="level"
            value={data.level || 'B1'}
            onChange={onChange}
            className="border p-2 rounded w-full"
          >
            {Object.entries(languageLevels).map(([code, description]) => (
              <option key={code} value={code}>
                {code} - {description}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">URL de la bandera:</label>
          <input
            type="url"
            name="bandera"
            value={data.bandera || ''}
            onChange={onChange}
            className="border p-2 rounded w-full"
            placeholder="https://ejemplo.com/bandera.png"
          />
          
          {data.bandera && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
              <img 
                src={data.bandera} 
                alt="Vista previa de bandera" 
                className="h-8 border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/120x60?text=Error+de+imagen";
                }}
              />
            </div>
          )}
        </div>
        
        <div className="mt-4 bg-gray-50 p-3 rounded border">
          <h4 className="text-sm font-medium mb-2">Vista previa:</h4>
          <div className="flex items-center gap-3">
            <div className="h-5 w-8 bg-gray-200 border overflow-hidden">
              {data.bandera ? (
                <img 
                  src={data.bandera} 
                  alt="Bandera" 
                  className="h-full w-full object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/32x20?text=?";
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">?</div>
              )}
            </div>
            <div>
              <p className="font-medium">{data.nombre || "Nombre del idioma"}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  {data.level || "B1"}
                </span>
                <span className="text-xs text-gray-500">
                  {languageLevels[data.level || "B1"]}
                </span>
                {data.pais && (
                  <span className="text-xs text-gray-400">
                    {data.pais}
                  </span>
                )}
              </div>
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
      <h2 className="text-xl font-bold mb-4">Gestionar Idiomas</h2>
      <p className="text-gray-600 mb-6">
        Aquí puedes editar o eliminar los idiomas que has añadido a tu perfil.
      </p>
      
      <DataManager
        collectionName="lenguajes"
        displayFields={displayFields}
        title="Idiomas"
        sortField="createdAt"
        customEditForm={<LanguageEditForm />}
      />
    </div>
  );
};

export default LanguagesManager;