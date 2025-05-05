
import { Client, ClientCreateDto, ClientUpdateDto, ClientStatus } from '@/types/client';
import { ApiResponse, PaginatedResponse, QueryParams } from './api';

// Константы для имитации API запросов
const DELAY = 1000;

// Мок-данные клиентов
const mockClients: Client[] = [
  {
    id: '1',
    companyName: 'ООО "ТехноСистемы"',
    contactPerson: 'Алексей Смирнов',
    contacts: [
      { type: 'phone', value: '+7 (905) 123-4567', primary: true },
      { type: 'email', value: 'info@technosystems.ru' }
    ],
    addresses: [
      { street: 'ул. Ленина, 42', city: 'Москва', zip: '123456', country: 'Россия', isMain: true }
    ],
    status: 'active',
    notes: 'Крупный клиент, работаем с 2020 года',
    createdAt: '2020-03-15T10:00:00Z',
    updatedAt: '2023-05-20T14:30:00Z',
    lastOrderDate: '2023-05-18T09:15:00Z',
    totalOrders: 23,
    totalSpent: 1540000
  },
  {
    id: '2',
    companyName: 'ИП Петров А.В.',
    contactPerson: 'Андрей Петров',
    contacts: [
      { type: 'phone', value: '+7 (912) 345-6789', primary: true },
      { type: 'email', value: 'petrov@example.com' }
    ],
    addresses: [
      { street: 'ул. Гагарина, 15', city: 'Екатеринбург', zip: '620000', country: 'Россия', isMain: true }
    ],
    status: 'active',
    createdAt: '2021-06-10T08:20:00Z',
    updatedAt: '2023-04-12T11:45:00Z',
    lastOrderDate: '2023-04-10T16:30:00Z',
    totalOrders: 8,
    totalSpent: 320000
  },
  {
    id: '3',
    companyName: 'ЗАО "Инновации"',
    contactPerson: 'Елена Козлова',
    contacts: [
      { type: 'phone', value: '+7 (495) 987-6543', primary: true },
      { type: 'email', value: 'support@innovations.ru' }
    ],
    addresses: [
      { street: 'Пресненская наб., 12', city: 'Москва', zip: '123317', country: 'Россия', isMain: true }
    ],
    status: 'inactive',
    notes: 'Приостановили сотрудничество в 2022 году',
    createdAt: '2019-11-05T13:40:00Z',
    updatedAt: '2022-09-28T09:15:00Z',
    lastOrderDate: '2022-08-15T10:20:00Z',
    totalOrders: 15,
    totalSpent: 890000
  },
  {
    id: '4',
    companyName: 'ООО "СтройГрад"',
    contactPerson: 'Виктор Иванов',
    contacts: [
      { type: 'phone', value: '+7 (913) 456-7890', primary: true },
      { type: 'email', value: 'info@stroygrad.ru' }
    ],
    addresses: [
      { street: 'ул. Строителей, 8', city: 'Новосибирск', zip: '630000', country: 'Россия', isMain: true }
    ],
    status: 'active',
    createdAt: '2021-02-18T09:30:00Z',
    updatedAt: '2023-06-01T15:10:00Z',
    lastOrderDate: '2023-05-28T14:25:00Z',
    totalOrders: 12,
    totalSpent: 750000
  },
  {
    id: '5',
    companyName: 'ООО "Меркурий"',
    contactPerson: 'Мария Сидорова',
    contacts: [
      { type: 'phone', value: '+7 (812) 345-6789', primary: true },
      { type: 'email', value: 'contact@mercury.ru' }
    ],
    addresses: [
      { street: 'Невский пр., 30', city: 'Санкт-Петербург', zip: '190000', country: 'Россия', isMain: true }
    ],
    status: 'lead',
    notes: 'Потенциальный клиент, ведутся переговоры',
    createdAt: '2023-01-20T11:45:00Z',
    updatedAt: '2023-01-20T11:45:00Z',
    totalOrders: 0,
    totalSpent: 0
  }
];

// Mock API для работы с клиентами
export const clientsApi = {
  getAll: (params?: QueryParams): Promise<PaginatedResponse<Client>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { page = 1, limit = 10, search = '', status = '' } = params || {};
        
        let filtered = [...mockClients];
        
        // Фильтрация по статусу
        if (status) {
          filtered = filtered.filter(client => client.status === status);
        }
        
        // Поиск по названию компании или контактному лицу
        if (search) {
          const query = search.toLowerCase();
          filtered = filtered.filter(client => 
            client.companyName.toLowerCase().includes(query) || 
            client.contactPerson.toLowerCase().includes(query)
          );
        }
        
        // Сортировка по дате обновления (от новых к старым)
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
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
  
  getById: (id: string): Promise<ApiResponse<Client>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const client = mockClients.find(c => c.id === id);
        
        if (client) {
          resolve({ data: client, status: 200 });
        } else {
          reject(new Error('Клиент не найден'));
        }
      }, DELAY);
    });
  },
  
  create: (data: ClientCreateDto): Promise<ApiResponse<Client>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClient: Client = {
          id: String(mockClients.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalOrders: 0,
          totalSpent: 0
        };
        
        mockClients.push(newClient);
        
        resolve({
          data: newClient,
          status: 201,
          message: 'Клиент успешно создан'
        });
      }, DELAY);
    });
  },
  
  update: (id: string, data: ClientUpdateDto): Promise<ApiResponse<Client>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockClients.findIndex(c => c.id === id);
        
        if (index !== -1) {
          mockClients[index] = {
            ...mockClients[index],
            ...data,
            updatedAt: new Date().toISOString()
          };
          
          resolve({
            data: mockClients[index],
            status: 200,
            message: 'Клиент успешно обновлен'
          });
        } else {
          reject(new Error('Клиент не найден'));
        }
      }, DELAY);
    });
  },
  
  delete: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockClients.findIndex(c => c.id === id);
        
        if (index !== -1) {
          mockClients.splice(index, 1);
          resolve();
        } else {
          reject(new Error('Клиент не найден'));
        }
      }, DELAY);
    });
  }
};
