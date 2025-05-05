
import { supabase } from '@/lib/supabase';

// Interface base para todas as aventuras
export interface BaseAventura {
  id: string;
  user_id: string;
  nome: string;
  telefone: string;
  cep: string;
  created_at: string;
}

// Interface para caronas
export interface Carona extends BaseAventura {
  modelo_carro: string;
  vagas: number;
  data: string;
  hora: string;
  destino: string;
  ponto_encontro: string;
  tipo: 'trilha' | 'viagem';
  observacoes?: string;
}

// Interface para parceiros de viagem
export interface ParceirosViagem extends BaseAventura {
  cidade: string;
  estado: string;
  data_inicio: string;
  data_fim: string;
  num_pessoas: number;
  observacoes?: string;
}

// Interface para trilhas
export interface Trilha extends BaseAventura {
  tipo_veiculo: 'jipe' | 'moto' | 'bicicleta';
  nome_trilha: string;
  data: string;
  hora: string;
  ponto_encontro: string;
  vagas: number;
  nivel_dificuldade: 'facil' | 'medio' | 'dificil' | 'extremo';
  observacoes?: string;
}

// Interface para eventos
export interface Evento extends BaseAventura {
  nome_evento: string;
  descricao: string;
  data_ida: string;
  hora_ida: string;
  data_volta?: string;
  hora_volta?: string;
  ponto_encontro: string;
  local_evento: string;
  vagas: number;
  vagas_ilimitadas: boolean;
  imagem_url?: string;
}

// Buscar todas as caronas
export const getCaronas = async (): Promise<Carona[]> => {
  try {
    const { data, error } = await supabase
      .from('caronas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar caronas:', error);
    return [];
  }
};

// Buscar carona por ID
export const getCaronaById = async (id: string): Promise<Carona | null> => {
  try {
    const { data, error } = await supabase
      .from('caronas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar carona:', error);
    return null;
  }
};

// Buscar caronas por usuário
export const getCaronasByUser = async (userId: string): Promise<Carona[]> => {
  try {
    const { data, error } = await supabase
      .from('caronas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar caronas do usuário:', error);
    return [];
  }
};

// Buscar todas as trilhas
export const getTrilhas = async (): Promise<Trilha[]> => {
  try {
    const { data, error } = await supabase
      .from('trilhas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar trilhas:', error);
    return [];
  }
};

// Buscar trilha por ID
export const getTrilhaById = async (id: string): Promise<Trilha | null> => {
  try {
    const { data, error } = await supabase
      .from('trilhas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar trilha:', error);
    return null;
  }
};

// Buscar todas as buscas por parceiros de viagem
export const getParceirosViagem = async (): Promise<ParceirosViagem[]> => {
  try {
    const { data, error } = await supabase
      .from('viagens')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar parceiros de viagem:', error);
    return [];
  }
};

// Buscar busca por parceiros de viagem por ID
export const getParceirosViagemById = async (id: string): Promise<ParceirosViagem | null> => {
  try {
    const { data, error } = await supabase
      .from('viagens')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar parceiros de viagem:', error);
    return null;
  }
};

// Buscar todos os eventos
export const getEventos = async (): Promise<Evento[]> => {
  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }
};

// Buscar evento por ID
export const getEventoById = async (id: string): Promise<Evento | null> => {
  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return null;
  }
};
