import React, { useState, useEffect } from 'react';
import SectionWrapper from '../portfolio/components/layout/SectionWrapper';
import useSectionData from '../utils/useSectionData';

export default function ContactSection({ sectionId }) {
  // Always declare all hooks at the top level and in the same order
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitting: false, submitted: false, success: false, message: '' });
  const [content, setContent] = useState(null);
  const { data, loading, error } = useSectionData('contact');

  // Default content if data is not available yet
  const defaultContent = {
    intro: "Have a project in mind or want to say hi? Drop me a line—I'm always open to new challenges.",
    info: [
      { icon: "location", value: "Chennai, Tamil Nadu 600077" },
      { icon: "email", value: "smk.manikandan.dev@gmail.com" },
      { icon: "phone", value: "+91 99403 98023" }
    ],
    social: [
      { platform: "Portfolio", url: "https://manikandanshowcase.vercel.app" },
      { platform: "LinkedIn", url: "" },
      { platform: "GitHub", url: "" },
      { platform: "Dribbble", url: "" },
      { platform: "Medium", url: "" }
    ],
    form_enabled: true
  };

  // Set content based on data
  useEffect(() => {
    setContent(data?.content || defaultContent);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, success: false, message: 'Sending message...' });
    setTimeout(() => {
      setFormStatus({ submitting: false, submitted: true, success: true, message: 'Message sent successfully! I will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  // Get correct icon for contact info
  const getInfoIcon = (iconType) => {
    switch(iconType) {
      case 'location':
        return '📍';
      case 'email':
        return '✉️';
      case 'phone':
        return '📞';
      default:
        return '🔗';
    }
  };

  // Early return for loading state
  if (loading || !content) {
    return (
      <SectionWrapper id="contact">
        <section className="w-full max-w-4xl mx-auto p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </section>
      </SectionWrapper>
    );
  }

  // Filter out social links with empty URLs
  const validSocialLinks = content.social?.filter(item => item.url) || [];

  return (
    <SectionWrapper id="contact">
      <section className="w-full max-w-4xl mx-auto p-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Let's Connect</h2>
        <div className="w-20 h-1 bg-primary mb-8"></div>
        <p className="text-lg mb-8 text-gray-300">
          {content.intro}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Contact Info Grid */}
          <div className="space-y-6">
            {content.info && content.info.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-2xl">{getInfoIcon(item.icon)}</span>
                {item.icon === 'email' ? (
                  <a href={`mailto:${item.value}`} className="text-primary underline">{item.value}</a>
                ) : item.icon === 'phone' ? (
                  <a href={`tel:${item.value.replace(/\s+/g, '')}`} className="text-gray-300">{item.value}</a>
                ) : (
                  <span className="text-gray-300">{item.value}</span>
                )}
              </div>
            ))}
            
            {validSocialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-2xl">🔗</span>
                {validSocialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url} 
                    className="text-primary underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
            
            <a
              href="/Manikandan_S_Resume.pdf"
              download
              className="inline-block mt-4 px-6 py-3 bg-primary text-black font-semibold rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
            >
              Download Resume
            </a>
          </div>
          
          {/* Contact Form */}
          {content.form_enabled && (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 md:p-8 animate-fade-in-up">
              {formStatus.submitted && formStatus.success ? (
                <div className="bg-primary/20 border border-primary rounded-lg p-6 text-white h-full flex flex-col items-center justify-center">
                  <h3 className="text-xl font-semibold mb-4">Thank You!</h3>
                  <p className="text-center">{formStatus.message}</p>
                </div>
              ) : (
                <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={5}
                    required
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-400 resize-none focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className="mt-2 px-6 py-3 bg-primary text-black font-semibold rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {formStatus.submitting ? 'Sending...' : 'Submit'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </SectionWrapper>
  );
} 