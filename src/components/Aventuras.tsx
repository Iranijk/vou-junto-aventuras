
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { getEventos } from '@/services/aventuraService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AventuraData {
  id: string;
  titulo: string;
  imagem: string;
  tipo: string;
  local: string;
  data: string;
  vagas: number;
  custo?: string;
  descricao: string;
}

const AventuraCard = ({ aventura }: { aventura: AventuraData }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={aventura.imagem || "https://images.unsplash.com/photo-1533294455009-a6f974919072?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"} 
          alt={aventura.titulo} 
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-4 right-4 bg-aventura-laranja">{aventura.tipo}</Badge>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-aventura-verde">{aventura.titulo}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{aventura.descricao}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin size={18} className="mr-2" />
            <span>{aventura.local}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar size={18} className="mr-2" />
            <span>{aventura.data}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users size={18} className="mr-2" />
            <span>{aventura.vagas === -1 ? 'Vagas ilimitadas' : `${aventura.vagas} vagas disponíveis`}</span>
          </div>
          
          {aventura.custo && (
            <div className="flex items-center text-gray-600">
              <DollarSign size={18} className="mr-2" />
              <span>{aventura.custo}</span>
            </div>
          )}
        </div>
        
        <Button className="w-full bg-aventura-verde hover:bg-aventura-verdeclaro">
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

// Dados estáticos para backup caso não consiga carregar do Supabase
const aventurasEstaticas = [
  {
    id: '1',
    titulo: "Trilha Serras da Bodoquena",
    imagem: "https://images.unsplash.com/photo-1533294455009-a6f974919072?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
    tipo: "Off-Road",
    local: "Bonito, MS",
    data: "25 Jun 2025",
    vagas: 3,
    custo: "R$ 150,00",
    descricao: "Aventura de fim de semana pelas trilhas e cachoeiras da Serra da Bodoquena. Veículo 4x4 necessário."
  },
  {
    id: '2',
    titulo: "Expedição Pantanal Sul",
    imagem: "https://images.unsplash.com/photo-1468818438311-4bab781ab9b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
    tipo: "Viagem",
    local: "Pantanal, MS",
    data: "10 Jul 2025",
    vagas: 2,
    custo: "R$ 280,00",
    descricao: "Três dias de imersão na natureza do Pantanal Sul. Observação de aves e safári fotográfico inclusos."
  },
  {
    id: '3',
    titulo: "Passeio de Moto - Estrada Parque",
    imagem: "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
    tipo: "Motociclismo",
    local: "Miranda, MS",
    data: "5 Jun 2025",
    vagas: 4,
    custo: "R$ 120,00",
    descricao: "Passeio de moto pela famosa Estrada Parque. Paradas para fotografias e almoço típico inclusos."
  },
];

const Aventuras = () => {
  const [aventuras, setAventuras] = useState<AventuraData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        const eventosData = await getEventos();
        if (eventosData && eventosData.length > 0) {
          // Mapear eventos do banco para o formato de exibição
          const eventosFormatados = eventosData.slice(0, 6).map(evento => ({
            id: evento.id,
            titulo: evento.nome_evento,
            imagem: evento.imagem_url || "https://images.unsplash.com/photo-1533294455009-a6f974919072?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
            tipo: "Evento",
            local: evento.local_evento,
            data: format(new Date(evento.data_ida), "dd MMM yyyy", { locale: ptBR }),
            vagas: evento.vagas_ilimitadas ? -1 : evento.vagas,
            descricao: evento.descricao
          }));
          setAventuras(eventosFormatados);
        } else {
          // Se não houver dados, usar os estáticos
          setAventuras(aventurasEstaticas);
        }
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        setAventuras(aventurasEstaticas);
      } finally {
        setIsLoading(false);
      }
    };

    carregarEventos();
  }, []);

  return (
    <section id="aventuras" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-aventura-verde mb-4">Aventuras Disponíveis</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre sua próxima aventura e faça parte de uma experiência inesquecível
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-aventura-verde border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aventuras.map(aventura => (
              <AventuraCard key={aventura.id} aventura={aventura} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/encontrar-aventuras">
            <Button className="bg-aventura-laranja hover:bg-amber-600 text-white">
              Buscar Aventuras
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Aventuras;
