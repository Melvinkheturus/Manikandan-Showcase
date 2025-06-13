import { FaFigma, FaCss3Alt, FaHtml5, FaPython, FaWordpress, FaGithub, FaMouse, FaVideo } from 'react-icons/fa';
import { SiCanva, SiTailwindcss, SiFramer, SiFlutter, SiAdobephotoshop, SiAdobeillustrator, SiSupabase, SiNotion } from 'react-icons/si';
import { BiCodeAlt } from 'react-icons/bi';

export const skillsData = {
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