import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FaFigma, FaCss3Alt, FaHtml5, FaPython, FaWordpress, FaGithub, FaMouse, FaVideo } from 'react-icons/fa';
import { SiCanva, SiTailwindcss, SiFramer, SiFlutter, SiAdobephotoshop, SiAdobeillustrator, SiSupabase, SiNotion } from 'react-icons/si';
import { BiCodeAlt } from 'react-icons/bi';

// Custom node component
const SkillNode = ({ data }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-xl ${data.color} transition-all duration-300 hover:shadow-lg hover:scale-105`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{data.icon}</div>
        <div>
          <div className="font-semibold">{data.label}</div>
          {data.level && (
            <div className="text-xs opacity-70">{data.level}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom category node
const CategoryNode = ({ data }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-xl ${data.color} text-white font-bold text-center transition-all duration-300 hover:shadow-lg`}>
      {data.label}
    </div>
  );
};

// Node types
const nodeTypes = {
  skill: SkillNode,
  category: CategoryNode,
};

const SkillsFlowChart = () => {
  const reactFlowWrapper = useRef(null);

  // Define skills categories and their nodes
  const initialNodes = [
    // Main node
    {
      id: 'main',
      type: 'category',
      position: { x: 350, y: 0 },
      data: { 
        label: 'WHAT I DO', 
        color: 'bg-gradient-to-r from-blue-400 to-purple-400' 
      },
      style: { width: 150, padding: '10px' },
    },
    
    // Category nodes
    {
      id: 'design',
      type: 'category',
      position: { x: 0, y: 150 },
      data: { 
        label: 'Design', 
        color: 'bg-amber-500' 
      },
      style: { width: 120 },
    },
    {
      id: 'ai-nocode',
      type: 'category',
      position: { x: 250, y: 150 },
      data: { 
        label: 'AI & No-Code', 
        color: 'bg-blue-500' 
      },
      style: { width: 150 },
    },
    {
      id: 'frontend',
      type: 'category',
      position: { x: 500, y: 150 },
      data: { 
        label: 'Frontend', 
        color: 'bg-rose-500' 
      },
      style: { width: 120 },
    },
    {
      id: 'additional',
      type: 'category',
      position: { x: 700, y: 150 },
      data: { 
        label: 'Additional Skills', 
        color: 'bg-purple-500' 
      },
      style: { width: 170 },
    },
    
    // Design skills
    {
      id: 'figma',
      type: 'skill',
      position: { x: -50, y: 250 },
      data: { 
        label: 'Figma', 
        icon: <FaFigma className="text-amber-400" />,
        level: 'Proficient',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'design',
    },
    {
      id: 'canva',
      type: 'skill',
      position: { x: 100, y: 250 },
      data: { 
        label: 'Canva', 
        icon: <SiCanva className="text-amber-400" />,
        level: 'Proficient',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'design',
    },
    {
      id: 'illustrator',
      type: 'skill',
      position: { x: -50, y: 350 },
      data: { 
        label: 'Illustrator', 
        icon: <SiAdobeillustrator className="text-amber-400" />,
        level: 'Intermediate',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'design',
    },
    {
      id: 'photoshop',
      type: 'skill',
      position: { x: 100, y: 350 },
      data: { 
        label: 'Photoshop', 
        icon: <SiAdobephotoshop className="text-amber-400" />,
        level: 'Intermediate',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'design',
    },
    {
      id: 'spline',
      type: 'skill',
      position: { x: 25, y: 450 },
      data: { 
        label: 'Spline', 
        icon: <SiFramer className="text-amber-400" />,
        level: 'Intermediate',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'design',
    },
    
    // AI & No-Code skills
    {
      id: 'cursor',
      type: 'skill',
      position: { x: 200, y: 250 },
      data: { 
        label: 'Cursor AI', 
        icon: <FaMouse className="text-blue-400" />,
        level: 'Proficient',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'ai-nocode',
    },
    {
      id: 'framer',
      type: 'skill',
      position: { x: 350, y: 250 },
      data: { 
        label: 'Framer', 
        icon: <SiFramer className="text-blue-400" />,
        level: 'Intermediate',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'ai-nocode',
    },
    {
      id: 'wordpress',
      type: 'skill',
      position: { x: 200, y: 350 },
      data: { 
        label: 'WordPress', 
        icon: <FaWordpress className="text-blue-400" />,
        level: 'Proficient',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'ai-nocode',
    },
    {
      id: 'flutterflow',
      type: 'skill',
      position: { x: 350, y: 350 },
      data: { 
        label: 'FlutterFlow', 
        icon: <BiCodeAlt className="text-blue-400" />,
        level: 'Intermediate',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'ai-nocode',
    },
    {
      id: 'flutter-ai',
      type: 'skill',
      position: { x: 275, y: 450 },
      data: { 
        label: 'Flutter (AI)', 
        icon: <SiFlutter className="text-blue-400" />,
        level: 'Intermediate',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'ai-nocode',
    },
    
    // Frontend skills
    {
      id: 'html',
      type: 'skill',
      position: { x: 450, y: 250 },
      data: { 
        label: 'HTML', 
        icon: <FaHtml5 className="text-rose-400" />,
        level: 'Proficient',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'frontend',
    },
    {
      id: 'css',
      type: 'skill',
      position: { x: 550, y: 250 },
      data: { 
        label: 'CSS', 
        icon: <FaCss3Alt className="text-rose-400" />,
        level: 'Proficient',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'frontend',
    },
    {
      id: 'tailwind',
      type: 'skill',
      position: { x: 500, y: 350 },
      data: { 
        label: 'Tailwind', 
        icon: <SiTailwindcss className="text-rose-400" />,
        level: 'Proficient',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'frontend',
    },
    
    // Additional skills
    {
      id: 'supabase',
      type: 'skill',
      position: { x: 650, y: 250 },
      data: { 
        label: 'Supabase', 
        icon: <SiSupabase className="text-purple-400" />,
        level: 'Intermediate',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'additional',
    },
    {
      id: 'python',
      type: 'skill',
      position: { x: 750, y: 250 },
      data: { 
        label: 'Python', 
        icon: <FaPython className="text-purple-400" />,
        level: 'Intermediate',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'additional',
    },
    {
      id: 'premiere',
      type: 'skill',
      position: { x: 650, y: 350 },
      data: { 
        label: 'Premiere Pro', 
        icon: <FaVideo className="text-purple-400" />,
        level: 'Intermediate',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'additional',
    },
    {
      id: 'github',
      type: 'skill',
      position: { x: 750, y: 350 },
      data: { 
        label: 'GitHub', 
        icon: <FaGithub className="text-purple-400" />,
        level: 'Proficient',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'additional',
    },
    {
      id: 'notion',
      type: 'skill',
      position: { x: 700, y: 450 },
      data: { 
        label: 'Notion', 
        icon: <SiNotion className="text-purple-400" />,
        level: 'Proficient',
        color: 'bg-black/40 backdrop-blur-sm text-white'
      },
      parentNode: 'additional',
    },
  ];

  // Define connections between nodes
  const initialEdges = [
    // Connect main to categories
    {
      id: 'main-design',
      source: 'main',
      target: 'design',
      animated: true,
      style: { stroke: '#f59e0b' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#f59e0b',
      },
    },
    {
      id: 'main-ai',
      source: 'main',
      target: 'ai-nocode',
      animated: true,
      style: { stroke: '#3b82f6' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6',
      },
    },
    {
      id: 'main-frontend',
      source: 'main',
      target: 'frontend',
      animated: true,
      style: { stroke: '#f43f5e' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#f43f5e',
      },
    },
    {
      id: 'main-additional',
      source: 'main',
      target: 'additional',
      animated: true,
      style: { stroke: '#a855f7' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#a855f7',
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Fit view on load
  const onInit = useCallback((reactFlowInstance) => {
    reactFlowInstance.fitView({ padding: 0.2 });
  }, []);

  // Set up auto-fit view on window resize
  useEffect(() => {
    const handleResize = () => {
      // Refresh the nodes to trigger re-layout
      setNodes((prevNodes) => [...prevNodes]);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setNodes]);

  return (
    <div className="w-full h-[80vh] pt-4" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default SkillsFlowChart; 