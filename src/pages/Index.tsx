
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ComoFunciona from '@/components/ComoFunciona';
import Aventuras from '@/components/Aventuras';
import Apoiadores from '@/components/Apoiadores';
import Contato from '@/components/Contato';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-aventura-verde mb-6 text-center">
          Últimos convites cadastrados
        </h2>
      </div>
      <Aventuras />
      <ComoFunciona />
      <Apoiadores />
      <Contato />
      <Footer />
    </div>
  );
};

export default Index;
