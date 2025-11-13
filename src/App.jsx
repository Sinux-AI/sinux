import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";

// You can create a simple Footer component too
const Footer = () => (
  <footer className="bg-background p-6 text-center text-text-secondary">
    &copy; {new Date().getFullYear()} Sinux. All rights reserved.
  </footer>
);

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Child routes will be rendered here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
