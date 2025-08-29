import { useEffect, useState, useRef, useCallback } from "react";
import { PinContainer } from "../components/acertenity/3d-pin";
import "./ProjectSection.css";

// Menggunakan environment variable
const API_URL =
  import.meta.env?.VITE_API_URL || "https://backend-porto-d68o.vercel.app/api";

export default function ProjectSection() {
  const [state, setState] = useState({
    projects: [],
    isLoading: true,
    error: null,
    currentIndex: 0,
    isMobile: false, // Start with false, will be set in useEffect
  });

  const scrollContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Better mobile detection
  useEffect(() => {
    const checkMobile = () => {
      // More reliable mobile detection
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        window.innerWidth <= 768 ||
        "ontouchstart" in window;

      setState((prev) => ({
        ...prev,
        isMobile: isMobileDevice,
      }));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, []);

  useEffect(() => {
    document.title = "Project | Jefta Portfolio";
    window.dispatchEvent(
      new CustomEvent("sectionInView", {
        detail: { section: "project" },
      })
    );
  }, []);

  // Fetch projects
  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const projectsArray = data.data || data.projects || [];

        const projects = projectsArray.map((p, i) => ({
          id: p._id || p.id || i + 1,
          title: p.title || p.name || "Untitled",
          description: p.description || "No description",
          imageSrc: p.imageUrl || p.image || "/images/1920.png",
          deployLink: p.deployLink || "#",
          githubRepo: p.githubRepo || "",
          techStack: p.techStack || [],
          demoVideoUrl: p.demoVideoUrl || "",
        }));

        setState((prev) => ({ ...prev, projects, isLoading: false }));
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setState((prev) => ({
          ...prev,
          error: err.message,
          isLoading: false,
        }));
      });
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && state.currentIndex < state.projects.length - 1) {
        scrollToIndex(state.currentIndex + 1);
      } else if (swipeDistance < 0 && state.currentIndex > 0) {
        scrollToIndex(state.currentIndex - 1);
      }
    }
  };

  // Improved scroll handlers
  const scrollToIndex = useCallback(
    (index) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const validIndex = Math.max(
        0,
        Math.min(index, state.projects.length - 1)
      );

      if (state.isMobile) {
        // For mobile, scroll to specific card
        const cardWidth = container.offsetWidth;
        const scrollPosition = validIndex * cardWidth;
        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
      } else {
        // For desktop, show 2 cards at a time
        const cardWidth = container.offsetWidth / 2;
        const groupIndex = Math.floor(validIndex / 2);
        const scrollPosition = groupIndex * container.offsetWidth;
        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }

      setState((prev) => ({ ...prev, currentIndex: validIndex }));
    },
    [state.isMobile, state.projects.length]
  );

  const navigate = useCallback(
    (direction) => {
      const { currentIndex, projects, isMobile } = state;

      if (isMobile) {
        const newIndex = Math.max(
          0,
          Math.min(projects.length - 1, currentIndex + direction)
        );
        scrollToIndex(newIndex);
      } else {
        const newIndex = Math.max(
          0,
          Math.min(projects.length - 1, currentIndex + direction * 2)
        );
        scrollToIndex(newIndex);
      }
    },
    [state, scrollToIndex]
  );

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = state.isMobile
      ? container.offsetWidth
      : container.offsetWidth / 2;
    const newIndex = Math.round(scrollLeft / cardWidth);

    if (newIndex !== state.currentIndex) {
      setState((prev) => ({ ...prev, currentIndex: newIndex }));
    }
  }, [state.isMobile, state.currentIndex]);

  const { projects, isLoading, error, currentIndex, isMobile } = state;
  const dotsCount = isMobile ? projects.length : Math.ceil(projects.length / 2);

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full h-screen bg-gradient-to-b from-[#9a74cf50] to-black flex items-center justify-center">
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
      <section className="w-full h-screen bg-gradient-to-b from-[#9a74cf50] to-black flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-2xl md:text-3xl mb-4">
            {error ? "Failed to load projects" : "No projects available"}
          </h2>
          <p className="text-gray-400">{error || "Please check back later"}</p>
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
    <section
      id="project"
      className="w-full h-screen bg-gradient-to-b from-[#9a74cf50] to-black overflow-hidden relative"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div
          className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Navigation buttons - Di level teratas */}
      {!isMobile && projects.length > 2 && (
        <>
          <button
            onClick={() => navigate(-1)}
            disabled={currentIndex === 0}
            className={`absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 
            bg-purple-600 hover:bg-purple-700 text-white rounded-full 
            shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-purple-400
            ${
              currentIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:scale-110"
            }`}
            style={{ zIndex: 9999 }}
          >
            <svg
              className="w-6 h-6 lg:w-7 lg:h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => navigate(1)}
            disabled={currentIndex >= projects.length - 2}
            className={`absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 
            bg-purple-600 hover:bg-purple-700 text-white rounded-full 
            shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-purple-400
            ${
              currentIndex >= projects.length - 2
                ? "opacity-30 cursor-not-allowed"
                : "hover:scale-110"
            }`}
            style={{ zIndex: 9999 }}
          >
            <svg
              className="w-6 h-6 lg:w-7 lg:h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="text-center px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Featured Projects
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full" />
          <p className="text-gray-300 mt-2 text-sm md:text-base">
            {isMobile ? "Swipe to explore" : "Explore my latest work"}
          </p>
        </div>

        {/* Main content area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Cards container
          // Di dalam container cards, tambahkan spacer sebelum cards: */}
          <div
            ref={scrollContainerRef}
            className={`h-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide 
    ${isMobile ? "flex gap-4" : "flex"}`}
            onScroll={handleScroll}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchMove={isMobile ? handleTouchMove : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
          >
            {/* Spacer untuk desktop */}
            {!isMobile && <div className="w-32 flex-shrink-0" />}

            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`${
                  isMobile
                    ? "min-w-full snap-center flex items-center justify-center"
                    : "pl-60 w-[500px] flex-shrink-0 snap-start flex items-center justify-center"
                } h-full py-6`}
              >
                <ProjectCard
                  project={project}
                  isMobile={isMobile}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 py-4">
          {Array.from({ length: dotsCount }).map((_, index) => {
            const isActive = isMobile
              ? currentIndex === index
              : Math.floor(currentIndex / 2) === index;

            return (
              <button
                key={index}
                onClick={() => scrollToIndex(isMobile ? index : index * 2)}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-8 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400"
                    : "w-1.5 h-1.5 bg-purple-400/40 hover:bg-purple-400/60"
                }`}
                aria-label={`Go to ${isMobile ? "project" : "project group"} ${
                  index + 1
                }`}
              />
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
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

// Improved Project Card Component
const ProjectCard = ({ project, isMobile, index }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`${
        isMobile ? "w-[85vw] max-w-[380px]" : "w-[480px]"
      } h-full flex items-center justify-center`}
    >
      <PinContainer title={`Visit ${project.title}`} href={project.deployLink}>
        <div
          className={`relative ${
            isMobile ? "w-[75vw] max-w-[340px]" : "w-[400px] lg:w-[440px]"
          } 
          bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl`}
        >
          <div className={`${isMobile ? "p-3" : "p-5 lg:p-6"}`}>
            {/* Title & Description */}
            <div className={`${isMobile ? "mb-2" : "mb-4"}`}>
              <h3
                className={`font-bold ${
                  isMobile ? "text-base" : "text-xl lg:text-2xl"
                } text-white mb-1 truncate`}
              >
                {project.title}
              </h3>
              <p
                className={`text-gray-300 ${
                  isMobile ? "text-xs" : "text-sm lg:text-base"
                } line-clamp-2`}
              >
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            {project.techStack.length > 0 && (
              <div
                className={`flex flex-wrap ${
                  isMobile ? "gap-1 mb-2" : "gap-2 mb-3"
                }`}
              >
                {project.techStack
                  .slice(0, isMobile ? 3 : 4)
                  .map((tech, idx) => (
                    <span
                      key={idx}
                      className={`${
                        isMobile
                          ? "px-1.5 py-0.5 text-[10px]"
                          : "px-2 py-1 text-xs"
                      } 
                      bg-purple-600/20 text-purple-300 rounded-full font-medium border border-purple-500/20`}
                    >
                      {tech}
                    </span>
                  ))}
                {project.techStack.length > (isMobile ? 3 : 4) && (
                  <span
                    className={`${
                      isMobile
                        ? "px-1.5 py-0.5 text-[10px]"
                        : "px-2 py-1 text-xs"
                    } text-purple-300`}
                  >
                    +{project.techStack.length - (isMobile ? 3 : 4)}
                  </span>
                )}
              </div>
            )}

            {/* Image Container */}
            <div
              className={`relative ${
                isMobile ? "h-[180px]" : "h-[220px] lg:h-[250px]"
              } 
              rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20`}
            >
              {!imageError ? (
                <img
                  src={project.imageSrc}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    className={`text-white ${
                      isMobile ? "text-3xl" : "text-5xl"
                    } font-bold opacity-20`}
                  >
                    {project.title.charAt(0)}
                  </div>
                </div>
              )}

              {/* Hover overlay - desktop only */}
              {!isMobile && (
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 
                  transition-opacity duration-300 flex items-end p-4"
                >
                  <div className="text-white">
                    <p className="text-sm font-medium">Click to visit →</p>
                    <p className="text-xs opacity-70 truncate">
                      {project.deployLink}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* GitHub link */}
            {project.githubRepo && (
              <div className={`${isMobile ? "mt-2" : "mt-3"} flex justify-end`}>
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`text-purple-400 hover:text-purple-300 ${
                    isMobile ? "text-[11px]" : "text-sm"
                  } 
                    transition-colors inline-flex items-center gap-1`}
                >
                  View Code
                  <svg
                    className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </PinContainer>
    </div>
  );
};
