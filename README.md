# Portafolio Personal - Panel de Administración

Este proyecto es un panel de administración para gestionar un portafolio personal, construido con React y Firebase. Permite a un administrador único actualizar la información de su perfil, proyectos y otros datos que se muestran en el portafolio público.

## 🚀 Características

- **Autenticación segura**: Sistema de login con Google que verifica el UID del administrador
- **Gestión de perfil**: Actualización de información personal, redes sociales e imagen de perfil
- **Interfaz intuitiva**: Panel de administración con diseño responsive usando Tailwind CSS
- **Protección de rutas**: Solo el administrador autorizado puede acceder al panel
- **Experiencia de usuario mejorada**: Incluye página 404 personalizada para rutas no encontradas
- **Desarrollo optimizado**: Construido con Vite para un rendimiento rápido y una experiencia de desarrollo eficiente

## 📋 Requisitos previos

- Node.js (versión 14.x o superior)
- npm o yarn
- Vite (incluido como dependencia, no es necesario instalarlo globalmente)
- Cuenta de Firebase
- Proyecto de Firebase configurado con Authentication y Firestore

## 🔧 Instalación y configuración

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Facundo-Villafane/myresume.git)
   cd myresume
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

   > **Nota**: Este proyecto utiliza Vite como herramienta de construcción y servidor de desarrollo.

3. **Configurar Firebase**
   - Crea un archivo `src/firebaseConfig.js` con tu configuración de Firebase:
   ```javascript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "TU_MESSAGING_SENDER_ID",
     appId: "TU_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

4. **Configurar el UID del administrador**
   - Crea un archivo `src/config/adminConfig.js` basado en el ejemplo:
   ```javascript
   const adminConfig = {
     ADMIN_UID: 'tu-uid-de-administrador-aqui'
   };

   export default adminConfig;
   ```

5. **Configurar reglas de Firestore**
   En la consola de Firebase, establece las siguientes reglas:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{collection}/{doc} {
         allow read;
         allow write: if request.auth != null && request.auth.uid == 'TU_UID_DE_ADMINISTRADOR';
       }
     }
   }
   ```

6. **Iniciar la aplicación en modo desarrollo**
   ```bash
   npm run dev
   ```

## 🗂️ Estructura del proyecto

```
src/
├── components/                   # Componentes reutilizables
│   ├── DataManager.jsx           # Componente para gestión de datos
│   ├── ExperienceList.jsx        # Lista de experiencias
│   ├── ExperienceForm.jsx        # Formulario para añadir/editar experiencia
│   ├── ExperienceManager.jsx     # Gestor principal de experiencias
│   ├── EducationList.jsx         # Lista de educación
│   ├── EducationForm.jsx         # Formulario para añadir/editar educación
│   ├── EducationManager.jsx      # Gestor principal de educación
│   ├── ToolsList.jsx             # Lista de herramientas
│   ├── ToolsForm.jsx             # Formulario para añadir/editar herramientas
│   ├── ToolsManager.jsx          # Gestor principal de herramientas
│   ├── LanguagesList.jsx         # Lista de idiomas
│   ├── LanguagesForm.jsx         # Formulario para añadir/editar idiomas
│   ├── LanguagesManager.jsx      # Gestor principal de idiomas
│   ├── ProjectList.jsx           # Lista de proyectos
│   ├── ProjectForm.jsx           # Formulario para añadir/editar proyectos
│   ├── ProjectManager.jsx        # Gestor principal de proyectos
│   ├── PrivateRoute.jsx          # Componente para proteger rutas privadas
│   ├── ProfileForm.jsx           # Formulario para editar el perfil
│   └── NotFound.jsx              # Componente para la página 404
├── config/                       # Archivos de configuración
│   └── adminConfig.js            # Configuración del UID del administrador
├── pages/                        # Páginas principales
│   ├── AdminPanel.jsx            # Panel de administración principal
│   ├── Home.jsx                  # Página de inicio pública
│   ├── Login.jsx                 # Página de inicio de sesión
│   └── NotFound.jsx              # Página 404
├── App.jsx                       # Componente principal y configuración de rutas
├── main.jsx                      # Punto de entrada de la aplicación
 firebaseConfig.js                # Configuración de Firebase
```

## 🔐 Seguridad

Este proyecto implementa varias capas de seguridad:
- Autenticación con Google a través de Firebase
- Verificación del UID del administrador en el cliente
- Reglas de seguridad en Firestore para proteger los datos
- Archivo de configuración separado para el UID del administrador (excluido de Git)

## 📝 Uso

1. Accede a la ruta `/login` para iniciar sesión con Google
2. Solo la cuenta con el UID configurado podrá acceder al panel de administración
3. Usa los formularios para actualizar la información de tu portafolio
4. Los cambios se reflejarán en tiempo real en el sitio público

## 🛠️ Tecnologías utilizadas

- [React](https://reactjs.org/) - Biblioteca JavaScript para interfaces de usuario
- [Vite](https://vitejs.dev/) - Herramienta de compilación y servidor de desarrollo
- [React Router](https://reactrouter.com/) - Enrutamiento para aplicaciones React
- [Firebase](https://firebase.google.com/) - Plataforma de desarrollo de aplicaciones
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [React Icons](https://react-icons.github.io/react-icons/) - Iconos populares para React

## 👨‍💻 Desarrollo

Para desarrolladores autorizados:

1. Solicita permiso al propietario para contribuir al proyecto
2. Una vez autorizado, clona el repositorio
3. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-caracteristica`)
4. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
5. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
6. Solicita una revisión de código del propietario

Nota: Todo el código desarrollado pasa a ser propiedad del dueño del proyecto.

## 📄 Licencia

Este proyecto está protegido por derechos de autor. Todos los derechos reservados.

Este software es propiedad intelectual y su uso, modificación, distribución o reproducción no está permitido sin autorización explícita del propietario.

Para licencias comerciales o permisos de uso, por favor contacta a [Facundo Villafañe](mailto:favillafane@gmail.com).

## 📝 Notas

- Este proyecto está diseñado para ser utilizado por un solo administrador.
- La configuración de seguridad debe revisarse antes de implementar en producción.
- Recuerda no compartir tus credenciales de Firebase ni tu UID de administrador.

---
⌨️ con ❤️ por [Facundo Villafañe](https://tu-sitio-web.com)
