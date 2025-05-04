
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';

// Definição do tipo de dados para aventuras
interface Aventura {
  id: number;
  titulo: string;
  tipo: string;
  local: string;
  data: string;
  vagas: number;
  custo: string;
  descricao: string;
  cep?: string;
  imagem?: string;
  usuario_id?: string;
}

const EncontrarAventuras = () => {
  const [filtro, setFiltro] = useState<'cidade' | 'estado' | 'todas'>('todas');
  const [aventuras, setAventuras] = useState<Aventura[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Busca as aventuras com base no filtro selecionado
  const buscarAventuras = async () => {
    try {
      setLoading(true);
      
      // Obtém a data atual
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataHoje = hoje.toISOString();
      
      // Buscar informações do usuário para o CEP
      let userCep = '';
      if (user && (filtro === 'cidade' || filtro === 'estado')) {
        const { data: userProfile } = await supabase
          .from('perfis')
          .select('cep')
          .eq('id', user.id)
          .single();
          
        userCep = userProfile?.cep || '';
        
        if (!userCep) {
          toast({
            title: "Atenção",
            description: "Seu perfil não tem CEP cadastrado. Mostrando todas aventuras.",
            variant: "destructive"
          });
          setFiltro('todas');
        }
      }
      
      // Constrói a query base
      let query = supabase
        .from('aventuras')
        .select('*')
        .gte('data', dataHoje)
        .order('data', { ascending: true });
      
      // Aplica filtro por localização se necessário
      if (filtro === 'cidade' && userCep) {
        // Filtra por cidade (3 primeiros dígitos do CEP)
        const prefixoCidade = userCep.substring(0, 3);
        query = query.ilike('cep', `${prefixoCidade}%`);
      } else if (filtro === 'estado' && userCep) {
        // Filtra por estado (2 primeiros dígitos do CEP)
        const prefixoEstado = userCep.substring(0, 2);
        query = query.ilike('cep', `${prefixoEstado}%`);
      }
      
      // Executa a query
      const { data, error, count } = await query
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
        .order('data', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      // Obtém o total de registros para a paginação
      const { count: totalCount } = await supabase
        .from('aventuras')
        .select('*', { count: 'exact', head: true })
        .gte('data', dataHoje);
      
      setAventuras(data || []);
      setTotalPages(Math.ceil((totalCount || 0) / itemsPerPage));
      
    } catch (error: any) {
      toast({
        title: "Erro ao buscar aventuras",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Efeito para buscar aventuras quando o filtro ou a página mudar
  useEffect(() => {
    buscarAventuras();
  }, [filtro, page]);
  
  // Formata a data para exibição
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Renderiza a lista de aventuras
  const renderAventuras = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-aventura-verde" />
        </div>
      );
    }
    
    if (aventuras.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Nenhuma aventura encontrada para os filtros selecionados.</p>
          <Button className="mt-4 bg-aventura-verde hover:bg-aventura-verdeclaro" onClick={() => setFiltro('todas')}>
            Ver Todas Aventuras
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {aventuras.map((aventura) => (
          <Card key={aventura.id} className="overflow-hidden shadow-lg transition-transform hover:scale-105">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={aventura.imagem || "https://images.unsplash.com/photo-1533294455009-a6f974919072?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"} 
                alt={aventura.titulo} 
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-aventura-laranja">{aventura.tipo}</Badge>
            </div>
            
            <CardHeader>
              <CardTitle className="text-xl text-aventura-verde">{aventura.titulo}</CardTitle>
              <CardDescription className="line-clamp-2">{aventura.descricao}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2" />
                  <span>{aventura.local}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-2" />
                  <span>{formatarData(aventura.data)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-2" />
                  <span>{aventura.vagas} vagas disponíveis</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <DollarSign size={18} className="mr-2" />
                  <span>{aventura.custo}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button className="w-full bg-aventura-verde hover:bg-aventura-verdeclaro">
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-aventura-verde mb-4">Encontre sua próxima aventura</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore aventuras disponíveis e encontre a que combina com você
              </p>
            </div>
            
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-10">
              <h2 className="text-xl font-semibold mb-4 text-center">Filtrar por localização</h2>
              
              <RadioGroup value={filtro} onValueChange={(value) => setFiltro(value as 'cidade' | 'estado' | 'todas')}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="cidade" id="cidade" />
                  <Label htmlFor="cidade">Na minha cidade</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="estado" id="estado" />
                  <Label htmlFor="estado">No meu estado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="todas" id="todas" />
                  <Label htmlFor="todas">Todas as aventuras</Label>
                </div>
              </RadioGroup>
            </div>
            
            {renderAventuras()}
            
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setPage(page - 1)} />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        isActive={page === index + 1}
                        onClick={() => setPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => setPage(page + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EncontrarAventuras;
