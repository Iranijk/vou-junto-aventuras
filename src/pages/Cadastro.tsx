
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, InfoIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const formSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido (mínimo 10 dígitos)').max(15, 'Telefone inválido (máximo 15 dígitos)'),
  cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
  social_media_type: z.enum(['facebook', 'instagram', 'linkedin', 'twitter']),
  social_media_url: z.string().url('URL inválida. Insira uma URL completa (ex: https://...)'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  termos: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de uso',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof formSchema>;

const Cadastro = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cep: '',
      social_media_type: 'instagram',
      social_media_url: '',
      password: '',
      confirmPassword: '',
      termos: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const userData = {
        nome: data.nome,
        telefone: data.telefone,
        cep: data.cep,
        avatar_url: '',
        tipo: 'usuario',
        social_media_type: data.social_media_type,
        social_media_url: data.social_media_url,
      };

      await signUp(data.email, data.password, userData);

      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar o cadastro.",
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao tentar criar sua conta.",
      });
    }
  };

  // Helper function to get the appropriate social media icon
  const getSocialMediaIcon = () => {
    const socialMediaType = form.watch('social_media_type');
    switch (socialMediaType) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-gray-400" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-gray-400" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-gray-400" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-gray-400" />;
      default:
        return <Instagram className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-aventura-verde">
          Crie sua conta no Vou Junto
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{" "}
          <Link to="/login" className="font-medium text-aventura-laranja hover:text-amber-600">
            entre com sua conta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input className="pl-10" placeholder="Seu nome completo" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input className="pl-10" placeholder="seu@email.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            placeholder="(99) 99999-9999" 
                            {...field} 
                            onChange={(e) => {
                              // Remove tudo que não for número
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
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input 
                            className="pl-10" 
                            placeholder="00000-000" 
                            {...field} 
                            onChange={(e) => {
                              // Remove tudo que não for número
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

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="social_media_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rede Social</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma rede social" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social_media_url"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Link do perfil</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                              <InfoIcon className="h-4 w-4 text-gray-500" />
                              <span className="sr-only">Instruções</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Como encontrar o link do seu perfil:</h4>
                              <ol className="text-sm list-decimal pl-4 space-y-1">
                                <li>Entre em sua rede social escolhida</li>
                                <li>Vá até o seu perfil pessoal</li>
                                <li>Copie a URL completa da barra de endereço</li>
                                <li>Cole aqui no campo de link</li>
                              </ol>
                              <p className="text-xs text-muted-foreground mt-2">
                                O link do perfil é necessário para verificação da veracidade do seu cadastro 
                                e será mostrado aos participantes de suas aventuras.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {getSocialMediaIcon()}
                          </div>
                          <Input 
                            className="pl-10" 
                            placeholder="https://..." 
                            {...field} 
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input 
                          className="pl-10" 
                          type="password" 
                          placeholder="Mínimo 6 caracteres" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input 
                          className="pl-10" 
                          type="password" 
                          placeholder="Repita sua senha" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="termos"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Eu aceito os{" "}
                        <Link 
                          to="/termos" 
                          className="text-aventura-laranja hover:text-amber-600"
                        >
                          termos de serviço
                        </Link>{" "}
                        e{" "}
                        <Link 
                          to="/privacidade" 
                          className="text-aventura-laranja hover:text-amber-600"
                        >
                          política de privacidade
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-aventura-laranja hover:bg-amber-600"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
