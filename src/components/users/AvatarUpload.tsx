
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";

interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
  name?: string;
}

export function AvatarUpload({ value, onChange, name = "" }: AvatarUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  // Получение инициалов из имени
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };
  
  // Обработчик загрузки файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение");
      return;
    }
    
    // Проверка размера файла (не более 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5 МБ");
      return;
    }
    
    // Создание URL для предпросмотра
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Обработчик удаления аватара
  const handleRemove = () => {
    onChange("");
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-24 h-24 rounded-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Avatar className="w-24 h-24 border-2 border-muted">
          <AvatarImage src={value} alt={name} />
          <AvatarFallback className="text-xl bg-primary/10 text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        {isHovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="flex gap-2">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="rounded-full p-2 bg-white/20 hover:bg-white/30 transition-colors">
                  <Icon name="Upload" className="h-5 w-5 text-white" />
                </div>
              </label>
              
              {value && (
                <button 
                  type="button" 
                  onClick={handleRemove}
                  className="rounded-full p-2 bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Icon name="Trash2" className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <label htmlFor="avatar-upload">
        <Button type="button" variant="outline" size="sm" className="cursor-pointer">
          {value ? "Изменить аватар" : "Загрузить аватар"}
        </Button>
      </label>
    </div>
  );
}
