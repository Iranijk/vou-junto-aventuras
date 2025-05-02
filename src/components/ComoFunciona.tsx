
import React from 'react';
import { Car, Users, Calendar, Map } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105">
      <div className="bg-aventura-verde rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <Icon size={32} className="text-white" />
      </div>
      <h3 className="text-xl font-semibold text-aventura-verde text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

const ComoFunciona = () => {
  const features = [
    {
      icon: Car,
      title: "Oferecer Carona",
      description: "Proprietários de veículos podem cadastrar viagens e trilhas, dividindo custos e convidando outros a participar."
    },
    {
      icon: Users,
      title: "Aventuras Compartilhadas",
      description: "Viaje junto, mesmo sem veículo, encontrando aventuras que combinam com seu perfil e localização."
    },
    {
      icon: Calendar,
      title: "Clubes e Eventos",
      description: "Clubes podem cadastrar eventos, convidando automaticamente todos os sócios para trilhas e aventuras."
    },
    {
      icon: Map,
      title: "Explorar Região",
      description: "Encontre eventos, trilhas e companheiros de aventura próximos por cidade, estrada ou CEP."
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-aventura-verde mb-4">Como Funciona</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma conecta aventureiros com interesses semelhantes para experiências inesquecíveis
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;
