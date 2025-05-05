
import { useState } from 'react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pagination } from '@/components/ui/pagination';
import Icon from '@/components/ui/icon';
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
import { UserRole } from '@/types/auth';
import { UserDialog } from '@/components/users/UserDialog';

// Компонент бейджа для роли пользователя
const RoleBadge = ({ role }: { role: UserRole }) => {
  switch (role) {
    case 'admin':
      return <Badge variant="destructive" className="bg-red-500">Администратор</Badge>;
    case 'manager':
      return <Badge variant="default" className="bg-blue-500">Менеджер</Badge>;
    case 'user':
      return <Badge variant="outline">Пользователь</Badge>;
    default:
      return null;
  }
};

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit] = useState(10);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Запрос на получение списка пользователей
  const { data, isLoading, isError } = useUsers({ page, limit, search });
  
  // Мутация для удаления пользователя
  const deleteUserMutation = useDeleteUser();
  
  // Обработчик поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Сбрасываем страницу при поиске
  };
  
  // Обработчик удаления пользователя
  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete);
      setUserToDelete(null);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Пользователи</h1>
            <p className="text-muted-foreground">
              Управление пользователями системы
            </p>
          </div>
          <UserDialog
            title="Добавить пользователя"
            description="Создайте нового пользователя системы"
            trigger={
              <Button className="gap-2">
                <Icon name="UserPlus" size={16} />
                Добавить пользователя
              </Button>
            }
          />
        </div>

        <Separator className="my-6" />
        
        <Card>
          <CardContent className="p-6">
            {/* Фильтры и поиск */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  placeholder="Поиск по имени или email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  <Icon name="Search" size={16} />
                </Button>
              </form>
            </div>
            
            {/* Таблица пользователей */}
            {isLoading ? (
              <div className="py-20 text-center">
                <Icon name="Loader2" size={32} className="mx-auto animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Загрузка пользователей...</p>
              </div>
            ) : isError ? (
              <div className="py-20 text-center">
                <Icon name="AlertTriangle" size={32} className="mx-auto text-destructive" />
                <p className="mt-2 text-muted-foreground">Ошибка при загрузке пользователей</p>
              </div>
            ) : data?.data.length === 0 ? (
              <div className="py-20 text-center">
                <Icon name="Users" size={32} className="mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Пользователи не найдены</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead>Имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead className="text-right w-32">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                {user.firstName?.charAt(0)}
                                {user.lastName?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <UserDialog
                              user={user}
                              title="Редактировать пользователя"
                              description="Изменение данных пользователя"
                              trigger={
                                <Button variant="ghost" size="icon">
                                  <Icon name="Pencil" size={16} />
                                </Button>
                              }
                            />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => setUserToDelete(user.id)}
                                >
                                  <Icon name="Trash2" size={16} className="text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удаление пользователя</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Вы уверены, что хотите удалить пользователя <strong>{user.firstName} {user.lastName}</strong>? 
                                    Это действие невозможно отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDeleteUser}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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
