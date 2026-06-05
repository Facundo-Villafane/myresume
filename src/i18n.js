export const translations = {
  es: {
    languageLabel: "Idioma",
    portfolio: "Portfolio personal",
    nav: {
      projects: "Proyectos",
      experience: "Experiencia",
      skills: "Skills",
      contact: "Contacto",
    },
    hero: {
      greeting: "Hola, soy",
      action: "y hago experiencias gamificadas.",
      description: "Especialista en videojuegos, webs y apps que motivan y enseñan. Transformo ideas en productos digitales vivos.",
    },
    sections: {
      projects: "Proyectos",
      about: "Sobre mí",
      experience: "Experiencia",
      skills: "Habilidades",
      languages: "Idiomas",
      education: "Educación",
    },
    status: {
      loading: "Cargando...",
      loadingData: "Cargando datos...",
      loadingSkills: "Cargando habilidades...",
      loadingProfile: "Cargando perfil...",
      present: "PRESENTE",
      error: "Error",
    },
    projects: {
      open: "Abrir",
      untitled: "Proyecto sin título",
      placeholderTitle: "Espacio para",
      placeholderText: "Placeholder listo para cuando agregues contenido real de esta categoría.",
      requestFallback: (title) => `¿Podés resolver algo como "${title}"?`,
    },
  },
  en: {
    languageLabel: "Language",
    portfolio: "Personal portfolio",
    nav: {
      projects: "Projects",
      experience: "Experience",
      skills: "Skills",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      action: "and I build gamified experiences.",
      description: "I specialize in games, websites, and apps that motivate and teach. I turn ideas into living digital products.",
    },
    sections: {
      projects: "Projects",
      about: "About me",
      experience: "Experience",
      skills: "Skills",
      languages: "Languages",
      education: "Education",
    },
    status: {
      loading: "Loading...",
      loadingData: "Loading data...",
      loadingSkills: "Loading skills...",
      loadingProfile: "Loading profile...",
      present: "PRESENT",
      error: "Error",
    },
    projects: {
      open: "Open",
      untitled: "Untitled project",
      placeholderTitle: "Space for",
      placeholderText: "Placeholder ready for real content in this category.",
      requestFallback: (title) => `Can you build something like "${title}"?`,
    },
  },
};

export const pickLocalized = (data, field, language) => {
  if (!data) return "";
  const localizedValue = data[`${field}_${language}`] || data[`${field}${language === "en" ? "En" : "Es"}`];
  return localizedValue || data[field] || "";
};
