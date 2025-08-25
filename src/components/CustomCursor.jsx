import gsap from "gsap";
import { useEffect, useRef } from "react";

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorBorderRef = useRef(null);

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    return null; // Jangan render kursor kustom pada perangkat mobile
  }

  useEffect(() => {
    // get cursor element
    const cursor = cursorRef.current;
    const cursorBorder = cursorBorderRef.current;

    // initial position
    gsap.set([cursor, cursorBorder], { xPercent: -50, yPercent: -50 });

    // variables for cursor position with difrerent speed
    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.3,
      ease: "power3.out",
    });

    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.2,
      ease: "power3.out",
    });

    const xToBorder = gsap.quickTo(cursorBorder, "x", {
      duration: 0.5,
      ease: "power.out",
    });

    const yToBorder = gsap.quickTo(cursorBorder, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    // mouse move handler
    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToBorder(e.clientX);
      yToBorder(e.clientY);
    };

    // add mouse move listener
    window.addEventListener("mousemove", handleMouseMove);

    // ADD CLICK ANIMATION
    document.addEventListener("mousedown", () => {
      gsap.to([cursor, cursorBorder], { scale: 0.6, duration: 0.2 });
    });

    document.addEventListener("mouseup", () => {
      gsap.to([cursor, cursorBorder], { scale: 1, duration: 0.2 });
    });
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-[20px] h-[20px] bg-white rounded-full pointer-events-none z-[999] mix-blend-difference"
      />
      <div
        ref={cursorBorderRef}
        className="fixed top-0 left-0 w-[48px] h-[40px] border rounded-full border-white pointer-events-none z-[999] mix-blend-difference opacity-50"
      />
    </>
  );
};
