import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [angle, setAngle] = useState(0);
  const [hidden, setHidden] = useState(true);
  const [particles, setParticles] = useState([]);
  
  const lastPos = useRef({ x: 0, y: 0 });
  const lastSpawnPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);

      // 1. Calculate direction angle to rotate the pointer sprout
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const rad = Math.atan2(dy, dx);
        const deg = (rad * 180) / Math.PI + 90;
        setAngle(deg);
      }
      lastPos.current = { x: e.clientX, y: e.clientY };

      // 2. Spawn growing grass/sprout particles
      const dist = Math.hypot(e.clientX - lastSpawnPos.current.x, e.clientY - lastSpawnPos.current.y);
      if (dist > 35) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          scale: Math.random() * 0.4 + 0.6,
          rotation: Math.random() * 30 - 15,
          type: Math.random() > 0.4 ? 'sprout' : 'grass',
          time: Date.now()
        };
        setParticles((prev) => [...prev, newParticle].slice(-25)); // Cap at 25 particles max for performance
        lastSpawnPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Frame loop to animate trail position & clean up old particles
  useEffect(() => {
    let animationFrameId;
    
    const updateLoop = () => {
      // Smooth out the trail coordinates
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12,
        };
      });

      // Clear particles older than 1.2s
      const now = Date.now();
      setParticles((prev) => prev.filter((p) => now - p.time < 1200));

      animationFrameId = requestAnimationFrame(updateLoop);
    };
    
    animationFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  useEffect(() => {
    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    const attachListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, select, input, .stage-card, .track-card, .toggle-btn, .sms-bubble, .reading-box, .limits-table-light tr'
      );
      
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    attachListeners();
    
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const interactiveElements = document.querySelectorAll(
        'a, button, select, input, .stage-card, .track-card, .toggle-btn, .sms-bubble, .reading-box, .limits-table-light tr'
      );
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* Growing grass particles trail */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="grass-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `translate(-50%, -100%) scale(${p.scale}) rotate(${p.rotation}deg)`
          }}
        >
          {p.type === 'sprout' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20C12 16 9 12 12 8C15 12 12 16 12 20Z" fill="#34d399" />
              <path d="M12 14C9.5 13 7.5 10 8.5 8C10 7 12.5 9 12 14Z" fill="#10b981" />
              <path d="M12 20V7" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 20C9 15 9 10 11 4C10 10 10 15 11 20" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
              <path d="M18 20C15 15 14 10 12 4C13 10 13 15 12 20" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}

      {/* Sprout pointer */}
      <div 
        className={`custom-cursor-sprout ${isHovered ? 'hovered' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 17 9 12 12 7C15 12 12 17 12 22Z" fill="#10b981" />
          <path d="M12 14C8.5 13 6 10 7.5 7.5C10 6 13 8.5 12 14Z" fill="#34d399" />
          <path d="M12 14C5.5 13 18 10 16.5 7.5C14 6 11 8.5 12 14Z" fill="#059669" />
          <path d="M12 22V6" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Rotating organic leaf-like trailing circle */}
      <div 
        className={`custom-cursor-leaf-trail ${isHovered ? 'hovered' : ''}`}
        style={{ 
          left: `${trail.x}px`, 
          top: `${trail.y}px` 
        }}
      />
    </>
  );
};

export default CustomCursor;
