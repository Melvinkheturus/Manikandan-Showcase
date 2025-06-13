import React from 'react';
import { MarkerType } from 'reactflow';
import { FaFigma, FaCss3Alt, FaHtml5, FaPython, FaWordpress, FaGithub, FaMouse, FaVideo } from 'react-icons/fa';
import { SiCanva, SiTailwindcss, SiFramer, SiFlutter, SiAdobephotoshop, SiAdobeillustrator, SiSupabase, SiNotion } from 'react-icons/si';
import { BiCodeAlt } from 'react-icons/bi';

// Define badge levels and their colors with enhanced visual properties
export const badgeLevels = {
  'Learning': { 
    color: 'bg-blue-400 border-2 border-blue-300', 
    pulsing: true,
    description: 'Currently learning' 
  },
  'Beginner': { 
    color: 'bg-blue-500', 
    pulsing: false,
    description: 'Basic understanding' 
  },
  'Intermediate': { 
    color: 'bg-green-500', 
    pulsing: false,
    description: 'Comfortable working with it' 
  },
  'Advanced': { 
    color: 'bg-purple-500', 
    pulsing: false,
    shimmer: true,
    description: 'Strong proficiency' 
  },
  'Expert': { 
    color: 'bg-amber-500', 
    pulsing: false,
    shimmer: true,
    glow: true,
    description: 'Deep expertise and mastery' 
  },
  'AI-Assisted': { 
    color: 'bg-gradient-to-r from-cyan-500 to-blue-500', 
    pulsing: true, 
    shimmer: true,
    description: 'Using AI tools for enhanced productivity' 
  }
};

// Node positions
const MAIN_X = 400;
const MAIN_Y = 50;
const CATEGORY_Y = 180;
const SKILL_START_Y = 300;
const SKILL_Y_GAP = 100;

// Width distribution for categories
const categoryPositions = {
  'design': { x: 100, width: 200 },
  'ai-nocode': { x: 350, width: 200 },
  'frontend': { x: 600, width: 150 },
  'additional': { x: 800, width: 200 }
};

// Define the initial nodes
export const initialNodes = [
  // Main node
  {
    id: 'main',
    type: 'categoryNode',
    position: { x: MAIN_X, y: MAIN_Y },
    data: { 
      label: 'WHAT I DO', 
      color: 'from-blue-400 to-purple-400',
      isMainNode: true,
      revealed: true
    }
  },
  
  // Category nodes
  {
    id: 'design',
    type: 'categoryNode',
    position: { x: categoryPositions.design.x, y: CATEGORY_Y },
    data: { 
      label: 'Design',
      color: 'from-amber-500 to-yellow-500',
      icon: <FaFigma />,
      description: 'Creating visual experiences'
    }
  },
  {
    id: 'ai-nocode',
    type: 'categoryNode',
    position: { x: categoryPositions['ai-nocode'].x, y: CATEGORY_Y },
    data: { 
      label: 'AI & No-Code',
      color: 'from-blue-500 to-cyan-500',
      icon: <FaMouse />,
      description: 'Leveraging automation tools'
    }
  },
  {
    id: 'frontend',
    type: 'categoryNode',
    position: { x: categoryPositions.frontend.x, y: CATEGORY_Y },
    data: { 
      label: 'Frontend',
      color: 'from-rose-500 to-pink-500',
      icon: <FaHtml5 />,
      description: 'Building web interfaces'
    }
  },
  {
    id: 'additional',
    type: 'categoryNode',
    position: { x: categoryPositions.additional.x, y: CATEGORY_Y },
    data: { 
      label: 'Additional Skills',
      color: 'from-purple-500 to-violet-500',
      icon: <BiCodeAlt />,
      description: 'Complementary abilities'
    }
  },
  
  // Design skills
  {
    id: 'figma',
    type: 'skillNode',
    position: { x: categoryPositions.design.x - 50, y: SKILL_START_Y },
    data: { 
      label: 'Figma', 
      icon: <FaFigma />,
      level: 'Expert',
      category: 'design',
      description: 'UI/UX design, prototyping, and collaboration',
      animationDelay: 0.1
    }
  },
  {
    id: 'canva',
    type: 'skillNode',
    position: { x: categoryPositions.design.x + 50, y: SKILL_START_Y },
    data: { 
      label: 'Canva', 
      icon: <SiCanva />,
      level: 'Advanced',
      category: 'design',
      description: 'Quick graphics and social media content',
      animationDelay: 0.2
    }
  },
  {
    id: 'illustrator',
    type: 'skillNode',
    position: { x: categoryPositions.design.x - 50, y: SKILL_START_Y + SKILL_Y_GAP },
    data: { 
      label: 'Illustrator', 
      icon: <SiAdobeillustrator />,
      level: 'Intermediate',
      category: 'design',
      description: 'Vector graphics and illustrations',
      animationDelay: 0.3
    }
  },
  {
    id: 'photoshop',
    type: 'skillNode',
    position: { x: categoryPositions.design.x + 50, y: SKILL_START_Y + SKILL_Y_GAP },
    data: { 
      label: 'Photoshop', 
      icon: <SiAdobephotoshop />,
      level: 'Intermediate',
      category: 'design',
      description: 'Image editing and manipulation',
      animationDelay: 0.4
    }
  },
  {
    id: 'spline',
    type: 'skillNode',
    position: { x: categoryPositions.design.x, y: SKILL_START_Y + (SKILL_Y_GAP * 2) },
    data: { 
      label: 'Spline', 
      icon: <SiFramer />,
      level: 'Intermediate',
      category: 'design',
      description: '3D design for web interfaces',
      animationDelay: 0.5
    }
  },
  
  // AI & No-Code skills
  {
    id: 'cursor',
    type: 'skillNode',
    position: { x: categoryPositions['ai-nocode'].x - 50, y: SKILL_START_Y },
    data: { 
      label: 'Cursor AI', 
      icon: <FaMouse />,
      level: 'AI-Assisted',
      category: 'ai-nocode',
      description: 'AI-assisted coding and development',
      animationDelay: 0.1
    }
  },
  {
    id: 'framer',
    type: 'skillNode',
    position: { x: categoryPositions['ai-nocode'].x + 50, y: SKILL_START_Y },
    data: { 
      label: 'Framer', 
      icon: <SiFramer />,
      level: 'Intermediate',
      category: 'ai-nocode',
      description: 'Interactive prototyping and design',
      animationDelay: 0.2
    }
  },
  {
    id: 'wordpress',
    type: 'skillNode',
    position: { x: categoryPositions['ai-nocode'].x - 50, y: SKILL_START_Y + SKILL_Y_GAP },
    data: { 
      label: 'WordPress', 
      icon: <FaWordpress />,
      level: 'Advanced',
      category: 'ai-nocode',
      description: 'CMS and website building',
      animationDelay: 0.3
    }
  },
  {
    id: 'flutterflow',
    type: 'skillNode',
    position: { x: categoryPositions['ai-nocode'].x + 50, y: SKILL_START_Y + SKILL_Y_GAP },
    data: { 
      label: 'FlutterFlow', 
      icon: <BiCodeAlt />,
      level: 'Intermediate',
      category: 'ai-nocode',
      description: 'Visual app development with Flutter',
      animationDelay: 0.4
    }
  },
  {
    id: 'flutter-ai',
    type: 'skillNode',
    position: { x: categoryPositions['ai-nocode'].x, y: SKILL_START_Y + (SKILL_Y_GAP * 2) },
    data: { 
      label: 'Flutter (AI)', 
      icon: <SiFlutter />,
      level: 'AI-Assisted',
      category: 'ai-nocode',
      description: 'Using AI for Flutter development',
      animationDelay: 0.5
    }
  },
  
  // Frontend skills
  {
    id: 'html',
    type: 'skillNode',
    position: { x: categoryPositions.frontend.x - 50, y: SKILL_START_Y },
    data: { 
      label: 'HTML', 
      icon: <FaHtml5 />,
      level: 'Expert',
      category: 'frontend',
      description: 'Structure and semantics',
      animationDelay: 0.1
    }
  },
  {
    id: 'css',
    type: 'skillNode',
    position: { x: categoryPositions.frontend.x + 50, y: SKILL_START_Y },
    data: { 
      label: 'CSS', 
      icon: <FaCss3Alt />,
      level: 'Expert',
      category: 'frontend',
      description: 'Styling and responsive design',
      animationDelay: 0.2
    }
  },
  {
    id: 'tailwind',
    type: 'skillNode',
    position: { x: categoryPositions.frontend.x, y: SKILL_START_Y + SKILL_Y_GAP },
    data: { 
      label: 'Tailwind', 
      icon: <SiTailwindcss />,
      level: 'Advanced',
      category: 'frontend',
      description: 'Utility-first CSS framework',
      animationDelay: 0.3
    }
  },
  
  // Additional skills
  {
    id: 'supabase',
    type: 'skillNode',
    position: { x: categoryPositions.additional.x - 50, y: SKILL_START_Y },
    data: { 
      label: 'Supabase', 
      icon: <SiSupabase />,
      level: 'Intermediate',
      category: 'additional',
      description: 'Backend-as-a-Service platform',
      animationDelay: 0.1
    }
  },
  {
    id: 'python',
    type: 'skillNode',
    position: { x: categoryPositions.additional.x + 50, y: SKILL_START_Y },
    data: { 
      label: 'Python', 
      icon: <FaPython />,
      level: 'Intermediate',
      category: 'additional',
      description: 'Automation and data processing',
      animationDelay: 0.2
    }
  },
  {
    id: 'premiere',
    type: 'skillNode',
    position: { x: categoryPositions.additional.x - 50, y: SKILL_START_Y + SKILL_Y_GAP },
    data: { 
      label: 'Premiere Pro', 
      icon: <FaVideo />,
      level: 'Intermediate',
      category: 'additional',
      description: 'Video editing and production',
      animationDelay: 0.3
    }
  },
  {
    id: 'github',
    type: 'skillNode',
    position: { x: categoryPositions.additional.x + 50, y: SKILL_START_Y + SKILL_Y_GAP },
    data: { 
      label: 'GitHub', 
      icon: <FaGithub />,
      level: 'Advanced',
      category: 'additional',
      description: 'Version control and collaboration',
      animationDelay: 0.4
    }
  },
  {
    id: 'notion',
    type: 'skillNode',
    position: { x: categoryPositions.additional.x, y: SKILL_START_Y + (SKILL_Y_GAP * 2) },
    data: { 
      label: 'Notion', 
      icon: <SiNotion />,
      level: 'Advanced',
      category: 'additional',
      description: 'Project management and documentation',
      animationDelay: 0.5
    }
  }
];

// Category colors for edges
const categoryColors = {
  'design': '#f59e0b',
  'ai-nocode': '#3b82f6',
  'frontend': '#f43f5e',
  'additional': '#a855f7'
};

// Create initial edges array
export const initialEdges = [
  // Main to categories
  {
    id: 'main-to-design',
    source: 'main',
    target: 'design',
    style: { stroke: categoryColors.design, strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: categoryColors.design,
    },
    animated: false,
    type: 'straight',
  },
  {
    id: 'main-to-ai-nocode',
    source: 'main',
    target: 'ai-nocode',
    style: { stroke: categoryColors['ai-nocode'], strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: categoryColors['ai-nocode'],
    },
    animated: false,
  },
  {
    id: 'main-to-frontend',
    source: 'main',
    target: 'frontend',
    style: { stroke: categoryColors.frontend, strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: categoryColors.frontend,
    },
    animated: false,
  },
  {
    id: 'main-to-additional',
    source: 'main',
    target: 'additional',
    style: { stroke: categoryColors.additional, strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: categoryColors.additional,
    },
    animated: false,
  },
  
  // Design category to skills
  {
    id: 'design-to-figma',
    source: 'design',
    target: 'figma',
    style: { stroke: categoryColors.design },
    animated: false,
  },
  {
    id: 'design-to-canva',
    source: 'design',
    target: 'canva',
    style: { stroke: categoryColors.design },
    animated: false,
  },
  {
    id: 'design-to-illustrator',
    source: 'design',
    target: 'illustrator',
    style: { stroke: categoryColors.design },
    animated: false,
  },
  {
    id: 'design-to-photoshop',
    source: 'design',
    target: 'photoshop',
    style: { stroke: categoryColors.design },
    animated: false,
  },
  {
    id: 'design-to-spline',
    source: 'design',
    target: 'spline',
    style: { stroke: categoryColors.design },
    animated: false,
  },
  
  // AI & No-Code category to skills
  {
    id: 'ai-nocode-to-cursor',
    source: 'ai-nocode',
    target: 'cursor',
    style: { stroke: categoryColors['ai-nocode'] },
    animated: false,
  },
  {
    id: 'ai-nocode-to-framer',
    source: 'ai-nocode',
    target: 'framer',
    style: { stroke: categoryColors['ai-nocode'] },
    animated: false,
  },
  {
    id: 'ai-nocode-to-wordpress',
    source: 'ai-nocode',
    target: 'wordpress',
    style: { stroke: categoryColors['ai-nocode'] },
    animated: false,
  },
  {
    id: 'ai-nocode-to-flutterflow',
    source: 'ai-nocode',
    target: 'flutterflow',
    style: { stroke: categoryColors['ai-nocode'] },
    animated: false,
  },
  {
    id: 'ai-nocode-to-flutter-ai',
    source: 'ai-nocode',
    target: 'flutter-ai',
    style: { stroke: categoryColors['ai-nocode'] },
    animated: false,
  },
  
  // Frontend category to skills
  {
    id: 'frontend-to-html',
    source: 'frontend',
    target: 'html',
    style: { stroke: categoryColors.frontend },
    animated: false,
  },
  {
    id: 'frontend-to-css',
    source: 'frontend',
    target: 'css',
    style: { stroke: categoryColors.frontend },
    animated: false,
  },
  {
    id: 'frontend-to-tailwind',
    source: 'frontend',
    target: 'tailwind',
    style: { stroke: categoryColors.frontend },
    animated: false,
  },
  
  // Additional category to skills
  {
    id: 'additional-to-supabase',
    source: 'additional',
    target: 'supabase',
    style: { stroke: categoryColors.additional },
    animated: false,
  },
  {
    id: 'additional-to-python',
    source: 'additional',
    target: 'python',
    style: { stroke: categoryColors.additional },
    animated: false,
  },
  {
    id: 'additional-to-premiere',
    source: 'additional',
    target: 'premiere',
    style: { stroke: categoryColors.additional },
    animated: false,
  },
  {
    id: 'additional-to-github',
    source: 'additional',
    target: 'github',
    style: { stroke: categoryColors.additional },
    animated: false,
  },
  {
    id: 'additional-to-notion',
    source: 'additional',
    target: 'notion',
    style: { stroke: categoryColors.additional },
    animated: false,
  },
]; 