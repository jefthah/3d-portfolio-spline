// components/Header.jsx

import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import {
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiMenu,
  FiTwitter,
  FiX,
} from "react-icons/fi";
import ContactForm from "./ContactForm";

// Navigation items configuration
const NAV_ITEMS = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Project", id: "project" },
  { name: "Experience", id: "experience" },
  { name: "Contact", id: "contact" },
];

// Social links configuration
const SOCIAL_LINKS = [
  { icon: FiGithub, href: "https://github.com/jefthah", label: "GitHub" },
  {
    icon: FiInstagram,
    href: "https://www.instagram.com/jefta_supraja/",
    label: "Twitter",
  },
  {
    icon: FiLinkedin,
    href: "https://www.linkedin.com/in/jefta-supraja-925805286/",
    label: "LinkedIn",
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  // Toggle menu with body scroll lock
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => {
      // Lock/unlock body scroll when mobile menu opens/closes
      if (!prev) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return !prev;
    });
  }, []);

  // Close menu and unlock scroll
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  }, []);

  // Contact form handlers
  const openContactForm = useCallback(() => setContactFormOpen(true), []);
  const closeContactForm = useCallback(() => setContactFormOpen(false), []);

  // Smooth scroll to section
  const scrollToSection = useCallback(
    (sectionId) => {
      // Delay sedikit untuk memastikan DOM ready
      setTimeout(() => {
        const element = document.getElementById(sectionId);

        if (element) {
          const yOffset = -80; // Offset for fixed header
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });

          // Close mobile menu after navigation
          if (isOpen) {
            closeMenu();
          }
        } else {
          // Debug: log jika element tidak ditemukan
          console.warn(
            `Section with id "${sectionId}" not found. Please check if the element exists in the DOM.`
          );

          // Coba alternative scroll dengan querySelector
          const alternativeElement = document.querySelector(
            `#${sectionId}, [id="${sectionId}"]`
          );
          if (alternativeElement) {
            alternativeElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            if (isOpen) closeMenu();
          }
        }
      }, 100);
    },
    [isOpen, closeMenu]
  );

  // Intersection Observer for active section
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => item.id);

    // Debug: Check if all sections exist
    const checkSections = () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) {
          console.warn(`Warning: Section "${id}" not found in DOM`);
        }
      });
    };

    // Check sections after a delay to ensure DOM is loaded
    setTimeout(checkSections, 500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.id;
            setActiveSection(
              sectionName.charAt(0).toUpperCase() + sectionName.slice(1)
            );
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -20% 0px", // Lebih longgar
        threshold: 0.3, // Minimal 30% terlihat
      }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Ganti line 146-151
  useEffect(() => {
    const handleSectionInView = (event) => {
      const section = event.detail.section;
      // Pastikan konsisten dengan kapitalisasi
      const formattedName =
        section.charAt(0).toUpperCase() + section.slice(1).toLowerCase();
      setActiveSection(formattedName);
    };

    window.addEventListener("sectionInView", handleSectionInView);
    return () =>
      window.removeEventListener("sectionInView", handleSectionInView);
  }, []);

  // Line 156 - Update format title sesuai keinginan
  useEffect(() => {
    // Format: "Section | Jefta Portfolio"
    if (activeSection.toLowerCase() === "home") {
      document.title = "Jefta Supraja - Full Stack Dev";
    } else {
      document.title = `${activeSection} | Jefta Portfolio`;
    }
  }, [activeSection]);

  // Update page title based on active section
  useEffect(() => {
    document.title = `${activeSection} | Jefta Portfolio`;
  }, [activeSection]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      <header className="fixed w-full z-50 transition-all duration-300 bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Section */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 25,
                delay: 0.3,
                duration: 1.2,
              }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => scrollToSection("home")}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-500 to-gray-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                  J
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
                Jefta
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="lg:flex hidden space-x-8">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.7 + index * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative text-gray-200 hover:text-violet-400 font-medium transition-colors duration-300 group bg-transparent border-none cursor-pointer ${
                    activeSection.toLowerCase() === item.id
                      ? "text-violet-400"
                      : ""
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-violet-600 transition-all duration-300 ${
                      activeSection.toLowerCase() === item.id
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </motion.button>
              ))}
            </nav>

            {/* Desktop Social Icons + Hire Me Button */}
            <div className="hidden md:flex items-center gap-4">
              {/* Social Icons */}
              <div className="flex items-center space-x-4">
                {SOCIAL_LINKS.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 1.3 + index * 0.1,
                        duration: 0.5,
                      }}
                      className="text-gray-300 hover:text-violet-400 transition-colors duration-300"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>

              <motion.a
                href="https://docs.google.com/document/d/1SG4NuIex-Gh5T0DrIS6pU-eSr12mA8r1/edit?usp=sharing&ouid=112833147381606617908&rtpof=true&sd=true"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1.5,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="px-4 py-2 rounded-xl border border-gray-400 text-gray-300 font-bold hover:border-violet-400 hover:text-violet-400 hover:bg-violet-400/10 transition-all duration-300"
              >
                Look at My CV
              </motion.a>

              {/* Hire Me Button */}
              <motion.button
                onClick={openContactForm}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1.6,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-500"
              >
                Hire Me
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="text-gray-300 p-2 hover:text-violet-400 transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? (
                    <FiX className="h-6 w-6" />
                  ) : (
                    <FiMenu className="h-6 w-6" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.nav
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="md:hidden overflow-hidden bg-gray-900/95 backdrop-blur-sm shadow-lg"
        >
          <div className="px-5 py-5 space-y-5">
            {/* Mobile Navigation Items */}
            <div className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{
                    x: isOpen ? 0 : -20,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{
                    delay: isOpen ? index * 0.05 : 0,
                    duration: 0.2,
                  }}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-gray-300 hover:text-violet-400 font-medium py-3 px-3 transition-all duration-300 text-left rounded-lg hover:bg-violet-600/10 ${
                    activeSection.toLowerCase() === item.id
                      ? "text-violet-400 bg-violet-600/10"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {activeSection.toLowerCase() === item.id && (
                      <span className="w-1 h-4 bg-violet-400 rounded-full" />
                    )}
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Social Links & Contact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ delay: isOpen ? 0.3 : 0 }}
              className="pt-4 border-t border-gray-700"
            >
              <div className="flex space-x-5 mb-4">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-gray-300 hover:text-violet-400 transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>

              {/* Look at My CV Button */}
              <a
                href="https://docs.google.com/document/d/1SG4NuIex-Gh5T0DrIS6pU-eSr12mA8r1/edit?usp=sharing&ouid=112833147381606617908&rtpof=true&sd=true"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 mb-3 text-center rounded-lg border border-gray-400 text-gray-300 font-bold hover:border-violet-400 hover:text-violet-400 hover:bg-violet-400/10 transition-all duration-300"
              >
                Look at My CV
              </a>

              <button
                onClick={() => {
                  closeMenu();
                  openContactForm();
                }}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-violet-400 text-white font-bold hover:from-violet-700 hover:to-purple-700 transition-all"
              >
                Contact Me
              </button>
            </motion.div>
          </div>
        </motion.nav>
      </header>

      {/* Contact Form Modal */}
      <ContactForm isOpen={contactFormOpen} onClose={closeContactForm} />
    </>
  );
}
