import React from "react";
import { Link } from "wouter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="mr-3 text-3xl" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <i className="fas fa-robot"></i>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">AI Teacher Assistant</h1>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            <i className="fas fa-question-circle mr-2"></i>Help
          </button>
          <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            <i className="fas fa-cog mr-2"></i>Settings
          </button>
        </div>
        
        <button 
          className="md:hidden text-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-primary-600">
          <div className="flex flex-col space-y-2">
            <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-left">
              <i className="fas fa-question-circle mr-2"></i>Help
            </button>
            <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-left">
              <i className="fas fa-cog mr-2"></i>Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
