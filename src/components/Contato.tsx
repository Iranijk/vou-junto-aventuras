
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contato = () => {
  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-aventura-verde mb-4">Entre em Contato</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dúvidas, sugestões ou parcerias? Fale conosco!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <Input id="nome" placeholder="Seu nome" className="w-full" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input id="email" type="email" placeholder="seu@email.com" className="w-full" />
                </div>
              </div>
              
              <div>
                <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <Input id="assunto" placeholder="Assunto da mensagem" className="w-full" />
              </div>
              
              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <Textarea id="mensagem" placeholder="Digite sua mensagem..." className="w-full h-32" />
              </div>
              
              <Button className="bg-aventura-verde hover:bg-aventura-verdeclaro text-white w-full py-6">
                Enviar Mensagem
              </Button>
            </form>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-aventura-verde mb-6">Informações de Contato</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail size={24} className="text-aventura-laranja mr-4 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800">Email</h4>
                  <a href="mailto:voujunto@mail.com" className="text-aventura-verde hover:text-aventura-verdeclaro">
                    voujunto@mail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone size={24} className="text-aventura-laranja mr-4 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800">Telefone/WhatsApp</h4>
                  <a href="tel:+5567981162674" className="text-aventura-verde hover:text-aventura-verdeclaro">
                    (67) 9 8116-2674
                  </a>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mt-8">
                <p className="text-gray-600 italic">
                  "Nossa missão é conectar pessoas e criar experiências inesquecíveis através de aventuras compartilhadas"
                </p>
                <p className="text-gray-800 font-medium mt-2">
                  - Equipe Vou Junto
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contato;
