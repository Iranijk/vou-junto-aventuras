export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      caronas: {
        Row: {
          cep: string
          created_at: string
          data: string
          destino: string
          hora: string
          id: string
          modelo_carro: string
          nome: string
          observacoes: string | null
          ponto_encontro: string
          telefone: string
          tipo: string
          user_id: string
          vagas: number
        }
        Insert: {
          cep: string
          created_at?: string
          data: string
          destino: string
          hora: string
          id?: string
          modelo_carro: string
          nome: string
          observacoes?: string | null
          ponto_encontro: string
          telefone: string
          tipo: string
          user_id: string
          vagas: number
        }
        Update: {
          cep?: string
          created_at?: string
          data?: string
          destino?: string
          hora?: string
          id?: string
          modelo_carro?: string
          nome?: string
          observacoes?: string | null
          ponto_encontro?: string
          telefone?: string
          tipo?: string
          user_id?: string
          vagas?: number
        }
        Relationships: []
      }
      eventos: {
        Row: {
          cep: string
          created_at: string
          data_ida: string
          data_volta: string | null
          descricao: string
          hora_ida: string
          hora_volta: string | null
          id: string
          imagem_url: string | null
          local_evento: string
          nome: string
          nome_evento: string
          ponto_encontro: string
          telefone: string
          user_id: string
          vagas: number
          vagas_ilimitadas: boolean | null
        }
        Insert: {
          cep: string
          created_at?: string
          data_ida: string
          data_volta?: string | null
          descricao: string
          hora_ida: string
          hora_volta?: string | null
          id?: string
          imagem_url?: string | null
          local_evento: string
          nome: string
          nome_evento: string
          ponto_encontro: string
          telefone: string
          user_id: string
          vagas: number
          vagas_ilimitadas?: boolean | null
        }
        Update: {
          cep?: string
          created_at?: string
          data_ida?: string
          data_volta?: string | null
          descricao?: string
          hora_ida?: string
          hora_volta?: string | null
          id?: string
          imagem_url?: string | null
          local_evento?: string
          nome?: string
          nome_evento?: string
          ponto_encontro?: string
          telefone?: string
          user_id?: string
          vagas?: number
          vagas_ilimitadas?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cep: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cep?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cep?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trilhas: {
        Row: {
          cep: string
          created_at: string
          data: string
          hora: string
          id: string
          nivel_dificuldade: string
          nome: string
          nome_trilha: string
          observacoes: string | null
          ponto_encontro: string
          telefone: string
          tipo_veiculo: string
          user_id: string
          vagas: number
        }
        Insert: {
          cep: string
          created_at?: string
          data: string
          hora: string
          id?: string
          nivel_dificuldade: string
          nome: string
          nome_trilha: string
          observacoes?: string | null
          ponto_encontro: string
          telefone: string
          tipo_veiculo: string
          user_id: string
          vagas: number
        }
        Update: {
          cep?: string
          created_at?: string
          data?: string
          hora?: string
          id?: string
          nivel_dificuldade?: string
          nome?: string
          nome_trilha?: string
          observacoes?: string | null
          ponto_encontro?: string
          telefone?: string
          tipo_veiculo?: string
          user_id?: string
          vagas?: number
        }
        Relationships: []
      }
      viagens: {
        Row: {
          cep: string
          cidade: string
          created_at: string
          data_fim: string
          data_inicio: string
          estado: string
          id: string
          nome: string
          num_pessoas: number
          observacoes: string | null
          telefone: string
          user_id: string
        }
        Insert: {
          cep: string
          cidade: string
          created_at?: string
          data_fim: string
          data_inicio: string
          estado: string
          id?: string
          nome: string
          num_pessoas: number
          observacoes?: string | null
          telefone: string
          user_id: string
        }
        Update: {
          cep?: string
          cidade?: string
          created_at?: string
          data_fim?: string
          data_inicio?: string
          estado?: string
          id?: string
          nome?: string
          num_pessoas?: number
          observacoes?: string | null
          telefone?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
