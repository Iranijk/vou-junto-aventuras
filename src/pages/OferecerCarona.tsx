
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Route, Map, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OferecerCaronaForm from '@/components/OferecerCaronaForm';
import ParceirosViagemForm from '@/components/ParceirosViagemForm';
import TrilhaForm from '@/components/TrilhaForm';
import EventoForm from '@/components/EventoForm';

const OferecerCarona = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-aventura-verde">Oferecer Aventura</h1>
        
        <Tabs defaultValue="carona" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="carona" className="flex flex-col items-center py-3">
              <Car className="mb-2" />
              <span>Ofereço Carona</span>
            </TabsTrigger>
            <TabsTrigger value="viagem" className="flex flex-col items-center py-3">
              <Route className="mb-2" />
              <span>Parceiros para Viagem</span>
            </TabsTrigger>
            <TabsTrigger value="trilha" className="flex flex-col items-center py-3">
              <Map className="mb-2" />
              <span>Vamos em uma Trilha</span>
            </TabsTrigger>
            <TabsTrigger value="evento" className="flex flex-col items-center py-3">
              <Calendar className="mb-2" />
              <span>Vamos a um Evento</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6 p-4 border rounded-lg bg-white">
            <TabsContent value="carona">
              <h2 className="text-xl font-semibold mb-4">Ofereço Carona</h2>
              <OferecerCaronaForm />
            </TabsContent>
            
            <TabsContent value="viagem">
              <h2 className="text-xl font-semibold mb-4">Parceiros para Viagem</h2>
              <ParceirosViagemForm />
            </TabsContent>
            
            <TabsContent value="trilha">
              <h2 className="text-xl font-semibold mb-4">Vamos em uma Trilha</h2>
              <TrilhaForm />
            </TabsContent>
            
            <TabsContent value="evento">
              <h2 className="text-xl font-semibold mb-4">Vamos a um Evento</h2>
              <EventoForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default OferecerCarona;
