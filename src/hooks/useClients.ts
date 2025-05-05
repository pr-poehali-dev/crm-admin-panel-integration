
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api-clients';
import { QueryParams } from '@/lib/api';
import { Client, ClientCreateDto, ClientUpdateDto } from '@/types/client';
import { toast } from '@/components/ui/use-toast';

// Ключи для кэширования запросов
const CLIENTS_CACHE_KEY = 'clients';

// Хук для загрузки списка клиентов с пагинацией и фильтрацией
export function useClients(params?: QueryParams) {
  return useQuery({
    queryKey: [CLIENTS_CACHE_KEY, 'list', params],
    queryFn: () => clientsApi.getAll(params),
    keepPreviousData: true,
  });
}

// Хук для загрузки отдельного клиента по ID
export function useClient(id: string) {
  return useQuery({
    queryKey: [CLIENTS_CACHE_KEY, id],
    queryFn: () => clientsApi.getById(id),
    enabled: !!id,
  });
}

// Хук для создания нового клиента
export function useCreateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ClientCreateDto) => clientsApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_CACHE_KEY, 'list'] });
      queryClient.setQueryData([CLIENTS_CACHE_KEY, response.data.id], response);
      
      toast({
        title: 'Клиент создан',
        description: `Клиент "${response.data.companyName}" успешно добавлен в систему.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка создания',
        description: error.message || 'Не удалось создать клиента.',
      });
    }
  });
}

// Хук для обновления существующего клиента
export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ClientUpdateDto) => clientsApi.update(id, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: [CLIENTS_CACHE_KEY, id] });
      const previousData = queryClient.getQueryData([CLIENTS_CACHE_KEY, id]);
      
      queryClient.setQueryData([CLIENTS_CACHE_KEY, id], (old: any) => {
        return {
          ...old,
          data: { ...old.data, ...newData }
        };
      });
      
      return { previousData };
    },
    onSuccess: (response) => {
      queryClient.setQueryData([CLIENTS_CACHE_KEY, id], response);
      queryClient.invalidateQueries({ queryKey: [CLIENTS_CACHE_KEY, 'list'] });
      
      toast({
        title: 'Клиент обновлен',
        description: `Данные клиента "${response.data.companyName}" успешно обновлены.`,
      });
    },
    onError: (error: Error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([CLIENTS_CACHE_KEY, id], context.previousData);
      }
      
      toast({
        variant: 'destructive',
        title: 'Ошибка обновления',
        description: error.message || 'Не удалось обновить клиента.',
      });
    },
  });
}

// Хук для удаления клиента
export function useDeleteClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => clientsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: [CLIENTS_CACHE_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CLIENTS_CACHE_KEY, 'list'] });
      
      toast({
        title: 'Клиент удален',
        description: 'Клиент успешно удален из системы.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка удаления',
        description: error.message || 'Не удалось удалить клиента.',
      });
    }
  });
}
