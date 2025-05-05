
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm, UserFormValues } from "./UserForm";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { User } from "@/types/auth";

interface UserDialogProps {
  user?: User;
  trigger: React.ReactNode;
  title: string;
  description?: string;
}

export function UserDialog({
  user,
  trigger,
  title,
  description,
}: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditMode = !!user;
  
  // Хуки для создания и обновления пользователя
  const createUser = useCreateUser();
  const updateUser = user ? useUpdateUser(user.id) : null;
  
  // Определяем, идет ли процесс загрузки
  const isLoading = isEditMode
    ? updateUser?.isPending
    : createUser.isPending;
  
  // Обработчик отправки формы
  const handleSubmit = (data: UserFormValues) => {
    if (isEditMode && updateUser) {
      // Пропускаем пустой пароль при редактировании
      const updateData = data.password
        ? data
        : { ...data, password: undefined };
      
      updateUser.mutate(updateData, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    } else {
      createUser.mutate(data, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          isLoading={!!isLoading}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
}
