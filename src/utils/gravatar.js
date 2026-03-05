// src/utils/gravatar.js
import md5 from 'md5';

/**
 * Genera una URL de Gravatar basada en el email
 * @param {string} email - Email del usuario
 * @param {number} size - Tamaño de la imagen en píxeles
 * @returns {string} URL de la imagen de Gravatar
 */
export const getGravatarUrl = (email, size = 100) => {
  if (!email) return '';
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};

/**
 * Función simplificada para redirigir al usuario a Gravatar.com
 * @param {string} email - Email del usuario
 */
export const openGravatarEditor = (email) => {
  if (!email) {
    console.error('Se necesita un email para abrir el editor de Gravatar');
    return;
  }
  
  const hash = md5(email.trim().toLowerCase());
  
  // Intentar abrir la página de Gravatar
  try {
    // Primero intentamos abrir la página de perfil específica
    const profileUrl = `https://gravatar.com/${hash}`;
    window.open(profileUrl, '_blank');
    
    // Mostramos instrucciones al usuario
    alert(
      'Instrucciones para actualizar tu avatar:\n\n' +
      '1. Inicia sesión en Gravatar con tu cuenta asociada al email ' + email + '\n' +
      '2. Ve a "Mis Gravatars" o "Administrar gravatars"\n' +
      '3. Selecciona o sube una nueva imagen\n' +
      '4. Guarda los cambios\n' +
      '5. Regresa a esta página y recarga para ver los cambios'
    );
  } catch (error) {
    console.error('Error al abrir Gravatar:', error);
    // Fallback a la página principal de Gravatar
    window.open('https://gravatar.com/', '_blank');
  }
};

/**
 * Verifica si un correo electrónico tiene un avatar personalizado en Gravatar
 * @param {string} email - Email a verificar
 * @returns {Promise<boolean>} - Promesa que resuelve a true si tiene un avatar personalizado
 */
export const hasCustomGravatar = async (email) => {
  if (!email) return false;
  
  try {
    const hash = md5(email.trim().toLowerCase());
    const response = await fetch(`https://www.gravatar.com/avatar/${hash}?d=404`);
    return response.status !== 404;
  } catch (error) {
    console.error('Error al verificar Gravatar:', error);
    return false;
  }
};

/**
 * Regenera la URL de Gravatar con un timestamp para evitar caché
 * @param {string} email - Email del usuario
 * @param {number} size - Tamaño de la imagen
 * @returns {string} URL actualizada
 */
export const refreshGravatarUrl = (email, size = 100) => {
  const timestamp = new Date().getTime();
  return `${getGravatarUrl(email, size)}&t=${timestamp}`;
};