
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

// Типы для навигационных элементов
interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles?: UserRole[];
}

// Навигационные группы
const navItems: { title: string; items: NavItem[] }[] = [
  {
    title: 'Основное',
    items: [
      {
        title: 'Дашборд',
        href: '/dashboard',
        icon: 'LayoutDashboard',
      },
      {
        title: 'Клиенты',
        href: '/customers',
        icon: 'Users',
      },
      {
        title: 'Заказы',
        href: '/orders',
        icon: 'ShoppingCart',
      },
      {
        title: 'Продукты',
        href: '/products',
        icon: 'Package',
      },
    ],
  },
  {
    title: 'Управление',
    items: [
      {
        title: 'Пользователи',
        href: '/users',
        icon: 'UserCog',
        roles: ['admin'],
      },
      {
        title: 'Настройки',
        href: '/settings',
        icon: 'Settings',
        roles: ['admin', 'manager'],
      },
      {
        title: 'Отчеты',
        href: '/reports',
        icon: 'BarChart2',
        roles: ['admin', 'manager'],
      },
    ],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Проверка прав доступа для элемента меню
  const hasAccess = (item: NavItem) => {
    if (!item.roles || item.roles.length === 0) return true;
    return user && item.roles.includes(user.role);
  };
  
  // Компонент элемента навигации
  const NavLink = ({ item }: { item: NavItem }) => {
    if (!hasAccess(item)) return null;
    
    return (
      <Link
        to={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          location.pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )}
      >
        <Icon name={item.icon} className="h-4 w-4" />
        {item.title}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Icon name="Menu" className="h-5 w-5" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-7">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <Icon name="LayoutDashboard" className="h-5 w-5 text-primary" />
                <span>CRM Система</span>
              </Link>
            </div>
            <nav className="flex flex-col gap-4 px-2 py-6">
              {navItems.map((group, i) => {
                const hasVisibleItems = group.items.some(hasAccess);
                if (!hasVisibleItems) return null;
                
                return (
                  <div key={i} className="px-4 py-2">
                    <h4 className="mb-1 text-xs font-semibold text-foreground">
                      {group.title}
                    </h4>
                    <div className="grid gap-1">
                      {group.items.map((item, j) => (
                        <NavLink key={j} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-semibold md:hidden">
            <Icon name="LayoutDashboard" className="h-5 w-5 text-primary" />
            <span>CRM Система</span>
          </Link>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Icon name="Bell" className="h-5 w-5" />
            <span className="sr-only">Уведомления</span>
          </Button>
          <Link to="/profile">
            <div className="flex items-center gap-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </div>
              )}
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-muted-foreground">{user?.role === 'admin' ? 'Администратор' : user?.role === 'manager' ? 'Менеджер' : 'Пользователь'}</div>
              </div>
            </div>
          </Link>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden border-r bg-background md:block md:w-64">
          <div className="flex h-14 items-center border-b px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Icon name="LayoutDashboard" className="h-5 w-5 text-primary" />
              <span>CRM Система</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-4 p-4">
            {navItems.map((group, i) => {
              const hasVisibleItems = group.items.some(hasAccess);
              if (!hasVisibleItems) return null;
              
              return (
                <div key={i}>
                  <h4 className="mb-1 px-2 text-xs font-semibold text-foreground">
                    {group.title}
                  </h4>
                  <div className="grid gap-1">
                    {group.items.map((item, j) => (
                      <NavLink key={j} item={item} />
                    ))}
                  </div>
                  {i < navItems.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
