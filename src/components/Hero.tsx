
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-aventura-verde to-aventura-verdeclaro text-white py-20 md:py-32">
      <div 
        className="absolute inset-0 bg-black opacity-40"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "multiply"
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Aventura em Boa Companhia!
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Conectando entusiastas de trilhas, off-road e viagens para compartilhar aventuras e dividir custos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-aventura-laranja hover:bg-amber-600 text-white text-lg py-6 px-8">
              Oferecer Carona
            </Button>
            <Button className="bg-white text-aventura-verde hover:bg-gray-100 text-lg py-6 px-8">
              Encontrar Aventura
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
