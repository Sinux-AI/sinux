// src/pages/Home.jsx
import heroImage from "../assets/hero-image.png";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto p-6 md:py-24 space-y-12 md:space-y-0">
        {/* Text */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-extrabold leading-tight">
            The Future is Here.
            <br />
            Welcome to{" "}
            <span className="bg-gradient-to-r from-accent via-primary to-secondary text-transparent bg-clip-text">
              Sinux
            </span>
          </h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-md mx-auto md:mx-0">
            The ultimate AI operating system — empower your workflows, customize
            models, and automate tasks seamlessly.
          </p>
          <div className="flex space-x-4 justify-center md:justify-start">
            {/* --- Button with Glow Effect --- */}
            <button className="bg-primary text-white font-semibold px-7 py-3 rounded-lg hover:bg-secondary transition duration-300 transform hover:scale-105 shadow-[0_0_20px_var(--shadow-glow)] hover:shadow-[0_0_30px_var(--shadow-glow)]">
              Get Started
            </button>
            {/* --- Ghost Button with Glow on Hover --- */}
            <button className="border border-border-glow text-text-secondary font-semibold px-7 py-3 rounded-lg hover:border-accent hover:text-accent transition duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image with Integrated Glow */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative">
            <img
              src={heroImage}
              alt="Sinux AI OS illustration"
              className="w-full max-w-lg rounded-xl z-10"
            />
            {/* This div creates the background glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-primary/30 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <h3 className="text-4xl md:text-5xl font-bold text-center">
            Powerful Features, Limitless Potential
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* --- New Aurora Card Style --- */}
            <div className="bg-surface backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-border-glow hover:border-accent/50 hover:-translate-y-2 transition-all duration-300">
              <h4 className="font-semibold text-2xl text-accent mb-3">
                Custom AI Models
              </h4>
              <p className="text-text-secondary">
                Create and personalize your AI models with ease, and integrate
                them directly into your workflows.
              </p>
            </div>
            <div className="bg-surface backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-border-glow hover:border-accent/50 hover:-translate-y-2 transition-all duration-300">
              <h4 className="font-semibold text-2xl text-accent mb-3">
                Seamless API Access
              </h4>
              <p className="text-text-secondary">
                Generate API keys and use Sinux agents programmatically in your
                own applications.
              </p>
            </div>
            <div className="bg-surface backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-border-glow hover:border-accent/50 hover:-translate-y-2 transition-all duration-300">
              <h4 className="font-semibold text-2xl text-accent mb-3">
                Flexible Freemium Model
              </h4>
              <p className="text-text-secondary">
                Start for free with limited access or upgrade for premium
                features and full AI capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
