
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-aventura-verde text-white py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">Vou Junto</Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-aventura-areia transition-colors">Início</Link>
          <Link to="#como-funciona" className="hover:text-aventura-areia transition-colors">Como Funciona</Link>
          <Link to="#aventuras" className="hover:text-aventura-areia transition-colors">Aventuras</Link>
          <Link to="#contato" className="hover:text-aventura-areia transition-colors">Contato</Link>
        </div>

        <div className="hidden md:block">
          <Button className="bg-aventura-laranja hover:bg-amber-600 text-white">
            Entrar / Cadastrar
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-aventura-verde py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="hover:text-aventura-areia transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="#como-funciona" 
              className="hover:text-aventura-areia transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Como Funciona
            </Link>
            <Link 
              to="#aventuras" 
              className="hover:text-aventura-areia transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Aventuras
            </Link>
            <Link 
              to="#contato" 
              className="hover:text-aventura-areia transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Button className="bg-aventura-laranja hover:bg-amber-600 text-white w-full">
              Entrar / Cadastrar
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
