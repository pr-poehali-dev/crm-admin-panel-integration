
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  pageCount,
  currentPage,
  onPageChange,
  className,
}: PaginationProps) {
  // Генерация списка страниц с учетом разрывов
  const pages = useMemo(() => {
    const visiblePages = 5; // Количество видимых страниц
    const half = Math.floor(visiblePages / 2);
    
    if (pageCount <= visiblePages) {
      // Если страниц мало, показываем все
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    
    if (currentPage <= half + 1) {
      // Если текущая страница близка к началу
      return [1, 2, 3, null, pageCount - 1, pageCount];
    }
    
    if (currentPage >= pageCount - half) {
      // Если текущая страница близка к концу
      return [1, 2, null, pageCount - 2, pageCount - 1, pageCount];
    }
    
    // Если текущая страница в середине
    return [
      1,
      null,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      null,
      pageCount,
    ];
  }, [currentPage, pageCount]);

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <Icon name="ChevronLeft" className="h-4 w-4" />
        <span className="sr-only">Предыдущая страница</span>
      </Button>
      
      {pages.map((page, i) => 
        page === null ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={page === currentPage ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(page as number)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
        disabled={currentPage === pageCount}
      >
        <Icon name="ChevronRight" className="h-4 w-4" />
        <span className="sr-only">Следующая страница</span>
      </Button>
    </nav>
  );
}
