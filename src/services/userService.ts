
import { supabase } from '@/lib/supabase';

// Interface para os usuários
export interface User {
  id: string;
  email: string;
  nome?: string;
  telefone?: string;
  cep?: string;
  created_at: string;
  updated_at?: string;
}

// Buscar um usuário pelo ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

// Atualizar perfil do usuário
export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...userData,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return false;
  }
};

// Buscar todos os usuários
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};
