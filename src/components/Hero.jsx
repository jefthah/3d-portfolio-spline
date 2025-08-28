// components/Hero.jsx

import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] bg-gradient-to-b from-violet-900 to-black overflow-visible overflow: hidden;">
      {/* ...glow & vignette tetap... */}

      {/* 1) LEBARKAN KANVAS */}
      <div className="mx-auto w-full max-w-[1760px] px-4 lg:pl-40 py-16 md:py-24">
        {/* 2) BESARKAN PORSI KANAN */}
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* TEKS */}
          <div className="order-2 lg:order-1 lg:col-span-5 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 40,
                damping: 25,
                delay: 1.3,
              }}
              className="font-extrabold tracking-tight text-white
                     text-[clamp(2.5rem,6.5vw,6.5rem)] leading-[1.05]"
            >
              Full-Stack Development 
              <br /> with Precision
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 40,
                damping: 25,
                delay: 1.8,
              }}
              className="mt-6 text-purple-200/90 text-[clamp(1rem,1.2vw+0.75rem,1.35rem)]
                     max-w-3xl mx-auto lg:mx-0"
            >
              Expert in Next.js, MERN, and modern frameworks to deliver reliable digital solutions
            </motion.p>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7 relative">
            <div
              className="relative ml-auto w-full
                     h-[75vh] min-h-[520px] lg:min-h-[640px] xl:min-h-[720px]
                     max-w-none lg:translate-x-2
                     scale-[1.15] md:scale-[1.2] xl:scale-[1.25] origin-center"
            >
              <Spline
                style={{ width: "100%", height: "100%" }}
                scene="https://prod.spline.design/TWpnobRcf89KJxRT/scene.splinecode"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
