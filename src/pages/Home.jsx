import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import EducationList from "../components/EducationList";
import ExperienceList from "../components/ExperienceList";
import LanguagesList from "../components/LanguagesList";
import ProjectsList from "../components/ProjectsList";
import ToolsList from "../components/ToolsList";
import { FaEnvelope, FaGamepad, FaGithub, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaGlobe } from "react-icons/fa";

const FloatingImagePlaceholder = ({ label, color = "#f164d8", className = "" }) => (
  <div className={`pointer-events-none select-none ${className}`}>
    <svg viewBox="0 0 260 190" className="h-full w-full drop-shadow-[0_14px_0_rgba(0,0,0,0.22)]" role="img" aria-label={`Placeholder para ${label}`}>
      <rect x="8" y="8" width="244" height="174" rx="28" fill={color} />
      <path d="M48 132 C74 84, 104 152, 134 110 S196 70, 214 128" fill="none" stroke="#131313" strokeWidth="10" strokeLinecap="round" />
      <circle cx="78" cy="66" r="19" fill="#131313" />
      <path d="M138 54 H204 M138 78 H190" stroke="#131313" strokeWidth="9" strokeLinecap="round" opacity="0.45" />
      <text x="130" y="158" textAnchor="middle" fill="#131313" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="900">
        {label}
      </text>
    </svg>
  </div>
);

const localProfileImage = "/profile-facundo.png";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    fullName: "Facundo Villafañe",
    title: "Desarrollador Front-end & Game Enthusiast",
    aboutText: "",
    imageUrl: localProfileImage,
    quote: "Lo que nos define no es lo que hacemos de vez en cuando, sino lo que hacemos consistentemente.",
    email: "favillafane@gmail.com",
    website: "https://tudominio.com",
    phone: "(+54) 1134477511",
    location: "CABA, Argentina",
    github: "https://github.com/tu-usuario",
    linkedin: "https://linkedin.com/in/tu-usuario",
    useGravatar: false,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRef = doc(db, "perfil", "datos");
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfileData((prev) => ({ ...prev, ...profileSnap.data() }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    document.documentElement.classList.remove("dark");
  }, []);

  const getProfileImageUrl = () => {
    return localProfileImage;
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { id: "proyectos", label: "Proyectos", color: "bg-[#00c979]", value: "#00c979" },
    { id: "experiencia", label: "Experiencia", color: "bg-[#1398ff]", value: "#1398ff" },
    { id: "habilidades", label: "Skills", color: "bg-[#ff9f1a]", value: "#ff9f1a" },
    { id: "contacto", label: "Contacto", color: "bg-[#ff5b57]", value: "#ff5b57" },
  ];

  const socialLinks = [
    { label: "GitHub", href: profileData.github, icon: <FaGithub aria-hidden="true" />, color: "bg-[#f164d8]", value: "#f164d8" },
    { label: "LinkedIn", href: profileData.linkedin, icon: <FaLinkedin aria-hidden="true" />, color: "bg-[#1398ff]", value: "#1398ff" },
    { label: "Instagram", href: profileData.instagram, icon: <FaInstagram aria-hidden="true" />, color: "bg-[#ff9f1a]", value: "#ff9f1a" },
    { label: "Itch.io", href: profileData.itchio, icon: <FaGamepad aria-hidden="true" />, color: "bg-[#00c979]", value: "#00c979" },
    { label: "Web", href: profileData.website, icon: <FaGlobe aria-hidden="true" />, color: "bg-[#ff5b57]", value: "#ff5b57" },
  ].filter((link) => link.href);

  const firstName = profileData.fullName.split(" ")[0];
  const lastName = profileData.fullName.split(" ").slice(1).join(" ");

  return (
    <div className="min-h-screen overflow-x-hidden bg-neo-bg text-neo-border font-mono">
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true" focusable="false">
        <filter id="profile-rough-outline-a" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="2" seed="8" result="noise">
            <animate attributeName="baseFrequency" dur="1.4s" values="0.018 0.05;0.032 0.035;0.02 0.06;0.018 0.05" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="profile-rough-outline-b" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.026 0.04" numOctaves="2" seed="17" result="noise">
            <animate attributeName="baseFrequency" dur="1.9s" values="0.026 0.04;0.016 0.065;0.034 0.03;0.026 0.04" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="G" yChannelSelector="R" />
        </filter>
      </svg>

      <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:top-5 md:bottom-auto md:px-8 md:pb-0 pointer-events-none">
        <div className="mx-auto flex max-w-[1220px] items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-[#131313]/88 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md pointer-events-auto">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-2xl sm:text-3xl font-extended font-black text-neo-panel leading-none"
            aria-label="Volver al inicio"
          >
            FV
          </button>
          <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`sticker-pill sticker-arrow ${item.color} text-[10px] sm:text-sm shadow-[0_5px_0_rgba(0,0,0,0.25)]`}
                style={{ "--sticker-bg": item.value }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto flex max-w-[1220px] flex-col gap-16 px-4 pb-32 pt-8 sm:px-6 md:gap-20 md:pb-20 md:pt-20">
        <section className="relative min-h-[min(760px,calc(100vh-4rem))] flex flex-col items-center justify-center gap-6 py-12 text-center md:py-16">
          <FloatingImagePlaceholder
            label="HERO IMG"
            color="#00c979"
            className="absolute left-4 top-28 hidden h-32 w-44 -rotate-6 opacity-90 lg:block"
          />
          <FloatingImagePlaceholder
            label="ARTE / FOTO"
            color="#ff5b57"
            className="absolute right-4 top-48 hidden h-36 w-48 rotate-6 opacity-90 lg:block"
          />

          <div className="profile-portrait relative h-40 w-44 sm:h-56 sm:w-64">
            <div className="absolute -inset-5 rounded-full bg-[#f164d8] blur-3xl opacity-20"></div>
            <img
              src={getProfileImageUrl()}
              alt=""
              aria-hidden="true"
              className="profile-portrait-outline profile-portrait-outline-a"
            />
            <img
              src={getProfileImageUrl()}
              alt=""
              aria-hidden="true"
              className="profile-portrait-outline profile-portrait-outline-b"
            />
            <img
              src={getProfileImageUrl()}
              alt={profileData.fullName}
              className="profile-portrait-img relative h-full w-full object-contain grayscale contrast-125"
            />
            <img
              src="/sunglasses.png"
              alt=""
              aria-hidden="true"
              className="profile-sunglasses"
            />
            {profileData.location && (
              <span className="absolute -right-8 bottom-2 z-20 sticker-pill bg-[#ff9f1a] text-[10px] shadow-[0_4px_0_rgba(0,0,0,0.35)] sm:text-xs">
                <FaMapMarkerAlt aria-hidden="true" /> {profileData.location}
              </span>
            )}
          </div>

          <div className="max-w-4xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-neo-panel/60 sm:text-sm">Portfolio personal</p>
            <h1 className="font-extended text-[clamp(2rem,5.8vw,4.9rem)] leading-[0.98] text-neo-panel">
              Hola, soy{" "}
              <span className="sticker-pill sticker-arrow bg-[#f164d8] align-middle text-[0.72em]">{firstName}</span>
              <br />
              <span className="sticker-pill sticker-arrow bg-[#1398ff] align-middle text-[0.72em]">{lastName || "dev"}</span>{" "}
              y hago experiencias gamificadas.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base font-extrabold leading-snug text-neo-panel/80 sm:text-xl">
              Especialista en videojuegos, webs y apps que motivan y enseñan. Transformo ideas en productos digitales vivos.
            </p>
          </div>

        </section>

        <section id="proyectos" className="scroll-mt-12">
          <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h2 className="font-extended text-4xl leading-none text-neo-panel sm:text-6xl">Proyectos</h2>
            </div>
            <FloatingImagePlaceholder label="SECTION IMG" color="#1398ff" className="h-40 w-full max-w-xs justify-self-start lg:justify-self-end" />
          </div>
          <ProjectsList />
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.35fr]" id="experiencia">
          <div className="editorial-panel-dark p-6 sm:p-8">
            <h2 className="font-extended text-4xl leading-none text-[#00c979] sm:text-5xl">Sobre mí</h2>
            <p className="mt-5 whitespace-pre-line text-lg font-black leading-snug text-neo-panel/80">
              {profileData.aboutText || profileData.quote}
            </p>
            <div id="contacto" className="mt-8 space-y-3 text-sm">
              {profileData.email && (
                <a href={`mailto:${profileData.email}`} className="sticker-pill bg-[#ff5b57] text-xs" style={{ "--sticker-bg": "#ff5b57" }}>
                  <FaEnvelope aria-hidden="true" /> {profileData.email}
                </a>
              )}
              {profileData.phone && (
                <p className="flex items-center gap-2 text-neo-panel/80">
                  <FaPhone className="text-[#00c979]" aria-hidden="true" /> {profileData.phone}
                </p>
              )}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3">
                  {socialLinks.map((link, index) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      className={`sticker-pill ${index % 2 === 0 ? "" : "sticker-alt"} ${link.color} text-[10px]`}
                      style={{ "--sticker-bg": link.value }}
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="editorial-panel p-6 sm:p-8">
            <h2 className="mb-8 font-extended text-4xl leading-none text-[#131313] sm:text-5xl">Experiencia</h2>
            <ExperienceList />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.75fr]">
          <div id="habilidades" className="editorial-panel p-6 sm:p-8">
            <h2 className="mb-8 font-extended text-4xl leading-none text-[#131313] sm:text-5xl">Habilidades</h2>
            <ToolsList />
          </div>

          <div className="grid gap-5">
            <div className="editorial-panel-dark p-6 sm:p-8">
              <h2 className="mb-6 font-extended text-4xl leading-none text-[#f164d8] sm:text-5xl">Idiomas</h2>
              <LanguagesList />
            </div>
            <div id="educacion" className="editorial-panel p-6 sm:p-8">
              <h2 className="mb-6 font-extended text-4xl leading-none text-[#131313] sm:text-5xl">Educación</h2>
              <EducationList />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neo-panel/10 px-4 py-10 text-center text-sm font-black uppercase text-neo-panel/55 sm:px-6">
        {loading ? "Cargando perfil..." : `© ${new Date().getFullYear()} ${profileData.fullName}`}
      </footer>
    </div>
  );
};

export default Home;
