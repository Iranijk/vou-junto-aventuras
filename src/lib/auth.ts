
import { supabase } from './supabase';

export type AuthError = {
  message: string;
};

export const signUp = async (email: string, password: string, userData?: any): Promise<{ user: any; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Se o cadastro foi bem-sucedido, cria um perfil para o usuário
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: email,
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
      }
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    return { 
      user: null, 
      error: { 
        message: error.message || 'Erro ao criar conta' 
      } 
    };
  }
};

export const signIn = async (email: string, password: string): Promise<{ user: any; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error: any) {
    return { 
      user: null, 
      error: { 
        message: error.message || 'Email ou senha incorretos' 
      } 
    };
  }
};

export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return { error: null };
  } catch (error: any) {
    return { 
      error: { 
        message: error.message || 'Erro ao sair' 
      } 
    };
  }
};

export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error: any) {
    return { 
      error: { 
        message: error.message || 'Erro ao enviar email de redefinição de senha' 
      } 
    };
  }
};

export const updatePassword = async (password: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error: any) {
    return { 
      error: { 
        message: error.message || 'Erro ao atualizar senha' 
      } 
    };
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return { session: data.session, error: null };
  } catch (error: any) {
    return { 
      session: null, 
      error: { 
        message: error.message || 'Erro ao obter sessão' 
      } 
    };
  }
};
