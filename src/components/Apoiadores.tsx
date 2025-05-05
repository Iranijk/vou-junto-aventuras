
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Apoiadores = () => {
  // Placeholder data for sponsors/supporters
  const apoiadores = [
    { id: 1, name: "Apoiador 1", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&h=350&fit=crop" },
    { id: 2, name: "Apoiador 2", image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=500&h=350&fit=crop" },
    { id: 3, name: "Apoiador 3", image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=500&h=350&fit=crop" },
    { id: 4, name: "Apoiador 4", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=500&h=350&fit=crop" },
    { id: 5, name: "Apoiador 5", image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=500&h=350&fit=crop" },
    { id: 6, name: "Apoiador 6", image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=500&h=350&fit=crop" },
    { id: 7, name: "Apoiador 7", image: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=500&h=350&fit=crop" },
    { id: 8, name: "Apoiador 8", image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=500&h=350&fit=crop" },
  ];

  return (
    <section id="apoiadores" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-aventura-verde mb-4">Apoiadores</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empresas e parceiros que tornam nossas aventuras ainda melhores
          </p>
        </div>
        
        <Carousel className="w-full max-w-5xl mx-auto mb-12">
          <CarouselContent className="-ml-2 md:-ml-4">
            {apoiadores.map((apoiador) => (
              <CarouselItem key={apoiador.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                <div className="h-48 bg-white rounded-lg p-2 shadow-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={apoiador.image} 
                    alt={`Apoiador ${apoiador.name}`} 
                    className="max-w-full max-h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="relative static left-0 translate-y-0 top-0" />
            <CarouselNext className="relative static right-0 translate-y-0 top-0" />
          </div>
        </Carousel>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-aventura-verde mb-4">Quer ser um apoiador?</h3>
          <p className="text-lg text-gray-700 mb-6">
            Junte-se aos nossos parceiros e promova sua marca para entusiastas de aventuras e viagens.
          </p>
          <Button className="bg-aventura-laranja hover:bg-amber-600 text-white text-lg py-6 px-8">
            <Link to="/#contato">Entre em Contato</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Apoiadores;
