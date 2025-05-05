
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Начальное состояние авторизации
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  // Проверка сохраненного токена при запуске
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setAuthState({
          user,
          isAuthenticated: true,
          token
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Функция авторизации (в будущем здесь будет настоящий API запрос)
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Здесь будет запрос к API для авторизации
      // Временный мок для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Пример успешной авторизации с тестовыми данными
      if (email === 'admin@example.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          email,
          firstName: 'Администратор',
          lastName: 'Системы',
          role: 'admin'
        };
        
        const mockToken = 'mock-jwt-token';
        
        // Сохранение данных в localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          token: mockToken
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода из системы
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState(initialState);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}
