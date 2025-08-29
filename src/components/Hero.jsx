// components/Hero.jsx
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";

export default function Hero() {
  return (
    <section 
      id="home" 
      className="relative min-h-[100svh] bg-gradient-to-b from-violet-900 to-black overflow-hidden"
    >
      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

      {/* Main content container */}
      <div className="mx-auto w-full max-w-[1760px] px-4 lg:pl-40 py-16 md:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          
          {/* Text content - Left side */}
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
              className="font-extrabold tracking-tight text-white text-[clamp(2.5rem,6.5vw,6.5rem)] leading-[1.05]"
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
              className="mt-6 text-purple-200/90 text-[clamp(1rem,1.2vw+0.75rem,1.35rem)] max-w-3xl mx-auto lg:mx-0"
            >
              Expert in Next.js, MERN, and modern frameworks to deliver reliable digital solutions
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 40,
                damping: 25,
                delay: 2.3,
              }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a 
                href="#project" 
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                View My Work
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3 border-2 border-purple-400 text-purple-400 rounded-full font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300"
              >
                Get In Touch
              </a>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 1 }}
              className="mt-12 flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              {['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS'].map((tech, index) => (
                <motion.span 
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.8 + (index * 0.1) }}
                  className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-sm text-gray-300"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Spline 3D Model - Right side */}
          <div className="order-1 lg:order-2 lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 30,
                damping: 20,
                delay: 0.5,
              }}
              className="relative ml-auto w-full h-[75vh] min-h-[520px] lg:min-h-[640px] xl:min-h-[720px] max-w-none lg:translate-x-2 scale-[1.15] md:scale-[1.2] xl:scale-[1.25] origin-center"
            >
              <Spline
                style={{ width: "100%", height: "100%" }}
                scene="https://prod.spline.design/TWpnobRcf89KJxRT/scene.splinecode"
                aria-hidden
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}