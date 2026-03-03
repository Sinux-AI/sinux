import React, { useEffect, useRef, useState } from "react";

const Cursor = () => {
  const cursorRef = useRef(null);
  const cursorTrailRef = useRef(null);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    let animationFrameId;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    // Smooth trail animation loop
    const renderTrail = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      if (cursorTrailRef.current) {
        cursorTrailRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(renderTrail);
    };
    animationFrameId = requestAnimationFrame(renderTrail);

    const handlePointerState = (e) => {
      const clickableStyle = window.getComputedStyle(e.target).cursor === "pointer";
      const isButtonOrLink = e.target.closest('button') || e.target.closest('a');
      setIsClickable(clickableStyle || isButtonOrLink);
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (cursorTrailRef.current) cursorTrailRef.current.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
      if (cursorTrailRef.current) cursorTrailRef.current.style.opacity = "0.5";
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handlePointerState);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handlePointerState);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <>
      {/* Outer blurred trailing ring */}
      <div
        ref={cursorTrailRef}
        className={`fixed top-0 left-0 w-12 h-12 -ml-6 -mt-6 rounded-full pointer-events-none z-[9998] opacity-50 transition-all duration-300 ${isClickable ? "bg-primary/20 scale-150 blur-xl" : "bg-white/10 blur-sm scale-100"}`}
        style={{ backfaceVisibility: "hidden" }}
      />
      {/* Inner sharp dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full pointer-events-none z-[9999] transition-all duration-150 mix-blend-screen ${isClickable ? "bg-primary scale-50" : "bg-white"}`}
        style={{ backfaceVisibility: "hidden", boxShadow: isClickable ? "0 0 10px #9D4EDD" : "0 0 5px white" }}
      />
    </>
  );
};

export default Cursor;
