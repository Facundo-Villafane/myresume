import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import EducationList from "../components/EducationList";
import ExperienceList from "../components/ExperienceList";
import LanguagesList from "../components/LanguagesList";
import ProjectsList from "../components/ProjectsList";
import ToolsList from "../components/ToolsList";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { getGravatarUrl } from "../utils/gravatar";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "Facundo Villafañe",
    title: "Desarrollador Front-end & Game Enthusiast",
    imageUrl: "https://via.placeholder.com/600",
    quote: "Lo que nos define no es lo que hacemos de vez en cuando, sino lo que hacemos consistentemente.",
    email: "favillafane@gmail.com",
    website: "https://tudominio.com",
    phone: "(+54) 1134477511",
    location: "CABA, Argentina",
    github: "https://github.com/tu-usuario",
    linkedin: "https://linkedin.com/in/tu-usuario",
    useGravatar: true
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRef = doc(db, "perfil", "datos");
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfileData(prev => ({ ...prev, ...profileSnap.data() }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();

    // Check theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const getProfileImageUrl = () => {
    if (profileData.useGravatar && profileData.email) return getGravatarUrl(profileData.email, 600);
    return profileData.imageUrl;
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg text-neo-border font-mono">

      {/* Top Navigation Bar */}
      <nav className="border-b-2 border-neo-border bg-neo-panel sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
          <div className="font-extended font-black text-xl tracking-tighter">FV / DEV</div>
          <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest">
            <button onClick={() => scrollToSection('experiencia')} className="hover:text-neo-accent transition-colors">Experiencia</button>
            <button onClick={() => scrollToSection('educacion')} className="hover:text-neo-accent transition-colors">Educación</button>
            <button onClick={() => scrollToSection('habilidades')} className="hover:text-neo-accent transition-colors">Habilidades</button>
            <button onClick={() => scrollToSection('proyectos')} className="hover:text-neo-accent transition-colors">Proyectos</button>
          </div>
          <div
            onClick={toggleTheme}
            className="w-10 h-10 border-2 border-neo-border bg-neo-accent flex items-center justify-center cursor-pointer hover:bg-neo-panel text-black transition-colors"
          >
            <span className="font-extended font-black selection:bg-transparent">{isDarkMode ? '☀' : '◐'}</span>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12 space-y-12">

        {/* HERO SECTION */}
        <section className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 items-stretch relative">

          {/* Left Hero Box (Lime Green) */}
          <div className="lg:w-3/5 bg-neo-accent border-2 border-neo-border p-6 md:p-12 flex flex-col justify-center relative z-10">

            {/* Huge Extended Title */}
            <h1
              className="font-extended font-black text-6xl sm:text-7xl lg:text-[110px] leading-[0.85] tracking-tighter mix-blend-multiply mb-8 text-black"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              {profileData.fullName.split(' ')[0]}<br />{profileData.fullName.split(' ').slice(1).join(' ')}
            </h1>

            {/* Subtitle / Role */}
            <div className="border-l-4 border-black pl-4 mb-12">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">{profileData.title}</h2>
            </div>

            {/* Quick Links Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-auto">
              <a href={profileData.github} target="_blank" rel="noreferrer" className="editorial-panel text-center py-3 text-xs font-bold hover:bg-neo-border hover:text-neo-bg transition-colors">GITHUB</a>
              <a href={profileData.linkedin} target="_blank" rel="noreferrer" className="editorial-panel text-center py-3 text-xs font-bold hover:bg-neo-border hover:text-neo-bg transition-colors">LINKEDIN</a>
              <a href="#" className="editorial-panel text-center py-3 text-xs font-bold hover:bg-neo-border hover:text-neo-bg transition-colors">ITCH.IO</a>
              <a href={`mailto:${profileData.email}`} className="editorial-panel text-center py-3 text-xs font-bold hover:bg-neo-border hover:text-neo-bg transition-colors">EMAIL</a>
            </div>
          </div>

          {/* Right Hero Image Box */}
          <div className="lg:w-2/5 border-2 border-neo-border bg-[#d1d1d1] relative overflow-hidden min-h-[500px] lg:min-h-full flex items-end justify-center">
            {/* Removed the rotated editorial text as requested */}
            <img
              src={getProfileImageUrl()}
              alt={profileData.fullName}
              className="w-full max-w-[95%] object-contain filter grayscale contrast-125 z-10 block translate-y-4"
              style={{ pointerEvents: 'none' }}
            />
            {profileData.location && (
              <div className="absolute top-4 right-4 bg-neo-border text-neo-accent text-[10px] font-black tracking-widest px-3 py-1.5 z-20">
                {profileData.location.toUpperCase()}
              </div>
            )}
          </div>

        </section>

        {/* TWO-COLUMN CONTENT LAYOUT */}
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left Column: Sidebar details */}
          <div className="lg:w-1/3 flex flex-col gap-6">

            {/* Languages Panel */}
            <div className="editorial-panel p-6">
              <h3 className="font-extended font-black text-2xl mb-6 tracking-tighter flex items-center gap-3">
                <div className="w-3 h-3 bg-neo-accent border border-neo-border"></div> IDIOMAS
              </h3>
              <LanguagesList />
            </div>

            {/* Contact Panel */}
            <div className="editorial-panel-dark p-6">
              <h3 className="font-extended font-black text-3xl mb-6 text-neo-accent tracking-tighter">CONTACTO</h3>
              <ul className="space-y-4">
                {profileData.email && (
                  <li className="flex items-center gap-3 text-sm">
                    <FaEnvelope className="text-neo-accent" />
                    <a href={`mailto:${profileData.email}`} className="hover:text-neo-accent">{profileData.email}</a>
                  </li>
                )}
                {profileData.phone && (
                  <li className="flex items-center gap-3 text-sm">
                    <FaPhone className="text-neo-accent" />
                    <span>{profileData.phone}</span>
                  </li>
                )}
                {profileData.location && (
                  <li className="flex items-center gap-3 text-sm">
                    <FaMapMarkerAlt className="text-neo-accent" />
                    <span className="uppercase">{profileData.location}</span>
                  </li>
                )}
              </ul>
            </div>

          </div>

          {/* Right Column: Main Content Feeds */}
          <div className="lg:w-2/3 flex flex-col gap-12">

            <div id="experiencia" className="editorial-panel p-6 md:p-10 scroll-mt-24">
              <h2 className="font-extended font-black text-4xl md:text-5xl italic tracking-tighter mb-10">EXPERIENCIA</h2>
              <ExperienceList />
            </div>

            <div id="educacion" className="scroll-mt-24">
              <EducationList />
            </div>

            <div id="habilidades" className="editorial-panel p-6 md:p-10 scroll-mt-24">
              <h2 className="font-extended font-black text-3xl tracking-wide mb-8 text-center uppercase border-b-2 border-neo-border pb-4">Habilidades</h2>
              <ToolsList />
            </div>

          </div>
        </section>

        {/* PROJECTS SECTION (Full Width) */}
        <section id="proyectos" className="pt-8 scroll-mt-24 border-t-4 border-neo-border border-dashed">
          <h2 className="font-extended font-black text-5xl md:text-[80px] italic tracking-tighter mb-8 -ml-1">PROYECTOS</h2>
          <ProjectsList />
        </section>

      </main>

      {/* MASSIVE FOOTER */}
      <footer className="w-full bg-neo-panel text-neo-border border-t-2 border-neo-border py-20 overflow-hidden relative mt-32">
        {/* Huge Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-10 pointer-events-none select-none">
          <h2 className="font-extended font-black text-[12vw] leading-none whitespace-nowrap overflow-hidden text-clip tracking-tighter m-0 p-0">TRABAJEMOS</h2>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 relative z-10 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {profileData.fullName}</p>
          <div className="w-16 h-px bg-neo-accent hidden md:block"></div>
          <a href={`mailto:${profileData.email}`} className="text-neo-border hover:text-neo-accent border-b-2 border-neo-border hover:border-neo-accent transition-colors pb-1">
            {profileData.email}
          </a>
        </div>
      </footer>

    </div>
  );
};

export default Home;