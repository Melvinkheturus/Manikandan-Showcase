import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaFigma, FaCss3Alt, FaHtml5, FaPython, FaWordpress, FaGithub, FaMouse, FaVideo } from 'react-icons/fa';
import { SiCanva, SiTailwindcss, SiFramer, SiFlutter, SiAdobephotoshop, SiAdobeillustrator, SiSupabase, SiNotion } from 'react-icons/si';
import { BiCodeAlt } from 'react-icons/bi';

gsap.registerPlugin(ScrollTrigger);

const skills = {
  Design: [
    { icon: <FaFigma />, name: 'Figma' },
    { icon: <SiCanva />, name: 'Canva' },
    { icon: <SiAdobeillustrator />, name: 'Illustrator' },
    { icon: <SiAdobephotoshop />, name: 'Photoshop' },
    { icon: <SiFramer />, name: 'Spline' },
  ],
  'AI & No-Code Tools': [
    { icon: <FaMouse />, name: 'Cursor AI' },
    { icon: <SiFramer />, name: 'Framer' },
    { icon: <FaWordpress />, name: 'WordPress' },
    { icon: <BiCodeAlt />, name: 'FlutterFlow' },
    { icon: <SiFlutter />, name: 'Flutter (AI)' },
  ],
  Frontend: [
    { icon: <FaHtml5 />, name: 'HTML' },
    { icon: <FaCss3Alt />, name: 'CSS' },
    { icon: <SiTailwindcss />, name: 'Tailwind' },
  ],
  'Additional Skills': [
    { icon: <SiSupabase />, name: 'Supabase' },
    { icon: <FaPython />, name: 'Python' },
    { icon: <FaVideo />, name: 'Premiere Pro' },
    { icon: <FaGithub />, name: 'GitHub' },
    { icon: <SiNotion />, name: 'Notion' },
  ],
};

export default function WhatIDoSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.branch-line', {
        height: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-transparent text-white relative overflow-hidden">
      <div className="text-center text-4xl md:text-5xl font-bold mb-16">
        WHAT I <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">DO</span>
      </div>

      <div className="flex flex-wrap justify-center gap-12 px-4 max-w-6xl mx-auto">
        {Object.entries(skills).map(([category, icons], idx) => (
          <div key={idx} className="text-center">
            <motion.div
              className="text-xl font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {category}
            </motion.div>

            <div className="relative">
              <div className="absolute top-0 left-1/2 w-1 h-full bg-cyan-500 branch-line transform -translate-x-1/2"></div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {icons.map((skill, i) => (
                  <motion.div
                    key={i}
                    className="group relative flex flex-col items-center gap-2 p-4 rounded-xl bg-black/40 hover:bg-black/60 transition duration-300 backdrop-blur-md shadow-lg hover:scale-105 hover:shadow-cyan-500/50"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <div className="text-3xl text-cyan-400 group-hover:text-cyan-300">
                      {skill.icon}
                    </div>
                    <div className="text-sm text-white/80">{skill.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 