
import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso."
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair do sistema."
      });
    }
  };

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
          <Link to="/encontrar-aventuras" className="hover:text-aventura-areia transition-colors">Buscar Aventuras</Link>
          <Link to="#contato" className="hover:text-aventura-areia transition-colors">Contato</Link>
        </div>

        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white">{user.email}</span>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" /> Sair
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="bg-aventura-laranja hover:bg-amber-600 text-white">
                <User size={16} className="mr-2" /> Entrar / Cadastrar
              </Button>
            </Link>
          )}
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
              to="/encontrar-aventuras" 
              className="hover:text-aventura-areia transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Buscar Aventuras
            </Link>
            <Link 
              to="#contato" 
              className="hover:text-aventura-areia transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            {user ? (
              <>
                <div className="text-white py-2 border-t border-aventura-verdeclaro">
                  {user.email}
                </div>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white w-full"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut size={16} className="mr-2" /> Sair
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-aventura-laranja hover:bg-amber-600 text-white w-full">
                  <User size={16} className="mr-2" /> Entrar / Cadastrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
