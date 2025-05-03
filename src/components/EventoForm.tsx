
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
  nome_evento: z.string().min(2, 'Informe o nome do evento'),
  descricao: z.string().min(10, 'Descreva o evento com pelo menos 10 caracteres'),
  data_ida: z.date({ required_error: "Selecione a data de ida" }),
  hora_ida: z.string().min(1, 'Informe o horário de ida'),
  data_volta: z.date({ required_error: "Selecione a data de volta" }).optional(),
  hora_volta: z.string().optional(),
  ponto_encontro: z.string().min(2, 'Informe o ponto de encontro'),
  local_evento: z.string().min(2, 'Informe o local do evento'),
  vagas: z.string().min(1, 'Informe o número de vagas').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Deve ser um número maior que zero" }
  ),
});

type FormData = z.infer<typeof formSchema>;

const EventoForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_evento: '',
      descricao: '',
      hora_ida: '',
      hora_volta: '',
      ponto_encontro: '',
      local_evento: '',
      vagas: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "É necessário estar logado",
        description: "Faça login para cadastrar um evento",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('eventos')
        .insert({
          user_id: user.id,
          nome_evento: data.nome_evento,
          descricao: data.descricao,
          data_ida: data.data_ida.toISOString(),
          hora_ida: data.hora_ida,
          data_volta: data.data_volta ? data.data_volta.toISOString() : null,
          hora_volta: data.hora_volta || null,
          ponto_encontro: data.ponto_encontro,
          local_evento: data.local_evento,
          vagas: parseInt(data.vagas),
        });

      if (error) throw error;

      toast({
        title: "Evento cadastrado com sucesso!",
        description: "Seu evento foi publicado",
      });

      form.reset();

    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar evento",
        description: error.message || "Ocorreu um erro ao cadastrar o evento",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome_evento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Evento</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input className="pl-10" placeholder="Ex: Festival de Verão" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Evento</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o evento, atividades, público alvo, etc."
                  className="resize-none min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="data_ida"
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
            name="hora_ida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Ida</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="data_volta"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Volta (opcional)</FormLabel>
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
                        const dataIda = form.getValues().data_ida;
                        return date < new Date() || (dataIda && date < dataIda);
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

          <FormField
            control={form.control}
            name="hora_volta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Volta (opcional)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="local_evento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local do Evento</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input className="pl-10" placeholder="Ex: Praia de Copacabana" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ponto_encontro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ponto de Encontro</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input className="pl-10" placeholder="Ex: Estacionamento do Shopping" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vagas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vagas Disponíveis</FormLabel>
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

        <Button 
          type="submit" 
          className="w-full bg-aventura-laranja hover:bg-amber-600"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar Evento"}
        </Button>
      </form>
    </Form>
  );
};

export default EventoForm;
