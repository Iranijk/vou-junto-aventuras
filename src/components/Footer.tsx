
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-aventura-verde text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold">Vou Junto</Link>
            <p className="mt-4 text-gray-300">
              Conectando entusiastas de off-road, motociclistas e viajantes para compartilhar trilhas, aventuras e viagens, dividindo custos e experiências.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-white hover:text-gray-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <Twitter size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Início</Link></li>
              <li><Link to="#como-funciona" className="text-gray-300 hover:text-white">Como Funciona</Link></li>
              <li><Link to="#aventuras" className="text-gray-300 hover:text-white">Aventuras</Link></li>
              <li><Link to="#contato" className="text-gray-300 hover:text-white">Contato</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: voujunto@mail.com</li>
              <li className="text-gray-300">Telefone: (67) 9 8116-2674</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} Vou Junto. Todos os direitos reservados.
          </p>
          <p className="text-gray-300 text-sm mt-4 md:mt-0">
            Desenvolvido por Engecom-MS & Irani J. Kucmanski
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
