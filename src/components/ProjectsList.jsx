import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebaseConfig";
import React, { useEffect, useRef, useState } from "react";
import { FaGamepad, FaGlobe, FaHammer, FaMobileAlt, FaPalette, FaExternalLinkAlt } from "react-icons/fa";

const projectCategories = [
  {
    id: "juegos",
    label: "Juegos",
    hint: "Game jams, prototipos y experiencias interactivas.",
    color: "#00c979",
    icon: <FaGamepad aria-hidden="true" />,
    match: ["juego", "game", "itch", "unity", "godot", "unreal", "csharp", "c#"],
  },
  {
    id: "paginas-web",
    label: "Páginas web",
    hint: "Landing pages, portfolios, sitios y experiencias web.",
    color: "#1398ff",
    icon: <FaGlobe aria-hidden="true" />,
    match: ["web", "website", "landing", "portfolio", "react", "html", "css", "next"],
  },
  {
    id: "apps",
    label: "Apps",
    hint: "Productos, dashboards y aplicaciones con flujo propio.",
    color: "#f164d8",
    icon: <FaMobileAlt aria-hidden="true" />,
    match: ["app", "mobile", "dashboard", "saas", "tindev"],
  },
  {
    id: "herramientas",
    label: "Herramientas",
    hint: "Utilidades, sistemas internos y recursos técnicos.",
    color: "#ff9f1a",
    icon: <FaHammer aria-hidden="true" />,
    match: ["tool", "herramienta", "utility", "cli", "admin", "manager"],
  },
  {
    id: "arte",
    label: "Arte",
    hint: "Ilustración, visuales, pixel art y piezas gráficas.",
    color: "#ff5b57",
    icon: <FaPalette aria-hidden="true" />,
    match: ["arte", "art", "illustration", "ilustracion", "visual", "pixel", "photoshop"],
  },
];

const mockProjects = [
  {
    id: "project1",
    titulo: "THE LAST ROOM",
    descripcion: "Un estudiante queda atrapado en su propio juego. Solo una linterna y su ingenio lo separan del despertar... o no.",
    brief: "Necesito un juego corto con tensión y una idea clara.",
    solucion: "Armé una experiencia narrativa con linterna, encierro y misterio.",
    enlace: "https://itch.io",
    imagenUrl: "",
    categoria: "juegos",
    tecnologias: ["unity", "c#", "3d"],
  },
  {
    id: "project2",
    titulo: "ARCANE TRIALS",
    descripcion: "Tower Defense 2D con gestión de maná, oleadas y dificultad progresiva.",
    brief: "Quiero un tower defense con magia y decisiones rápidas.",
    solucion: "Diseñé oleadas, gestión de maná y progresión de dificultad.",
    enlace: "https://itch.io",
    imagenUrl: "",
    categoria: "juegos",
    tecnologias: ["unity", "2d", "pixel art"],
  },
  {
    id: "project3",
    titulo: "PORTFOLIO LAB",
    descripcion: "Sitio personal con foco editorial, contenido editable y secciones modulares.",
    brief: "Necesito que mi portfolio tenga personalidad y sea fácil de actualizar.",
    solucion: "Lo conecté a Firebase y lo separé en bloques editables.",
    enlace: "https://github.com",
    imagenUrl: "",
    categoria: "paginas-web",
    tecnologias: ["react", "firebase", "css"],
  },
  {
    id: "project4",
    titulo: "TINDEV",
    descripcion: "App tipo Tinder para armar equipos de desarrollo mediante swipes y matches.",
    brief: "Me cuesta encontrar gente compatible para proyectos.",
    solucion: "Creé una app con swipes y matches para formar equipos.",
    enlace: "https://github.com",
    imagenUrl: "",
    categoria: "apps",
    tecnologias: ["react", "app", "ui"],
  },
  {
    id: "project5",
    titulo: "ADMIN KIT",
    descripcion: "Herramienta para gestionar datos del portfolio desde paneles y formularios.",
    brief: "Quiero cambiar contenido sin tocar código.",
    solucion: "Preparé un panel admin para cargar proyectos, perfil y skills.",
    enlace: "https://github.com",
    imagenUrl: "",
    categoria: "herramientas",
    tecnologias: ["firebase", "admin", "tool"],
  },
  {
    id: "project6",
    titulo: "VISUAL SKETCHES",
    descripcion: "Espacio reservado para piezas visuales, ilustraciones, sprites o arte promocional.",
    brief: "Necesito un lugar para mostrar piezas visuales.",
    solucion: "Dejé una categoría de arte con placeholders listos para reemplazar.",
    enlace: "#",
    imagenUrl: "",
    categoria: "arte",
    tecnologias: ["arte", "placeholder", "visual"],
  },
];

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getProjectCategory = (project) => {
  const explicit = normalize(project.categoria || project.category || project.tipoProyecto || project.tipo);
  const explicitMatch = projectCategories.find((category) => {
    const categoryId = normalize(category.id);
    const label = normalize(category.label);
    return explicit === categoryId || explicit === label || explicit.includes(categoryId) || explicit.includes(label);
  });

  if (explicitMatch) return explicitMatch.id;

  const haystack = normalize(
    [
      project.titulo,
      project.descripcion,
      project.enlace,
      project.tipo,
      ...(Array.isArray(project.tecnologias) ? project.tecnologias : []),
    ].join(" ")
  );

  const scoredCategories = projectCategories
    .map((category) => ({
      id: category.id,
      score: category.match.reduce((score, term) => {
        const normalizedTerm = normalize(term);
        if (!normalizedTerm) return score;
        return haystack.includes(normalizedTerm) ? score + (["app", "tindev", "tool", "herramienta", "arte", "juego"].includes(normalizedTerm) ? 2 : 1) : score;
      }, 0),
    }))
    .filter((category) => category.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredCategories[0]?.id || "herramientas";
};

const ProjectPlaceholder = ({ label, color }) => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: color }}>
    <svg viewBox="0 0 420 300" className="h-full w-full" role="img" aria-label={`Placeholder de imagen para ${label}`}>
      <rect width="420" height="300" fill={color} />
      <circle cx="78" cy="68" r="36" fill="#131313" opacity="0.16" />
      <circle cx="346" cy="230" r="54" fill="#fdfbfb" opacity="0.2" />
      <path d="M54 224 C116 128, 174 250, 234 150 S342 104, 376 196" fill="none" stroke="#131313" strokeWidth="12" strokeLinecap="round" />
      <path d="M84 100 H336 M84 132 H276 M84 164 H316" stroke="#131313" strokeWidth="10" strokeLinecap="round" opacity="0.42" />
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fill="#131313" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900">
        PLACEHOLDER
      </text>
      <text x="50%" y="64%" dominantBaseline="middle" textAnchor="middle" fill="#131313" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900">
        IMAGEN / ILUSTRACIÓN / PREVIEW
      </text>
    </svg>
  </div>
);

const ProjectStrip = ({ children, color }) => {
  const stripRef = useRef(null);
  const trackRef = useRef(null);
  const items = React.Children.toArray(children);
  const [minLoopItems, setMinLoopItems] = useState(() => (window.innerWidth >= 768 ? 3 : 2));
  const loopEnabled = items.length >= minLoopItems;
  const renderedItems = loopEnabled
    ? [0, 1].flatMap((repeat) =>
        items.map((item, index) => (
          <div key={`${repeat}-${item.key || index}`} className="contents" aria-hidden={repeat === 1}>
            {item}
            {index === items.length - 1 && (
              <div className="project-loop-separator" aria-hidden="true">
                <span />
              </div>
            )}
          </div>
        ))
      )
    : items;

  useEffect(() => {
    const updateMinLoopItems = () => {
      setMinLoopItems(window.innerWidth >= 768 ? 3 : 2);
    };

    updateMinLoopItems();
    window.addEventListener("resize", updateMinLoopItems);

    return () => {
      window.removeEventListener("resize", updateMinLoopItems);
    };
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    const track = trackRef.current;
    if (!strip || !track) return undefined;
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    let isDragging = false;
    let lastPointerX = 0;
    let releaseTimer;

    const setCenteredCard = () => {
      const cards = [...strip.querySelectorAll(".project-card")];
      if (!cards.length) return;

      const stripRect = strip.getBoundingClientRect();
      const stripCenter = stripRect.left + stripRect.width / 2;
      const centeredCard = cards.reduce((closest, card) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - stripCenter);
        return !closest || distance < closest.distance ? { card, distance } : closest;
      }, null)?.card;

      cards.forEach((card) => card.classList.toggle("is-center", card === centeredCard));
    };

    const applyDirectedSpeed = (moveAmount) => {
      if (!loopEnabled) return;

      const intensity = Math.min(1, Math.abs(moveAmount) / 160);
      const easedIntensity = intensity * intensity;

      track.classList.toggle("is-reverse", moveAmount > 0);
      track.style.setProperty("--carousel-duration", `${Math.max(46, 62 - easedIntensity * 10)}s`);
    };

    const setPointerDirection = (event) => {
      if (!loopEnabled || coarsePointerQuery.matches) return;

      const rect = strip.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distanceFromCenter = (event.clientX - center) / (rect.width / 2);

      applyDirectedSpeed(distanceFromCenter < -0.08 ? 160 : -160 * Math.min(1, Math.abs(distanceFromCenter)));
    };

    const resetDirection = () => {
      track.classList.remove("is-reverse");
      track.style.removeProperty("--carousel-duration");
    };

    const startSwipe = (event) => {
      if (!loopEnabled || !coarsePointerQuery.matches) return;

      window.clearTimeout(releaseTimer);
      isDragging = true;
      lastPointerX = event.clientX;
    };

    const moveSwipe = (event) => {
      if (!isDragging || !coarsePointerQuery.matches) return;

      const deltaX = event.clientX - lastPointerX;
      if (Math.abs(deltaX) > 2) {
        applyDirectedSpeed(deltaX);
      }
      lastPointerX = event.clientX;
    };

    const endSwipe = () => {
      if (!coarsePointerQuery.matches) return;

      isDragging = false;
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(resetDirection, 1400);
    };

    const intervalId = window.setInterval(setCenteredCard, 120);
    strip.addEventListener("pointermove", setPointerDirection);
    strip.addEventListener("pointerleave", resetDirection);
    strip.addEventListener("pointerdown", startSwipe);
    strip.addEventListener("pointermove", moveSwipe);
    window.addEventListener("pointerup", endSwipe);
    window.addEventListener("pointercancel", endSwipe);
    setCenteredCard();

    return () => {
      strip.removeEventListener("pointermove", setPointerDirection);
      strip.removeEventListener("pointerleave", resetDirection);
      strip.removeEventListener("pointerdown", startSwipe);
      strip.removeEventListener("pointermove", moveSwipe);
      window.removeEventListener("pointerup", endSwipe);
      window.removeEventListener("pointercancel", endSwipe);
      window.clearTimeout(releaseTimer);
      window.clearInterval(intervalId);
    };
  }, [loopEnabled]);

  return (
    <div
      ref={stripRef}
      className="project-strip-viewport"
      style={{
        "--strip-accent": color,
      }}
    >
      <div ref={trackRef} className={`project-strip-track ${loopEnabled ? "is-looping" : "is-static"}`}>{renderedItems}</div>
    </div>
  );
};

const ProjectCard = ({ project, category, index }) => {
  const title = project.titulo || project.nombre || "Proyecto sin título";
  const imageUrl = project.imagenUrl || project.imageUrl || project.imagen || "";
  const technologies = Array.isArray(project.tecnologias) ? project.tecnologias : [];
  const href = project.enlace || project.url || "#";
  const accentColor = project.accentColor || project.colorAcento || project.color || category.color;
  const requestText = project.brief || project.pedido || `¿Podés resolver algo como "${title}"?`;
  const solutionText = project.solucion || project.solution || project.respuesta || project.descripcion;

  return (
    <article className="project-card group flex-shrink-0 w-[min(86vw,360px)] md:w-[430px] rounded-[30px] bg-[#fdfbfb] p-3 text-[#131313]" style={{ "--card-accent": accentColor }}>
      <div className="project-card-media relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#242424]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover grayscale contrast-[1.08] transition-all duration-500 group-hover:grayscale-0"
          />
        ) : (
          <ProjectPlaceholder label={title} color={accentColor} />
        )}
        <span className="project-card-tag sticker-pill absolute left-3 top-3 bg-[#fdfbfb] text-[10px] shadow-[0_4px_0_rgba(0,0,0,0.22)]" style={{ "--sticker-bg": "#fdfbfb", "--sticker-hover-fg": "#131313" }}>
          {category.icon}
          {category.label}
        </span>
      </div>

      <div className="flex min-h-[260px] flex-col p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-2">
          <h3 className="project-card-title font-extended text-xl uppercase leading-[0.92] md:text-2xl">{title}</h3>
          <span className="project-card-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: accentColor }}>
            {category.icon}
          </span>
        </div>

        <div className="mb-6 flex flex-grow flex-col gap-4">
          <div className="chat-bubble chat-bubble-request max-w-[92%] bg-[#ece7df] text-sm text-[#131313]">
            {requestText}
          </div>
          <div className="chat-bubble chat-bubble-response ml-auto max-w-[92%] text-sm text-[#131313]" style={{ backgroundColor: accentColor }}>
            {solutionText}
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-6 flex flex-wrap gap-1.5">
            {technologies.map((tech, techIndex) => (
              <span key={`${tech}-${techIndex}`} className="project-card-tech sticker-pill bg-[#131313] px-2 py-1 text-[9px] font-bold uppercase text-[#fdfbfb]" style={{ "--sticker-bg": "#131313", "--sticker-fg": "#fdfbfb", "--sticker-hover-fg": "#131313" }}>
                {tech}
              </span>
            ))}
          </div>

          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="project-card-cta sticker-pill sticker-arrow w-full justify-center py-3 text-xs"
            style={{ backgroundColor: accentColor, "--sticker-bg": accentColor }}
          >
            Abrir {index + 1}
            <FaExternalLinkAlt className="text-[10px]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};

const EmptyCategoryCard = ({ category }) => (
  <div className="flex-shrink-0 w-[min(86vw,360px)] md:w-[430px] rounded-[30px] border border-[#fdfbfb]/15 bg-[#1f1f1f] p-3">
    <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
      <ProjectPlaceholder label={category.label} color={category.color} />
    </div>
    <div className="p-5">
      <h3 className="font-extended text-2xl uppercase leading-none text-[#fdfbfb]">Espacio para {category.label}</h3>
      <p className="mt-3 text-sm font-bold leading-snug text-[#fdfbfb]/60">
        Placeholder listo para cuando agregues contenido real de esta categoría.
      </p>
    </div>
  </div>
);

const ProjectsList = () => {
  const q = query(collection(db, "proyectos"), orderBy("createdAt", "desc"));
  const [proyectos, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-neo-panel animate-pulse font-mono uppercase">Cargando...</p>;
  if (error) return <p className="text-red-500 font-bold uppercase">Error: {error.message}</p>;

  const projectsData = proyectos && proyectos.length > 0 ? proyectos : mockProjects;
  const groupedProjects = projectCategories.map((category) => ({
    ...category,
    projects: projectsData.filter((project) => getProjectCategory(project) === category.id),
  }));

  return (
    <div className="space-y-14">
      {groupedProjects.map((category) => (
        <section key={category.id} id={`proyectos-${category.id}`} className="scroll-mt-24">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="sticker-pill mb-3 text-xs" style={{ backgroundColor: category.color, "--sticker-bg": category.color }}>
                {category.icon}
                {category.label}
              </span>
              <h3 className="font-extended text-3xl leading-none text-[#fdfbfb] sm:text-5xl">{category.label}</h3>
            </div>
            <p className="max-w-sm text-sm font-black uppercase text-[#fdfbfb]/50">{category.hint}</p>
          </div>

          <ProjectStrip color={category.color}>
            {category.projects.length > 0 ? (
              category.projects.map((project, index) => <ProjectCard key={project.id || `${category.id}-${index}`} project={project} category={category} index={index} />)
            ) : (
              <EmptyCategoryCard category={category} />
            )}
          </ProjectStrip>
        </section>
      ))}
    </div>
  );
};

export default ProjectsList;
