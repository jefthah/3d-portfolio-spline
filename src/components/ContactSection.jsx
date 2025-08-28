import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { useRef } from "react";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  const circleRef = useRef(null);
  const sectionRef = useRef(null);
  const initialTextRef = useRef(null);
  const finalTextRef = useRef(null);

  const [contactFormOpen, setContactFormOpen] = useState(false);
  const openContactForm = () => setContactFormOpen(true);
  const closeContactForm = () => setContactFormOpen(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cleanUp = () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === sectionRef.current) {
          st.kill(true);
        }
      });
    };

    // clean up any existing scroll triggers for this section
    cleanUp();

    gsap.set(circleRef.current, { scale: 1, backgroundColor: "white" });
    gsap.set(initialTextRef.current, { opacity: 1 });
    gsap.set(finalTextRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(
      circleRef.current,
      {
        scale: 5,
        backgroundColor: "#9333EA",
        duration: 0.5,
        ease: "power1.inOut",
      },
      0
    );

    tl.to(
      initialTextRef.current,
      { opacity: 0, duration: 0.2, ease: "power1.Out" },
      0.1
    );

    tl.to(
      circleRef.current,
      {
        scale: 17,
        backgroundColor: "#E9D5FF",
        boxShadow: "0 0 50px rgba(233, 213, 255, 0.3)",
        duration: 0.5,
        ease: "power2.inOut",
      },
      0.6
    );

    tl.to(
      finalTextRef.current,
      {
        opacity: 1,
        ease: "power2.in",
        duration: 0.2,
      },
      0.7
    );

    return cleanUp;
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="flex items-center justify-center bg-black relative min-h-screen"
      style={{ overscrollBehavior: "none" }}
    >
      <div
        ref={circleRef}
        className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full flex items-center justify-center relative transition-shadow duration-1000 shadow-violet-300/50 shadow-lg bg-gradient-to-r from-violet-400 to-pink-100"
      >
        {/* initial text */}
        <p
          ref={initialTextRef}
          className="text-black font-bold text-base sm:text-lg md:text-xl absolute inset-0 flex items-center text-center"
        >
          SCROLL DOWN
        </p>

        {/* final text */}
        <div
          ref={finalTextRef}
          className="text-center relative flex flex-col items-center justify-center opacity"
        >
          <h1 className="text-black md:w-[10rem] w-[20rem] lg:scale-[0.4] sm:scale-[0.25] scale-[0.07] md:font-bold text-sm sm:text-base leading-none mb-5">
            Turn Ideas into Products.
          </h1>
          <p className="text-black lg:w-[40rem] w-[20rem] absolute sm:mt-3 mt-1 md:scale-[0.1] scale-[0.068]">
            I’m Jefta, a Full-Stack Developer who combines React with a solid backend to deliver fast, dynamic web experiences.
          </p>

          <button
            onClick={openContactForm}
            className="px-10 py-2 rounded-xl bg-black hover:bg-white hover:text-balance transition-all duration-500 scale-[0.1] absolute sm:mt-9 mt-7 text-nowrap"
          >
            Contact Me
          </button>
        </div>
      </div>
      <ContactForm isOpen={contactFormOpen} onClose={closeContactForm} />
    </section>
  );
}
