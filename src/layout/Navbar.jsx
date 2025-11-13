// src/layout/Navbar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    // Added sticky, backdrop-blur, and a subtle bottom border for the glass effect
    <nav className="sticky top-0 z-50 flex justify-between items-center p-6 max-w-7xl mx-auto w-full bg-background/70 backdrop-blur-lg border-b border-border-glow">
      <Link to="/">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-accent via-primary to-secondary text-transparent bg-clip-text">
          Sinux
        </h1>
      </Link>
      <div className="space-x-8 hidden md:flex items-center font-medium text-text-secondary">
        <a href="/agents" className="hover:text-accent transition duration-300">
          Agents
        </a>
        <a
          href="/#features"
          className="hover:text-accent transition duration-300"
        >
          Models
        </a>
        <a
          href="/#features"
          className="hover:text-accent transition duration-300"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="hover:text-accent transition duration-300"
        >
          Pricing
        </a>
        <a
          href="#contact"
          className="hover:text-accent transition duration-300"
        >
          Contact
        </a>
        {/* Added a glow effect to the button */}
        <button className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-secondary transition duration-300 shadow-[0_0_15px_var(--shadow-glow)] hover:shadow-[0_0_25px_var(--shadow-glow)]">
          Get Started
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
