
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole, User } from "@/types/auth";
import { AvatarUpload } from "./AvatarUpload";

// Схема валидации для создания пользователя
export const userCreateSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов" })
    .max(50, { message: "Имя должно содержать не более 50 символов" }),
  lastName: z
    .string()
    .min(2, { message: "Фамилия должна содержать не менее 2 символов" })
    .max(50, { message: "Фамилия должна содержать не более 50 символов" }),
  email: z
    .string()
    .email({ message: "Введите корректный email-адрес" }),
  role: z.enum(["admin", "manager", "user"], {
    required_error: "Выберите роль пользователя",
  }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать не менее 8 символов" })
    .regex(/[A-Z]/, { message: "Пароль должен содержать хотя бы одну заглавную букву" })
    .regex(/[0-9]/, { message: "Пароль должен содержать хотя бы одну цифру" }),
  avatar: z.string().optional(),
});

// Схема валидации для редактирования пользователя
export const userUpdateSchema = userCreateSchema
  .omit({ password: true, email: true })
  .extend({
    password: z
      .string()
      .min(8, { message: "Пароль должен содержать не менее 8 символов" })
      .regex(/[A-Z]/, { message: "Пароль должен содержать хотя бы одну заглавную букву" })
      .regex(/[0-9]/, { message: "Пароль должен содержать хотя бы одну цифру" })
      .optional(),
  });

export type UserFormValues = z.infer<typeof userCreateSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormValues) => void;
  isLoading: boolean;
  isEditMode?: boolean;
}

export function UserForm({ 
  user, 
  onSubmit, 
  isLoading, 
  isEditMode = false 
}: UserFormProps) {
  // Используем правильную схему в зависимости от режима
  const schema = isEditMode ? userUpdateSchema : userCreateSchema;
  
  // Инициализация формы с React Hook Form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: user?.role || "user",
      password: "",
      avatar: user?.avatar || "",
    },
  });

  // Обновляем форму при изменении пользователя
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        password: "",
        avatar: user.avatar,
      });
    }
  }, [user, form]);

  // Обработчик сохранения формы
  const handleSubmit = (data: UserFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <AvatarUpload 
          value={form.watch("avatar")} 
          onChange={(value) => form.setValue("avatar", value)}
          name={`${form.watch("firstName")} ${form.watch("lastName")}`}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Иван" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фамилия</FormLabel>
                <FormControl>
                  <Input placeholder="Петров" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {!isEditMode && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Роль</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="manager">Менеджер</SelectItem>
                  <SelectItem value="user">Пользователь</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditMode ? "Новый пароль (оставьте пустым, чтобы не менять)" : "Пароль"}</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder={isEditMode ? "Новый пароль" : "Пароль"} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Сбросить
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Сохранение..." : isEditMode ? "Сохранить" : "Создать"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
