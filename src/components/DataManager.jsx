import { useState, useEffect } from "react";
import { 
  collection, query, orderBy, doc, deleteDoc, updateDoc,
  getDocs, where
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

// Este componente genérico maneja la edición y eliminación de cualquier colección
const DataManager = ({ 
  collectionName,  // Nombre de la colección en Firestore
  displayFields,   // Campos a mostrar en la tabla
  title,           // Título del gestor
  sortField = "createdAt", // Campo para ordenar
  customEditForm = null,   // Componente personalizado para la edición
  editCallback = null,     // Función de callback tras editar
  deleteCallback = null,   // Función de callback tras eliminar
  manageCallback = null    // Función de callback que permite personalizar el comportamiento
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  
  // Cargar datos de Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, collectionName), orderBy(sortField, "desc"));
        const querySnapshot = await getDocs(q);
        
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setData(items);
        setFilteredData(items);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [collectionName, sortField]);
  
  // Filtrar datos según término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    
    const filtered = data.filter(item => {
      // Buscar en cada campo mostrado
      return displayFields.some(field => {
        const value = item[field.key];
        // Manejar diferentes tipos de valores
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTermLower);
        } else if (typeof value === 'number') {
          return value.toString().includes(searchTermLower);
        } else if (value && typeof value === 'object' && value.toDate) {
          // Manejo de fechas de Firestore
          try {
            const dateStr = value.toDate().toLocaleDateString();
            return dateStr.includes(searchTermLower);
          } catch {
            return false;
          }
        }
        return false;
      });
    });
    
    setFilteredData(filtered);
  }, [searchTerm, data, displayFields]);
  
  // Iniciar edición de un item
  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({...item});
  };
  
  // Manejar cambios en el formulario de edición
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Guardar cambios de la edición
  const handleSaveEdit = async () => {
    try {
      const itemRef = doc(db, collectionName, editingItem.id);
      
      // Remover el id del objeto antes de guardar
      const { id, ...updateData } = editFormData;
      
      await updateDoc(itemRef, updateData);
      
      // Actualizar localmente
      setData(prevData => 
        prevData.map(item => 
          item.id === editingItem.id ? { ...item, ...updateData } : item
        )
      );
      
      // Llamar al callback si existe
      if (editCallback) {
        editCallback(editFormData);
      }
      
      // Reset estado
      setEditingItem(null);
      setEditFormData({});
      
      alert("Item actualizado correctamente");
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert(`Error al actualizar: ${err.message}`);
    }
  };
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
  };
  
  // Confirmar eliminación
  const handleConfirmDelete = (item) => {
    setShowConfirmDelete(item);
  };
  
  // Eliminar item
  const handleDelete = async () => {
    if (!showConfirmDelete) return;
    
    try {
      await deleteDoc(doc(db, collectionName, showConfirmDelete.id));
      
      // Actualizar localmente
      setData(prevData => prevData.filter(item => item.id !== showConfirmDelete.id));
      setFilteredData(prevData => prevData.filter(item => item.id !== showConfirmDelete.id));
      
      // Llamar al callback si existe
      if (deleteCallback) {
        deleteCallback(showConfirmDelete);
      }
      
      setShowConfirmDelete(null);
      alert("Item eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert(`Error al eliminar: ${err.message}`);
    }
  };
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowConfirmDelete(null);
  };
  
  // Renderizar el campo según su tipo
  const renderField = (item, field) => {
    const value = item[field.key];
    
    // Si hay una función de renderizado personalizada, usarla
    if (field.render) {
      return field.render(value, item);
    }
    
    // Manejar diferentes tipos de valores
    if (value === null || value === undefined) {
      return <span className="text-gray-400">—</span>;
    } else if (typeof value === 'boolean') {
      return value ? <span className="text-green-500">Sí</span> : <span className="text-red-500">No</span>;
    } else if (typeof value === 'object') {
      if (value.toDate) {
        // Es una fecha de Firestore
        try {
          return value.toDate().toLocaleDateString();
        } catch {
          return <span className="text-gray-400">Fecha inválida</span>;
        }
      } else if (Array.isArray(value)) {
        // Es un array
        return value.join(", ");
      } else {
        // Es otro tipo de objeto
        return JSON.stringify(value);
      }
    }
    
    // Para strings y números
    return String(value);
  };
  
  // Renderizar el formulario de edición predeterminado
  const renderDefaultEditForm = () => (
    <div className="bg-white p-4 border rounded shadow-md">
      <h3 className="font-medium text-lg mb-4">Editar item</h3>
      
      <div className="space-y-4">
        {displayFields.map(field => (
          <div key={field.key} className="form-group">
            <label className="block text-sm font-medium mb-1">{field.label}:</label>
            
            {/* Campo de texto estándar para la mayoría de tipos */}
            <input
              type={field.type || 'text'}
              name={field.key}
              value={editFormData[field.key] || ''}
              onChange={handleFormChange}
              className="border p-2 rounded w-full"
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <button
          type="button"
          onClick={handleCancelEdit}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSaveEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </div>
  );
  
  if (loading) return <p className="p-4">Cargando datos...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  
  return (
    <div className="border rounded shadow-sm">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title || `Gestionar ${collectionName}`}</h2>
          
          {/* Buscador */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-full px-3 py-1 text-sm w-64 pl-8"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación para eliminar */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de edición */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            {customEditForm ? (
              // Usar componente de edición personalizado si está definido
              React.cloneElement(customEditForm, {
                data: editFormData,
                onChange: handleFormChange,
                onSave: handleSaveEdit,
                onCancel: handleCancelEdit
              })
            ) : (
              // Usar formulario predeterminado
              renderDefaultEditForm()
            )}
          </div>
        </div>
      )}
      
      {/* Tabla de datos */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              {displayFields.map(field => (
                <th 
                  key={field.key} 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {field.label}
                </th>
              ))}
              <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td 
                  colSpan={displayFields.length + 1} 
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No se encontraron datos
                </td>
              </tr>
            ) : (
              filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {displayFields.map(field => (
                    <td key={`${item.id}-${field.key}`} className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 truncate max-w-xs">
                        {renderField(item, field)}
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    {/*<button
                     onClick={() => handleEdit(item)}
                     className="text-blue-600 hover:text-blue-900 mr-3"
                     title="Editar"
                    >
                    <FaEdit />
                    </button>*/}
                    <button
                      onClick={() => handleConfirmDelete(item)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación (simplificada) */}
      <div className="px-4 py-3 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredData.length}</span> de{" "}
            <span className="font-medium">{data.length}</span> resultados
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManager;