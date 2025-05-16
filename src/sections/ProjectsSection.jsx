import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '../utils/supabaseClient';
import TiltCard from '../components/TiltCard';
import ParticleBurst from '../components/ParticleBurst';
import { Parallax } from 'react-scroll-parallax';

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }
      
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }
  
  // If Supabase fetch failed or is empty, use fallback projects
  const fallbackProjects = [
    {
      id: 1,
      title: "Modern E-Commerce Platform",
      description: "A full-featured online store with cart, payments, and admin dashboard",
      image_url: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2089&q=80",
      github_url: "https://github.com",
      project_url: "https://example.com",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      id: 2,
      title: "AI-Powered Task Manager",
      description: "Smart task management with AI prioritization and suggestions",
      image_url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80",
      github_url: "https://github.com",
      project_url: "https://example.com",
      tags: ["Vue.js", "Python", "TensorFlow", "FastAPI"],
    },
    {
      id: 3,
      title: "Realtime Collaboration Tool",
      description: "A collaborative whiteboard with realtime document editing",
      image_url: "https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      github_url: "https://github.com",
      project_url: "https://example.com",
      tags: ["Socket.io", "React", "Node.js", "Redis"],
    },
    {
      id: 4,
      title: "Neural Network Visualizer",
      description: "Interactive tool to visualize deep learning network architecture",
      image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2068&q=80",
      github_url: "https://github.com",
      project_url: "https://example.com",
      tags: ["D3.js", "TensorFlow.js", "React", "Python"],
    },
  ];

  // Use database projects if available, otherwise use fallback
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  
  // Extract all unique tags from projects
  const allTags = ['All', ...new Set(displayProjects.flatMap(project => project.tags || []))];
  
  // Filter projects by selected category
  const filteredProjects = selectedCategory === 'All'
    ? displayProjects
    : displayProjects.filter(project => project.tags && project.tags.includes(selectedCategory));

  return (
    <ParticleBurst>
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <Parallax speed={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore my recent work showcasing my skills in web development, design, and problem-solving
              </p>
            </motion.div>
          </Parallax>
          
          {/* Filter Categories */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {allTags.map((tag, index) => (
              <motion.button
                key={index}
                className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${
                  selectedCategory === tag
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-primary/20'
                }`}
                onClick={() => setSelectedCategory(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
          
          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No projects found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-[420px]"
                >
                  <TiltCard
                    image={project.image_url}
                    title={project.title}
                    description={project.description}
                    links={[
                      ...(project.github_url ? [{ label: 'GitHub', url: project.github_url }] : []),
                      ...(project.project_url ? [{ label: 'Live Demo', url: project.project_url }] : []),
                    ]}
                    tags={project.tags || []}
                    detailContent={
                      <div>
                        <p className="mb-4">{project.description}</p>
                        <p className="mb-4">This project showcases my skills in {project.tags?.join(', ')}.</p>
                        {project.external_file_url && (
                          <p className="mb-4">
                            <a 
                              href={project.external_file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Documentation
                            </a>
                          </p>
                        )}
                      </div>
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </ParticleBurst>
  );
};

export default ProjectsSection;