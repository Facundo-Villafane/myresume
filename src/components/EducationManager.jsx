import React, { useState } from "react";
import DataManager from "./DataManager";

// Gestor de Educación
const EducationManager = () => {
  // Definir los campos a mostrar en la tabla
  const displayFields = [
    { 
      key: "institucion", 
      label: "Institución" 
    },
    { 
      key: "titulo", 
      label: "Título" 
    },
    { 
      key: "año", 
      label: "Año",
      render: (value, item) => {
        return item.cursando ? "Cursando" : value;
      }
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
      key: "logo", 
      label: "Logo", 
      render: (value) => {
        return value ? (
          <div className="flex items-center">
            <img 
              src={value} 
              alt="Logo" 
              className="w-8 h-8 object-contain mr-2" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/32x32?text=?";
              }}
            />
          </div>
        ) : "—";
      }
    }
  ];
  
  // Componente personalizado para editar educación
  const EducationEditForm = ({ data, onChange, onSave, onCancel }) => {
    const [cursando, setCursando] = useState(data.cursando || false);
    
    // Manejar cambio en el checkbox de "cursando"
    const handleCursandoChange = (e) => {
      const isChecked = e.target.checked;
      setCursando(isChecked);
      
      // Actualizar el estado con el nuevo valor
      onChange({
        target: {
          name: 'cursando',
          value: isChecked
        }
      });
    };
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Editar educación</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Institución:</label>
            <input
              type="text"
              name="institucion"
              value={data.institucion || ''}
              onChange={onChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Año:</label>
            <input
              type="text"
              name="año"
              value={data.año || ''}
              onChange={onChange}
              className="border p-2 rounded w-full"
              disabled={cursando}
              placeholder={cursando ? "Automáticamente marcado como 'Cursando'" : "Ej: 2022"}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cursando"
              checked={cursando}
              onChange={handleCursandoChange}
              className="mr-2"
            />
            <label htmlFor="cursando" className="text-sm">
              Actualmente cursando
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Descripción (opcional):</label>
          <textarea
            name="descripcion"
            value={data.descripcion || ''}
            onChange={onChange}
            className="border p-2 rounded w-full min-h-[80px]"
            placeholder="Breve descripción del curso o certificado"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">URL del logo:</label>
          <input
            type="url"
            name="logo"
            value={data.logo || ''}
            onChange={onChange}
            className="border p-2 rounded w-full"
            placeholder="https://ejemplo.com/logo.png"
          />
          
          {data.logo && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
              <img 
                src={data.logo} 
                alt="Vista previa de logo" 
                className="h-8 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/120x80?text=Error+de+imagen";
                }}
              />
            </div>
          )}
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
      <h2 className="text-xl font-bold mb-4">Gestionar Educación</h2>
      <p className="text-gray-600 mb-6">
        Aquí puedes editar o eliminar los títulos académicos, cursos y certificados que has añadido a tu perfil.
      </p>
      
      <DataManager
        collectionName="educacion"
        displayFields={displayFields}
        title="Educación"
        sortField="createdAt"
        customEditForm={<EducationEditForm />}
      />
    </div>
  );
};

export default EducationManager;