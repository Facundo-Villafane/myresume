import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ProfileForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    title: "",
    quote: "",
    quoteAuthor: "",
    email: "",
    website: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    instagram: "",
    x: "",
    itchio: "",
  });
  
  const [imageUrl, setImageUrl] = useState("");

  // Cargar datos del perfil al iniciar
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRef = doc(db, "perfil", "datos");
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setProfileData(profileSnap.data());
          if (profileSnap.data().imageUrl) {
            setImageUrl(profileSnap.data().imageUrl);
          }
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambio de URL de imagen
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  // Guardar datos del perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Incluir la URL de la imagen en los datos a guardar
      let updatedData = { 
        ...profileData,
        imageUrl: imageUrl 
      };
      
      // Guardar datos en Firestore
      await setDoc(doc(db, "perfil", "datos"), updatedData);
      
      alert("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      alert("Error al guardar: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-4">Cargando datos del perfil...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 border rounded">
      <h2 className="text-lg font-semibold">Editar Perfil</h2>
      
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre completo</label>
          <input
            type="text"
            name="fullName"
            value={profileData.fullName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Título profesional</label>
          <input
            type="text"
            name="title"
            value={profileData.title}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
      </div>
      
      {/* Imagen de perfil */}
      <div>
        <label className="block text-sm font-medium mb-1">Imagen de perfil</label>
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=Foto";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <input
              type="url"
              placeholder="URL de la imagen (https://...)"
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="border p-2 rounded w-full text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingresa la URL de una imagen cuadrada. Puedes usar servicios gratuitos como:
            </p>
            <ul className="text-xs text-gray-500 mt-1 list-disc list-inside">
              <li><a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500">ImgBB</a></li>
              <li><a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500">PostImages</a></li>
              <li><a href="https://imgur.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500">Imgur</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Cita */}
      <div>
        <label className="block text-sm font-medium mb-1">Cita o frase</label>
        <input
          type="text"
          name="quote"
          value={profileData.quote}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Ej: 'Las grandes cosas nunca vienen de la zona de confort'"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Autor de la cita</label>
        <input
          type="text"
          name="quoteAuthor"
          value={profileData.quoteAuthor}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Ej: 'Anónimo'"
        />
      </div>
      
      {/* Información de contacto */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Información de contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sitio web</label>
            <input
              type="url"
              name="website"
              value={profileData.website}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="https://tudominio.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="(+xx) xxx xxx xxx"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ubicación</label>
            <input
              type="text"
              name="location"
              value={profileData.location}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Ciudad, País"
            />
          </div>
        </div>
      </div>
      
      {/* Redes sociales */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Redes sociales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="url"
              name="github"
              value={profileData.github}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="https://github.com/tu-usuario"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={profileData.linkedin}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="https://linkedin.com/in/tu-usuario"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input
              type="url"
              name="instagram"
              value={profileData.instagram}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="https://instagram.com/tu-usuario"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">X</label>
            <input
              type="url"
              name="x"
              value={profileData.x}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="https://twitter.com/tu-usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Itch.io</label>
            <input
              type="url"
              name="itchio"
              value={profileData.itchio}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="https://itch.io/tu-usuario"
            />
          </div>
        </div>
      </div>
      
      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        disabled={saving}
      >
        {saving ? "Guardando..." : "Guardar perfil"}
      </button>
    </form>
  );
};

export default ProfileForm;
