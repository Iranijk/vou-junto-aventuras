
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ComoFunciona from '@/components/ComoFunciona';
import Aventuras from '@/components/Aventuras';
import Contato from '@/components/Contato';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <ComoFunciona />
      <Aventuras />
      <Contato />
      <Footer />
    </div>
  );
};

export default Index;
