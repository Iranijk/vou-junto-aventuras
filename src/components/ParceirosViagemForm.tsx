
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar, MapPin, Users } from 'lucide-react';
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
});

type FormData = z.infer<typeof formSchema>;

const ParceirosViagemForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cidade: '',
      estado: '',
      num_pessoas: '',
      observacoes: '',
    },
  });

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
        });

      if (error) throw error;

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
