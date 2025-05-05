
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi as api, QueryParams, UserCreateDto, UserUpdateDto } from '@/lib/api';
import { User } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';

// Ключи для кэширования запросов
const USERS_CACHE_KEY = 'users';

// Хук для загрузки списка пользователей с пагинацией и фильтрацией
export function useUsers(params?: QueryParams) {
  return useQuery({
    queryKey: [USERS_CACHE_KEY, 'list', params],
    queryFn: () => api.users.getAll(params),
    keepPreviousData: true, // Сохраняем предыдущие данные при изменении параметров запроса
  });
}

// Хук для загрузки отдельного пользователя по ID
export function useUser(id: string) {
  return useQuery({
    queryKey: [USERS_CACHE_KEY, id],
    queryFn: () => api.users.getById(id),
    enabled: !!id, // Запрос выполняется только если id определен
  });
}

// Хук для создания нового пользователя
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserCreateDto) => api.users.create(data),
    onSuccess: (response) => {
      // Инвалидируем кэш списка пользователей
      queryClient.invalidateQueries({ queryKey: [USERS_CACHE_KEY, 'list'] });
      
      // Обновляем кэш конкретного пользователя
      queryClient.setQueryData([USERS_CACHE_KEY, response.data.id], response);
      
      toast({
        title: 'Пользователь создан',
        description: `${response.data.firstName} ${response.data.lastName} успешно добавлен в систему.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка создания',
        description: error.message || 'Не удалось создать пользователя.',
      });
    }
  });
}

// Хук для обновления существующего пользователя
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserUpdateDto) => api.users.update(id, data),
    onMutate: async (newData) => {
      // Отменяем текущие запросы для этого пользователя
      await queryClient.cancelQueries({ queryKey: [USERS_CACHE_KEY, id] });
      
      // Сохраняем предыдущие данные
      const previousData = queryClient.getQueryData([USERS_CACHE_KEY, id]);
      
      // Оптимистично обновляем кэш
      queryClient.setQueryData([USERS_CACHE_KEY, id], (old: any) => {
        return {
          ...old,
          data: { ...old.data, ...newData }
        };
      });
      
      return { previousData };
    },
    onSuccess: (response) => {
      // Обновляем кэш с полученными данными
      queryClient.setQueryData([USERS_CACHE_KEY, id], response);
      
      // Инвалидируем кэш списка пользователей
      queryClient.invalidateQueries({ queryKey: [USERS_CACHE_KEY, 'list'] });
      
      toast({
        title: 'Пользователь обновлен',
        description: `Данные ${response.data.firstName} ${response.data.lastName} успешно обновлены.`,
      });
    },
    onError: (error: Error, _, context) => {
      // Откатываем изменения в случае ошибки
      if (context?.previousData) {
        queryClient.setQueryData([USERS_CACHE_KEY, id], context.previousData);
      }
      
      toast({
        variant: 'destructive',
        title: 'Ошибка обновления',
        description: error.message || 'Не удалось обновить пользователя.',
      });
    },
  });
}

// Хук для удаления пользователя
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.users.delete(id),
    onSuccess: (_, id) => {
      // Удаляем из кэша данные удаленного пользователя
      queryClient.removeQueries({ queryKey: [USERS_CACHE_KEY, id] });
      
      // Инвалидируем кэш списка пользователей
      queryClient.invalidateQueries({ queryKey: [USERS_CACHE_KEY, 'list'] });
      
      toast({
        title: 'Пользователь удален',
        description: 'Пользователь успешно удален из системы.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка удаления',
        description: error.message || 'Не удалось удалить пользователя.',
      });
    }
  });
}
