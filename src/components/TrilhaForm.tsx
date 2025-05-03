import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar, MapPin, Users, Bike, Car } from 'lucide-react';
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
  tipo_veiculo: z.enum(['jipe', 'moto', 'bicicleta']),
  nome_trilha: z.string().min(2, 'Informe o nome da trilha'),
  data: z.date({ required_error: "Selecione a data" }),
  hora: z.string().min(1, 'Informe a hora'),
  ponto_encontro: z.string().min(2, 'Informe o ponto de encontro'),
  vagas: z.string().min(1, 'Informe o número de vagas').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Deve ser um número maior que zero" }
  ),
  nivel_dificuldade: z.enum(['facil', 'medio', 'dificil', 'extremo']),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const TrilhaForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_veiculo: 'jipe',
      nome_trilha: '',
      hora: '',
      ponto_encontro: '',
      vagas: '',
      nivel_dificuldade: 'medio',
      observacoes: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "É necessário estar logado",
        description: "Faça login para cadastrar uma trilha",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('trilhas')
        .insert({
          user_id: user.id,
          tipo_veiculo: data.tipo_veiculo,
          nome_trilha: data.nome_trilha,
          data: data.data.toISOString(),
          hora: data.hora,
          ponto_encontro: data.ponto_encontro,
          vagas: parseInt(data.vagas),
          nivel_dificuldade: data.nivel_dificuldade,
          observacoes: data.observacoes || null,
        });

      if (error) throw error;

      toast({
        title: "Trilha cadastrada com sucesso!",
        description: "Sua trilha foi publicada",
      });

      form.reset();

    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar trilha",
        description: error.message || "Ocorreu um erro ao cadastrar a trilha",
        variant: "destructive",
      });
    }
  };

  const getVehicleIcon = () => {
    const vehicle = form.watch('tipo_veiculo');
    switch (vehicle) {
      case 'jipe':
        return <Car className="h-5 w-5 mr-2" />;
      case 'moto':
        return <Car className="h-5 w-5 mr-2" />;
      case 'bicicleta':
        return <Bike className="h-5 w-5 mr-2" />;
      default:
        return <Car className="h-5 w-5 mr-2" />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tipo_veiculo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Veículo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de veículo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="jipe">
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-2" />
                      Jipe
                    </div>
                  </SelectItem>
                  <SelectItem value="moto">
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-2" />
                      Moto
                    </div>
                  </SelectItem>
                  <SelectItem value="bicicleta">
                    <div className="flex items-center">
                      <Bike className="h-4 w-4 mr-2" />
                      Bicicleta
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nome_trilha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Trilha</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input className="pl-10" placeholder="Ex: Trilha da Pedra da Gávea" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nivel_dificuldade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Dificuldade</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                    <SelectItem value="extremo">Extremo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

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
                  <Input className="pl-10" placeholder="Ex: Estacionamento do Parque Nacional" {...field} />
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
                  placeholder="Alguma informação adicional? Equipamentos necessários? (opcional)" 
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
          <div className="flex items-center justify-center">
            {getVehicleIcon()}
            {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar Trilha"}
          </div>
        </Button>
      </form>
    </Form>
  );
};

export default TrilhaForm;
