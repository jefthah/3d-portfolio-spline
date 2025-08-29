// components/Experience.jsx

import React, { useEffect, useRef } from "react";
import { Timeline } from "./acertenity/Timeline";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experienceData } from "./data/experienceData.jsx";

export default function Experience() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleLineRef = useRef(null);
  const timelineRef = useRef(null);
  const bgElementsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Title animation
    gsap.fromTo(
      titleRef.current,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Title line animation
    gsap.fromTo(
      titleLineRef.current,
      {
        width: 0,
        opacity: 0,
      },
      {
        width: "100%",
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Timeline content animation
    gsap.fromTo(
      timelineRef.current,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Background elements parallax animation
    bgElementsRef.current.forEach((element, index) => {
      if (element) {
        const speed = 0.5 + index * 0.2;
        const direction = index % 2 === 0 ? 1 : -1;

        gsap.to(element, {
          y: `${direction * 100}px`,
          rotation: direction * 180,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: speed,
          },
        });
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative min-h-screen bg-gradient-to-b from-black to-[#9a74cf50] overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={`bg-element-${i}`}
            ref={(el) => (bgElementsRef.current[i] = el)}
            className="absolute rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2,
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <div className="mb-16 pt-20">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 opacity-0 items-center justify-center"
          >
            Experience
          </h2>
          <div
            ref={titleLineRef}
            className="w-0 h-1 bg-gradient-to-r from-purple-400 to-black mx-auto opacity-0"
          ></div>
        </div>

        {/* Timeline Component dengan custom styling */}
        <div ref={timelineRef} className="opacity-0">
          <div className="timeline-wrapper [&_.dark\\:bg-neutral-950]:bg-transparent [&_.bg-white]:bg-transparent">
            <Timeline data={experienceData} />
          </div>
        </div>
      </div>
    </section>
  );
}
