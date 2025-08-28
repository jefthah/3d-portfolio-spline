import { useEffect, useState, useRef, useCallback } from "react";
import { PinContainer } from "../components/acertenity/3d-pin";
import "./ProjectSection.css";

// Menggunakan environment variable
const API_URL = import.meta.env.VITE_API_URL || "https://backend-porto-d68o.vercel.app/api";

export default function ProjectSection() {
  const [state, setState] = useState({
    projects: [],
    isLoading: true,
    error: null,
    currentIndex: 0,
    isMobile: window.innerWidth < 768
  });
  
  const scrollContainerRef = useRef(null);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setState(prev => ({ 
      ...prev, 
      isMobile: window.innerWidth < 768 
    }));
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  // Set title langsung saat component terlihat
  document.title = "Project | Jefta Portfolio";
  
  // Trigger event untuk update header state
  window.dispatchEvent(new CustomEvent('sectionInView', { 
    detail: { section: 'project' } 
  }));
}, []);

  // Fetch projects
  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Handle different response formats
        const projectsArray = data.data || data.projects || [];
        
        const projects = projectsArray.map((p, i) => ({
          id: p._id || p.id || i + 1,
          title: p.title || p.name || "Untitled",
          description: p.description || "No description",
          imageSrc: p.imageUrl || p.image || "/images/1920.png",
          deployLink: p.deployLink || "#",
          githubRepo: p.githubRepo || "",
          techStack: p.techStack || [],  
          demoVideoUrl: p.demoVideoUrl || "" 
        }));
        
        setState(prev => ({ ...prev, projects, isLoading: false }));
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setState(prev => ({ 
          ...prev, 
          error: err.message, 
          isLoading: false 
        }));
      });
  }, []);

  // Scroll handlers
  const scrollToIndex = useCallback((index) => {
    const container = scrollContainerRef.current;
    if (!container?.children[0]) return;

    const { offsetWidth: cardWidth } = container.children[0];
    const gap = container.children[1] 
      ? container.children[1].offsetLeft - (container.children[0].offsetLeft + cardWidth)
      : 0;
    
    const cardsPerView = state.isMobile ? 1 : 2;
    const scrollPosition = index * cardsPerView * (cardWidth + gap);

    container.scrollTo({ left: scrollPosition, behavior: "smooth" });
    setState(prev => ({ ...prev, currentIndex: index }));
  }, [state.isMobile]);

  const navigate = useCallback((direction) => {
    const { currentIndex, projects, isMobile } = state;
    const maxIndex = isMobile ? projects.length - 1 : Math.ceil(projects.length / 2) - 1;
    const newIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction));
    scrollToIndex(newIndex);
  }, [state, scrollToIndex]);

  const handleScroll = useCallback((e) => {
    const container = e.target;
    const firstCard = container.children[0];
    if (!firstCard) return;

    const { offsetWidth: cardWidth, offsetLeft } = firstCard;
    const gap = container.children[1]?.offsetLeft - (offsetLeft + cardWidth) || 0;
    const scrollUnit = state.isMobile ? cardWidth + gap : cardWidth * 2 + gap;
    const newIndex = Math.round(container.scrollLeft / scrollUnit);
    
    setState(prev => ({ ...prev, currentIndex: newIndex }));
  }, [state.isMobile]);

  const { projects, isLoading, error, currentIndex, isMobile } = state;
  const dotsCount = isMobile ? projects.length : Math.ceil(projects.length / 2);
  const maxIndex = isMobile ? projects.length - 1 : Math.ceil(projects.length / 2) - 1;

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full h-screen bg-[#9a74cf50] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white text-xl md:text-2xl animate-pulse">
            Loading projects...
          </div>
        </div>
      </section>
    );
  }

  // Error or empty state
  if (error || !projects.length) {
    return (
      <section className="w-full h-screen bg-[#9a74cf50]flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl mb-4">
            {error ? "Failed to load projects" : "No projects available"}
          </h2>
          <p className="text-gray-400">
            {error || "Please check back later"}
          </p>
          {error && (
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="project" className="w-full h-screen bg-[#9a74cf50] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-pink-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 h-full flex flex-col px-4 md:px-6 lg:px-12 py-6 md:py-8 lg:py-10">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
            Featured Projects
          </h2>
          <div className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full" />
          <p className="text-gray-400 mt-2 md:mt-3 text-xs sm:text-sm md:text-base px-4 md:px-0">
            {isMobile ? "Swipe to explore" : "Explore my latest work and creative solutions"}
          </p>
        </div>

        {/* Cards Container */}
        <div className="flex-1 relative flex items-center">
          <div className="w-full h-full relative max-w-[1400px] mx-auto">
            {/* Navigation Buttons */}
            {!isMobile && (
              <>
                <NavButton 
                  direction="left" 
                  onClick={() => navigate(-1)} 
                  disabled={currentIndex === 0}
                />
                <NavButton 
                  direction="right" 
                  onClick={() => navigate(1)} 
                  disabled={currentIndex >= maxIndex}
                />
              </>
            )}

            {/* Cards Scroll Container */}
            <div
              ref={scrollContainerRef}
              className={`flex gap-4 md:gap-6 lg:gap-8 h-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory no-scrollbar ${
                isMobile ? "py-10 px-4" : "py-10 md:py-8 px-2"
              }`}
              onScroll={handleScroll}
            >
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} isMobile={isMobile} />
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-1.5 md:gap-2 pb-3 md:pb-4 pt-2">
          {Array.from({ length: dotsCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index
                  ? "w-6 md:w-7 h-1 md:h-1.5 bg-gradient-to-r from-purple-400 to-pink-400"
                  : "w-1 md:w-1.5 h-1 md:h-1.5 bg-purple-400/40 hover:bg-purple-400/60"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}

// Navigation Button Component
const NavButton = ({ direction, onClick, disabled }) => {
  const isLeft = direction === "left";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute ${isLeft ? "-left-10 lg:-left-20" : "-right-5 lg:-right-20"} 
        top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 
        bg-purple-600/60 hover:bg-purple-600/80 text-white rounded-full 
        backdrop-blur-sm transition-all duration-300 transform hover:scale-110 
        flex items-center justify-center 
        ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d={isLeft ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
};

// Project Card Component
const ProjectCard = ({ project, isMobile }) => {
  const handleImageError = (e) => {
    e.target.style.display = "none";
    e.target.parentElement.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div class="text-white text-4xl md:text-6xl font-bold opacity-20">${project.title.charAt(0)}</div>
      </div>
    `;
  };

  return (
    <div className="flex-none w-full md:w-[calc(50%-0.75rem)] min-w-[320px] md:min-w-[400px] max-w-[450px] md:max-w-[600px] h-full snap-center flex items-center justify-center">
      <div className={`w-full h-[75%] ${isMobile ? 'mt-8' : ''} max-h-[450px] md:max-h-[500px]`}>
        <PinContainer title={`Visit ${project.title}`} href={project.deployLink}>
          <div className="flex flex-col w-[320px] sm:w-[380px] md:w-[450px] h-[380px] sm:h-[440px] md:h-[480px] bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Title & Description */}
              <div className="mb-3 md:mb-4">
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-white mb-1.5 md:mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 md:px-3 py-0.5 md:py-1 bg-purple-600/20 text-purple-300 rounded-full text-[10px] sm:text-xs font-medium border border-purple-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Image Container */}
              <div className="flex-1 relative rounded-lg md:rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                <img
                  src={project.imageSrc}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  onError={handleImageError}
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3 md:p-5">
                  <div className="text-white">
                    <p className="text-xs md:text-sm font-medium">Click to visit →</p>
                    <p className="text-[10px] md:text-xs opacity-70 truncate">{project.deployLink}</p>
                  </div>
                </div>
              </div>

              {/* GitHub Link (optional) */}
              {project.githubRepo && (
                <div className="mt-2 flex justify-end">
                  <a 
                    href={project.githubRepo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 text-xs transition-colors"
                  >
                    View Code →
                  </a>
                </div>
              )}
            </div>
          </div>
        </PinContainer>
      </div>
    </div>
  );
};