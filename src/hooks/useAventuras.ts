
import { useState, useEffect } from 'react';
import { getEventos, getTrilhas, getCaronas, getParceirosViagem } from '@/services/aventuraService';

export interface AventuraItem {
  id: string;
  titulo: string;
  tipo: string;
  data: string;
  local: string;
  imagem?: string;
  descricao: string;
  vagas: number;
  telefone: string;
  contato: string;
}

export function useAventuras(tipoFiltro?: string) {
  const [aventuras, setAventuras] = useState<AventuraItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let todasAventuras: AventuraItem[] = [];

        // Eventos
        if (!tipoFiltro || tipoFiltro === 'eventos') {
          const eventos = await getEventos();
          const eventosFormatados = eventos.map(evento => ({
            id: evento.id,
            titulo: evento.nome_evento,
            tipo: 'Evento',
            data: new Date(evento.data_ida).toLocaleDateString(),
            local: evento.local_evento,
            imagem: evento.imagem_url,
            descricao: evento.descricao,
            vagas: evento.vagas_ilimitadas ? -1 : evento.vagas,
            telefone: evento.telefone,
            contato: evento.nome
          }));
          todasAventuras.push(...eventosFormatados);
        }

        // Trilhas
        if (!tipoFiltro || tipoFiltro === 'trilhas') {
          const trilhas = await getTrilhas();
          const trilhasFormatadas = trilhas.map(trilha => ({
            id: trilha.id,
            titulo: trilha.nome_trilha,
            tipo: `Trilha - ${trilha.tipo_veiculo}`,
            data: new Date(trilha.data).toLocaleDateString(),
            local: trilha.ponto_encontro,
            descricao: trilha.observacoes || `Trilha ${trilha.nivel_dificuldade} com ${trilha.tipo_veiculo}`,
            vagas: trilha.vagas,
            telefone: trilha.telefone,
            contato: trilha.nome
          }));
          todasAventuras.push(...trilhasFormatadas);
        }

        // Caronas
        if (!tipoFiltro || tipoFiltro === 'caronas') {
          const caronas = await getCaronas();
          const caronasFormatadas = caronas.map(carona => ({
            id: carona.id,
            titulo: `Carona para ${carona.destino}`,
            tipo: `Carona - ${carona.tipo}`,
            data: new Date(carona.data).toLocaleDateString(),
            local: carona.ponto_encontro,
            descricao: carona.observacoes || `Carona em ${carona.modelo_carro} para ${carona.destino}`,
            vagas: carona.vagas,
            telefone: carona.telefone,
            contato: carona.nome
          }));
          todasAventuras.push(...caronasFormatadas);
        }

        // Parceiros de Viagem
        if (!tipoFiltro || tipoFiltro === 'viagens') {
          const viagens = await getParceirosViagem();
          const viagensFormatadas = viagens.map(viagem => ({
            id: viagem.id,
            titulo: `Viagem para ${viagem.cidade}, ${viagem.estado}`,
            tipo: 'Parceiros de Viagem',
            data: `${new Date(viagem.data_inicio).toLocaleDateString()} - ${new Date(viagem.data_fim).toLocaleDateString()}`,
            local: `${viagem.cidade}, ${viagem.estado}`,
            descricao: viagem.observacoes || `Busca de ${viagem.num_pessoas} parceiros para viagem`,
            vagas: viagem.num_pessoas,
            telefone: viagem.telefone,
            contato: viagem.nome
          }));
          todasAventuras.push(...viagensFormatadas);
        }

        // Ordenar pelo mais recente (assumindo que a data mais próxima é mais recente)
        todasAventuras.sort((a, b) => {
          const dataA = new Date(a.data.split(' - ')[0]);
          const dataB = new Date(b.data.split(' - ')[0]);
          return dataA.getTime() - dataB.getTime();
        });

        setAventuras(todasAventuras);
      } catch (error) {
        console.error('Erro ao carregar aventuras:', error);
        setError('Erro ao carregar aventuras');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tipoFiltro]);

  return { aventuras, isLoading, error };
}
