// src/App.jsx
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import existing components
import AboutSection from "./components/AboutSection";
import { CustomCursor } from "./components/CustomCursor";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectSection from "./components/ProjectSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ProgressBar from "./components/ProgressBar";
import Experience from "./components/Experience";

// Import Login components
import LoginPage from "./components/login/auth/LoginPage";
import ProtectedRoute from "./components/login/auth/ProtectedRoute";

// Import Dashboard components
import Dashboard from "./components/dashboard/Dashboard";
import UpdateProject from "./components/dashboard/UpdateProject";

// Main Portfolio Component (PUBLIC)
function Portfolio() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <CustomCursor />
      <AboutSection />
      <ProjectSection />
      <Experience />
      <ContactSection />
      <Footer />
      <ProgressBar />
    </>
  );
}

// Main App with Routing
export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Portfolio />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/update/:id"
            element={
              <ProtectedRoute>
                <UpdateProject />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to portfolio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}
