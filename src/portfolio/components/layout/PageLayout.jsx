import React from 'react';
import Navbar from './Navbar';
import FooterContactSection from '../../../sections/FooterContactSection';

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#041414]">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <FooterContactSection />
    </div>
  );
};

export default PageLayout; 