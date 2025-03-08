import React, { useState } from "react";
import DataManager from "./DataManager";

// Gestor de Experiencia
const ExperienceManager = () => {
  // Función para formatear fechas
  const formatDate = (dateObj) => {
    if (!dateObj) return "—";
    
    try {
      // Si es un objeto de Firestore con método toDate()
      if (dateObj && typeof dateObj.toDate === 'function') {
        const date = dateObj.toDate();
        return date.toLocaleDateString();
      }
      
      // Si ya es un objeto Date
      if (dateObj instanceof Date) {
        return dateObj.toLocaleDateString();
      }
      
      // Si es un timestamp o un string, convertirlo a Date
      if (typeof dateObj === 'number' || typeof dateObj === 'string') {
        const date = new Date(dateObj);
        return date.toLocaleDateString();
      }
      
      return "Fecha inválida";
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha inválida";
    }
  };
  
  // Definir los campos a mostrar en la tabla
  const displayFields = [
    { 
      key: "empresa", 
      label: "Empresa",
      render: (value) => {
        return typeof value === 'object' && value !== null 
          ? value.name || "—" 
          : value || "—";
      }
    },
    { 
      key: "cargo", 
      label: "Cargo" 
    },
    { 
      key: "fechaInicio", 
      label: "Inicio",
      render: (value) => formatDate(value)
    },
    { 
      key: "fechaFin", 
      label: "Fin",
      render: (value, item) => value ? formatDate(value) : "Presente"
    },
    { 
      key: "ubicacion", 
      label: "Ubicación" 
    }
  ];
  
  // Componente personalizado para editar experiencia
  const ExperienceEditForm = ({ data, onChange, onSave, onCancel }) => {
    const [currentPosition, setCurrentPosition] = useState(!data.fechaFin);
    
    // Función para manejar cambios en fechas
    const handleDateChange = (name, value) => {
      onChange({
        target: {
          name,
          value: value ? new Date(value) : null
        }
      });
    };
    
    // Función para manejar el checkbox de posición actual
    const handleCurrentPositionChange = (e) => {
      setCurrentPosition(e.target.checked);
      if (e.target.checked) {
        // Si está marcado, establecer fechaFin como null (posición actual)
        handleDateChange('fechaFin', null);
      }
    };
    
    // Convertir fecha de Firestore a string para input date
    const formatDateForInput = (dateObj) => {
      if (!dateObj) return "";
      
      try {
        // Si es un objeto de Firestore con método toDate()
        if (dateObj && typeof dateObj.toDate === 'function') {
          dateObj = dateObj.toDate();
        }
        
        // Si ya es un objeto Date
        if (dateObj instanceof Date) {
          return dateObj.toISOString().split('T')[0];
        }
        
        // Si es un timestamp o un string, convertirlo a Date
        if (typeof dateObj === 'number' || typeof dateObj === 'string') {
          const date = new Date(dateObj);
          return date.toISOString().split('T')[0];
        }
        
        return "";
      } catch (error) {
        console.error("Error formateando fecha para input:", error);
        return "";
      }
    };
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Editar experiencia</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Empresa:</label>
            <input
              type="text"
              name="empresa"
              value={typeof data.empresa === 'object' && data.empresa !== null 
                ? data.empresa.name || "" 
                : data.empresa || ""}
              onChange={(e) => 
                onChange({
                  target: {
                    name: 'empresa',
                    value: e.target.value
                  }
                })
              }
              className="border p-2 rounded w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cargo:</label>
            <input
              type="text"
              name="cargo"
              value={data.cargo || ''}
              onChange={onChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de inicio:</label>
            <input
              type="date"
              name="fechaInicio"
              value={formatDateForInput(data.fechaInicio)}
              onChange={(e) => handleDateChange('fechaInicio', e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de fin:</label>
            <input
              type="date"
              name="fechaFin"
              value={formatDateForInput(data.fechaFin)}
              onChange={(e) => handleDateChange('fechaFin', e.target.value)}
              className="border p-2 rounded w-full"
              disabled={currentPosition}
            />
            
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="currentPosition"
                checked={currentPosition}
                onChange={handleCurrentPositionChange}
                className="mr-2"
              />
              <label htmlFor="currentPosition" className="text-sm">
                Posición actual
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={data.ubicacion || ''}
            onChange={onChange}
            className="border p-2 rounded w-full"
            placeholder="Ej: Madrid, España"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Descripción:</label>
          <textarea
            name="descripcion"
            value={data.descripcion || ''}
            onChange={onChange}
            className="border p-2 rounded w-full min-h-[100px]"
            placeholder="Describe tus responsabilidades y logros"
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
      <h2 className="text-xl font-bold mb-4">Gestionar Experiencia</h2>
      <p className="text-gray-600 mb-6">
        Aquí puedes editar o eliminar las experiencias laborales que has añadido a tu perfil.
      </p>
      
      <DataManager
        collectionName="experiencia"
        displayFields={displayFields}
        title="Experiencia Laboral"
        sortField="fechaInicio"
        customEditForm={<ExperienceEditForm />}
      />
    </div>
  );
};

export default ExperienceManager;