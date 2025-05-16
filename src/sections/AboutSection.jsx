import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Me</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="w-full max-w-md mx-auto aspect-square rounded-xl overflow-hidden border-2 border-primary/20">
              <img
                src="/assets/profile-image.jpg" 
                alt="Manikandan"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400.png?text=Profile+Image';
                }}
              />
            </div>
            <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-primary rounded-lg -z-10"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-primary">Full Stack Developer & UI/UX Designer</h3>
            <p className="text-gray-300 mb-6">
              I'm a passionate developer who loves creating beautiful, functional, and user-centered digital experiences. 
              With a strong foundation in both front-end and back-end development, I build complete web applications 
              from concept to deployment.
            </p>
            <p className="text-gray-300 mb-6">
              My approach combines technical expertise with creative problem-solving. 
              I believe in clean code, intuitive user interfaces, and staying on top of the latest web technologies.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2">
                  <span className="text-primary font-semibold">Name:</span> Manikandan
                </p>
                <p className="mb-2">
                  <span className="text-primary font-semibold">Email:</span> your.email@example.com
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <span className="text-primary font-semibold">Location:</span> Chennai, India
                </p>
                <p className="mb-2">
                  <span className="text-primary font-semibold">Available:</span> For freelance & full-time
                </p>
              </div>
            </div>

            <a 
              href="#contact" 
              className="inline-block mt-6 px-6 py-3 bg-primary text-background font-medium rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
            >
              Let's Talk
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 