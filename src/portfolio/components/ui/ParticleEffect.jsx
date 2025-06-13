import React from 'react';

const ParticleEffect = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-70 bg-gradient-to-br from-gray-900 to-black">
      {/* Simple CSS-based particle effect instead of Three.js */}
      <div className="particle-container">
        {Array(20).fill().map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              '--size': `${Math.random() * 10 + 5}px`,
              '--left': `${Math.random() * 100}%`,
              '--top': `${Math.random() * 100}%`,
              '--animation-delay': `${Math.random() * 5}s`,
              '--animation-duration': `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .particle-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          width: var(--size);
          height: var(--size);
          background: #00FF7F;
          border-radius: 50%;
          left: var(--left);
          top: var(--top);
          opacity: 0.5;
          animation: float var(--animation-duration) infinite ease-in-out;
          animation-delay: var(--animation-delay);
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(ParticleEffect);
