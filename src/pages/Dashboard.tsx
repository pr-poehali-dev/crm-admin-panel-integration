
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import DashboardLayout from '@/components/DashboardLayout';

// Имитация данных для дашборда
const dashboardData = {
  totalUsers: 254,
  activeUsers: 189,
  newUsersToday: 12,
  totalOrders: 876,
  pendingOrders: 24,
  revenue: 1250000
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
            <p className="text-muted-foreground">
              Добро пожаловать, {user.firstName} {user.lastName}!
            </p>
          </div>
          <Button variant="outline" onClick={() => logout()} className="gap-2">
            <Icon name="LogOut" size={16} />
            Выйти
          </Button>
        </div>

        <Separator className="my-6" />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="bg-muted h-24" />
                <CardContent className="h-12 mt-4 bg-muted rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
                <Icon name="Users" className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.activeUsers} активных пользователей
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Новые пользователи</CardTitle>
                <Icon name="UserPlus" className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.newUsersToday}</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardData.newUsersToday} за сегодня
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
                <Icon name="ShoppingCart" className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.pendingOrders} заказов в обработке
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Выручка</CardTitle>
                <Icon name="DollarSign" className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{new Intl.NumberFormat('ru-RU').format(dashboardData.revenue)} ₽</div>
                <p className="text-xs text-muted-foreground">
                  За текущий месяц
                </p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Недавняя активность</CardTitle>
                <Icon name="Activity" className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: 'Иван Петров', action: 'добавил нового клиента', time: '5 минут назад' },
                    { user: 'Александра Иванова', action: 'создала новую задачу', time: '32 минуты назад' },
                    { user: 'Сергей Сидоров', action: 'выполнил задачу №156', time: '2 часа назад' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Icon name="User" className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm"><strong>{activity.user}</strong> {activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
