
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface QueryOptions {
  table: string;
  select?: string;
  filters?: { column: string; value: any; operator?: string }[];
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  page?: number;
  single?: boolean;
}

export function useSupabaseQuery<T>(options: QueryOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Iniciar consulta
        let query = supabase.from(options.table).select(options.select || '*');

        // Adicionar filtros se existirem
        if (options.filters && options.filters.length > 0) {
          options.filters.forEach(filter => {
            const operator = filter.operator || 'eq';
            switch (operator) {
              case 'eq':
                query = query.eq(filter.column, filter.value);
                break;
              case 'neq':
                query = query.neq(filter.column, filter.value);
                break;
              case 'gt':
                query = query.gt(filter.column, filter.value);
                break;
              case 'lt':
                query = query.lt(filter.column, filter.value);
                break;
              case 'gte':
                query = query.gte(filter.column, filter.value);
                break;
              case 'lte':
                query = query.lte(filter.column, filter.value);
                break;
              case 'like':
                query = query.like(filter.column, `%${filter.value}%`);
                break;
            }
          });
        }

        // Ordenação
        if (options.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending !== false
          });
        }

        // Paginação
        if (options.limit) {
          query = query.limit(options.limit);
          if (options.page && options.page > 1) {
            query = query.range(
              (options.page - 1) * options.limit, 
              options.page * options.limit - 1
            );
          }
        }

        // Executar como single ou não
        const { data, error } = options.single 
          ? await query.single()
          : await query;

        if (error) throw error;
        setData(data as T);
        setError(null);
      } catch (err) {
        console.error('Erro na consulta Supabase:', err);
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    options.table, 
    options.select, 
    JSON.stringify(options.filters), 
    JSON.stringify(options.orderBy), 
    options.limit, 
    options.page,
    options.single
  ]);

  return { data, error, loading };
}
