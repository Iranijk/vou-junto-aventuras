
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Car, Calendar, MapPin } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

const formSchema = z.object({
  modelo_carro: z.string().min(2, 'Informe o modelo do carro'),
  vagas: z.string().min(1, 'Informe o número de vagas').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Deve ser um número maior que zero" }
  ),
  data: z.date({ required_error: "Selecione uma data" }),
  hora: z.string().min(1, 'Informe a hora'),
  destino: z.string().min(2, 'Informe o destino'),
  ponto_encontro: z.string().min(2, 'Informe o ponto de encontro'),
  tipo: z.enum(['trilha', 'viagem']),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const OferecerCaronaForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelo_carro: '',
      vagas: '',
      hora: '',
      destino: '',
      ponto_encontro: '',
      tipo: 'trilha',
      observacoes: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "É necessário estar logado",
        description: "Faça login para oferecer carona",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('caronas')
        .insert({
          user_id: user.id,
          modelo_carro: data.modelo_carro,
          vagas: parseInt(data.vagas),
          data: data.data.toISOString(),
          hora: data.hora,
          destino: data.destino,
          ponto_encontro: data.ponto_encontro,
          tipo: data.tipo,
          observacoes: data.observacoes || null,
        });

      if (error) throw error;

      toast({
        title: "Carona cadastrada com sucesso!",
        description: "Sua oferta de carona foi publicada",
      });

      form.reset();

    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar carona",
        description: error.message || "Ocorreu um erro ao cadastrar a carona",
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
            name="modelo_carro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo do Carro</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input className="pl-10" placeholder="Ex: Jeep Renegade" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vagas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Vagas</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="Ex: 3" 
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
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
            name="hora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="trilha">Trilha</SelectItem>
                  <SelectItem value="viagem">Viagem</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destino"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destino</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input className="pl-10" placeholder="Ex: Trilha do Pico da Tijuca" {...field} />
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
                  <Input className="pl-10" placeholder="Ex: Posto Shell da Barra da Tijuca" {...field} />
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
          {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar Oferta de Carona"}
        </Button>
      </form>
    </Form>
  );
};

export default OferecerCaronaForm;
