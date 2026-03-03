import React from "react";
import { SpecFooter } from "../layout/Footer";
import { Features } from "../components/Landing/Features";
import { Hero } from "../components/Landing/Hero";

function Home() {
  return (
    <div className="w-full">
      <main className="max-w-[1400px] mx-auto px-8 w-full">
        <Hero />
        <Features />
        <SpecFooter />
      </main>
    </div>
  );
}

export default Home;
