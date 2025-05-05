
import { User, UserRole } from '@/types/auth';

// Базовый URL API
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

// Тип для настроек запроса
type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  isFormData?: boolean;
};

// Интерфейсы ответов API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Параметры для пагинации и фильтрации
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

// Функция для создания URL с параметрами
function createUrl(endpoint: string, params?: QueryParams): string {
  const url = new URL(`${API_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

// Основная функция для выполнения запросов
async function fetchApi<T>(
  endpoint: string,
  options: RequestOptions = {},
  params?: QueryParams
): Promise<T> {
  const { method = 'GET', body, headers = {}, isFormData = false } = options;
  const token = localStorage.getItem('token');
  
  const defaultHeaders: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  const url = createUrl(endpoint, params);
  
  try {
    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? (isFormData ? body as FormData : JSON.stringify(body)) : undefined,
    });

    // Обработка ошибок от сервера
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
    }

    // Если ответ пустой или это метод DELETE
    if (response.status === 204 || method === 'DELETE') {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Пользовательские интерфейсы для работы с API
export interface UserCreateDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UserUpdateDto {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  avatar?: string;
}

// API клиент для работы с пользователями
export const usersApi = {
  getAll: (params?: QueryParams) => 
    fetchApi<PaginatedResponse<User>>('/users', {}, params),
  
  getById: (id: string) => 
    fetchApi<ApiResponse<User>>(`/users/${id}`),
  
  create: (data: UserCreateDto) => 
    fetchApi<ApiResponse<User>>('/users', { method: 'POST', body: data }),
  
  update: (id: string, data: UserUpdateDto) => 
    fetchApi<ApiResponse<User>>(`/users/${id}`, { method: 'PATCH', body: data }),
  
  delete: (id: string) => 
    fetchApi<void>(`/users/${id}`, { method: 'DELETE' }),
};

// В этом объекте можно экспортировать другие API клиенты для разных ресурсов
export const api = {
  users: usersApi,
  // Здесь можно добавить другие API клиенты (products, orders и т.д.)
};

// Функция для имитации API запросов (удалить в production)
const DELAY = 1000;
const mockUsers: User[] = [
  { id: '1', email: 'admin@example.com', firstName: 'Администратор', lastName: 'Системы', role: 'admin' },
  { id: '2', email: 'manager@example.com', firstName: 'Иван', lastName: 'Петров', role: 'manager' },
  { id: '3', email: 'user1@example.com', firstName: 'Анна', lastName: 'Сидорова', role: 'user' },
  { id: '4', email: 'user2@example.com', firstName: 'Петр', lastName: 'Иванов', role: 'user' },
  { id: '5', email: 'user3@example.com', firstName: 'Елена', lastName: 'Смирнова', role: 'user' },
];

// Mock API для тестирования без бэкенда
export const mockApi = {
  users: {
    getAll: (params?: QueryParams): Promise<PaginatedResponse<User>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const { page = 1, limit = 10, search = '' } = params || {};
          
          let filtered = [...mockUsers];
          
          // Поиск по имени или email
          if (search) {
            const query = search.toLowerCase();
            filtered = filtered.filter(user => 
              user.firstName.toLowerCase().includes(query) || 
              user.lastName.toLowerCase().includes(query) || 
              user.email.toLowerCase().includes(query)
            );
          }
          
          // Пагинация
          const start = (page - 1) * limit;
          const end = start + limit;
          const paginatedData = filtered.slice(start, end);
          
          resolve({
            data: paginatedData,
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit)
          });
        }, DELAY);
      });
    },
    
    getById: (id: string): Promise<ApiResponse<User>> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = mockUsers.find(u => u.id === id);
          
          if (user) {
            resolve({ data: user, status: 200 });
          } else {
            reject(new Error('Пользователь не найден'));
          }
        }, DELAY);
      });
    },
    
    create: (data: UserCreateDto): Promise<ApiResponse<User>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser: User = {
            id: String(mockUsers.length + 1),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role
          };
          
          mockUsers.push(newUser);
          
          resolve({
            data: newUser,
            status: 201,
            message: 'Пользователь успешно создан'
          });
        }, DELAY);
      });
    },
    
    update: (id: string, data: UserUpdateDto): Promise<ApiResponse<User>> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockUsers.findIndex(u => u.id === id);
          
          if (index !== -1) {
            mockUsers[index] = {
              ...mockUsers[index],
              ...data
            };
            
            resolve({
              data: mockUsers[index],
              status: 200,
              message: 'Пользователь успешно обновлен'
            });
          } else {
            reject(new Error('Пользователь не найден'));
          }
        }, DELAY);
      });
    },
    
    delete: (id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockUsers.findIndex(u => u.id === id);
          
          if (index !== -1) {
            mockUsers.splice(index, 1);
            resolve();
          } else {
            reject(new Error('Пользователь не найден'));
          }
        }, DELAY);
      });
    }
  }
};
