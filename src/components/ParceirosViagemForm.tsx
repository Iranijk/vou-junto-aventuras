import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar, MapPin, Users, Phone } from 'lucide-react';
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

const formSchema = z.object({
  cidade: z.string().min(2, 'Informe a cidade'),
  estado: z.string().min(2, 'Informe o estado'),
  data_inicio: z.date({ required_error: "Selecione a data de início" }),
  data_fim: z.date({ required_error: "Selecione a data de retorno" }),
  num_pessoas: z.string().min(1, 'Informe o número de pessoas').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Deve ser um número maior que zero" }
  ),
  observacoes: z.string().optional(),
  telefone: z.string().min(10, 'Informe um telefone válido com DDD'),
  cep: z.string().min(8, 'Informe um CEP válido').max(9, 'CEP inválido'),
  nome: z.string().min(3, 'Informe seu nome completo'),
});

type FormData = z.infer<typeof formSchema>;

const ParceirosViagemForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cidade: '',
      estado: '',
      num_pessoas: '',
      observacoes: '',
      telefone: '',
      cep: '',
      nome: '',
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        toast({
          title: "É necessário estar logado",
          description: "Faça login para buscar parceiros de viagem",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      try {
        // Fetch user data from the database
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUserData(data);
          form.setValue('nome', data.nome || '');
          form.setValue('telefone', data.telefone || '');
          form.setValue('cep', data.cep || '');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, navigate, toast, form]);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "É necessário estar logado",
        description: "Faça login para buscar parceiros de viagem",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('viagens')
        .insert({
          user_id: user.id,
          cidade: data.cidade,
          estado: data.estado,
          data_inicio: data.data_inicio.toISOString(),
          data_fim: data.data_fim.toISOString(),
          num_pessoas: parseInt(data.num_pessoas),
          observacoes: data.observacoes || null,
          telefone: data.telefone,
          cep: data.cep,
          nome: data.nome,
        });

      if (error) throw error;

      // Update profile information if it's changed
      if (userData && (
        userData.nome !== data.nome || 
        userData.telefone !== data.telefone || 
        userData.cep !== data.cep
      )) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            nome: data.nome,
            telefone: data.telefone,
            cep: data.cep,
            updated_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;
      }

      toast({
        title: "Busca por parceiros cadastrada!",
        description: "Sua busca por parceiros de viagem foi publicada",
      });

      form.reset();

    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao cadastrar a busca por parceiros",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-aventura-verde border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-amber-50 p-4 rounded-md mb-6 border border-amber-200">
          <h3 className="font-medium text-amber-800 mb-2">Seus Dados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        className="pl-10" 
                        placeholder="(00) 00000-0000" 
                        {...field}
                        onChange={(e) => {
                          // Format phone number
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 11) {
                            field.onChange(value);
                          }
                        }} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00000-000" 
                      {...field} 
                      onChange={(e) => {
                        // Format CEP
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 8) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input className="pl-10" placeholder="Ex: Gramado" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input className="pl-10" placeholder="Ex: Rio Grande do Sul" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="data_inicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Ida</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_fim"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Volta</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const dataInicio = form.getValues().data_inicio;
                        return date < new Date() || (dataInicio && date < dataInicio);
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="num_pessoas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de pessoas</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    className="pl-10"
                    type="number" 
                    min="1"
                    placeholder="Ex: 3" 
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Alguma informação adicional? (opcional)" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-aventura-laranja hover:bg-amber-600"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar Busca por Parceiros"}
        </Button>
      </form>
    </Form>
  );
};

export default ParceirosViagemForm;
