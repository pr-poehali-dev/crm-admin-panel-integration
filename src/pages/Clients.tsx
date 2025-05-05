
import { useState } from 'react';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import { ClientStatus } from '@/types/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pagination } from '@/components/ui/pagination';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Компонент бейджа для статуса клиента
const StatusBadge = ({ status }: { status: ClientStatus }) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-500">Активный</Badge>;
    case 'inactive':
      return <Badge variant="secondary" className="bg-gray-400">Неактивный</Badge>;
    case 'lead':
      return <Badge variant="outline" className="border-blue-400 text-blue-500">Потенциальный</Badge>;
    default:
      return null;
  }
};

// Форматирование даты
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Нет данных';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Форматирование суммы
const formatCurrency = (amount?: number) => {
  if (amount === undefined) return 'Нет данных';
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [limit] = useState(10);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  
  // Запрос на получение списка клиентов
  const { data, isLoading, isError } = useClients({ page, limit, search, status });
  
  // Мутация для удаления клиента
  const deleteClientMutation = useDeleteClient();
  
  // Обработчик поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Сбрасываем страницу при поиске
  };
  
  // Обработчик изменения фильтра статуса
  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1); // Сбрасываем страницу при изменении фильтра
  };
  
  // Обработчик удаления клиента
  const handleDeleteClient = () => {
    if (clientToDelete) {
      deleteClientMutation.mutate(clientToDelete);
      setClientToDelete(null);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Клиенты</h1>
            <p className="text-muted-foreground">
              Управление клиентской базой
            </p>
          </div>
          <Button className="gap-2">
            <Icon name="PlusCircle" size={16} />
            Добавить клиента
          </Button>
        </div>

        <Separator className="my-6" />
        
        <Card>
          <CardContent className="p-6">
            {/* Фильтры и поиск */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  placeholder="Поиск по названию компании или контактному лицу..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  <Icon name="Search" size={16} />
                </Button>
              </form>
              
              <Select 
                value={status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                  <SelectItem value="lead">Потенциальные</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Таблица клиентов */}
            {isLoading ? (
              <div className="py-20 text-center">
                <Icon name="Loader2" size={32} className="mx-auto animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Загрузка клиентов...</p>
              </div>
            ) : isError ? (
              <div className="py-20 text-center">
                <Icon name="AlertTriangle" size={32} className="mx-auto text-destructive" />
                <p className="mt-2 text-muted-foreground">Ошибка при загрузке клиентов</p>
              </div>
            ) : data?.data.length === 0 ? (
              <div className="py-20 text-center">
                <Icon name="Briefcase" size={32} className="mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Клиенты не найдены</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Компания</TableHead>
                      <TableHead>Контактное лицо</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Последний заказ</TableHead>
                      <TableHead>Всего заказов</TableHead>
                      <TableHead>Сумма заказов</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.companyName}</TableCell>
                        <TableCell>
                          <div>
                            <div>{client.contactPerson}</div>
                            <div className="text-sm text-muted-foreground">
                              {client.contacts.find(c => c.primary)?.value}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={client.status} />
                        </TableCell>
                        <TableCell>
                          {formatDate(client.lastOrderDate)}
                        </TableCell>
                        <TableCell>
                          {client.totalOrders ?? 0}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(client.totalSpent)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Icon name="MoreVertical" size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Icon name="Eye" className="mr-2 h-4 w-4" />
                                Просмотр
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Icon name="Pencil" className="mr-2 h-4 w-4" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Icon name="FileText" className="mr-2 h-4 w-4" />
                                Заказы клиента
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setClientToDelete(client.id);
                                    }}
                                    className="text-destructive"
                                  >
                                    <Icon name="Trash2" className="mr-2 h-4 w-4" />
                                    Удалить
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Удаление клиента</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Вы уверены, что хотите удалить клиента <strong>{client.companyName}</strong>? 
                                      Это действие невозможно отменить.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={handleDeleteClient}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Пагинация */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination 
                  pageCount={data.totalPages} 
                  currentPage={page} 
                  onPageChange={setPage} 
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
