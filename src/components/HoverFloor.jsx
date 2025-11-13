export default function HoverFloor() {
  return (
    <div className="relative h-screen w-full bg-[var(--color-background)] overflow-hidden flex items-center justify-center">
      {/* Subtle 3D Floor */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200vw] h-[100vh]
        bg-[radial-gradient(ellipse_at_center,rgba(79,93,255,0.12)_0%,transparent_70%)]
        [transform:perspective(800px)_rotateX(70deg)]
        shadow-[0_0_80px_rgba(79,93,255,0.15)]
        opacity-90"
      />

      {/* Gentle floor glow aura */}
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(79,93,255,0.25)_0%,rgba(213,61,255,0.15)_50%,transparent_100%)] opacity-70"></div>

      {/* Hover area for agents/models */}
      <div className="relative z-10 w-full flex items-center justify-center">
     
      </div>
    </div>
  );
}
