import { ChangeEvent, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useDebounce } from '@/shared/utils/useDebounce.ts';
import { cn } from '@/lib/utils.ts';

interface TaskTextareaProps {
  taskId: number;
  initialTitle: string;
  onTitleChange: (taskId: number, title: string) => void;
}

export function TaskTextarea({ taskId, initialTitle, onTitleChange }: TaskTextareaProps) {
  const [localTitle, setLocalTitle] = useState(initialTitle);
  const [isComposing, setIsComposing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const debouncedTitle = useDebounce(localTitle, 300);
  const prevDebouncedTitle = useRef(debouncedTitle);

  useEffect(() => {
    setLocalTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (!isComposing && debouncedTitle !== prevDebouncedTitle.current) {
      prevDebouncedTitle.current = debouncedTitle;
      onTitleChange(taskId, debouncedTitle);
    }
  }, [debouncedTitle, isComposing, taskId, onTitleChange]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLocalTitle(e.target.value);
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Space' && isComposing) {
      setIsComposing(false);
    }
  };

  if (!isEditing) {
    return (
      <div
        onDoubleClick={() => setIsEditing(true)}
        className={cn(
          'line-clamp-2 min-h-[24px] flex-1 cursor-text',
          localTitle.length === 0 && 'text-gray-400'
        )}
      >
        {localTitle || 'Double click to edit...'}
      </div>
    );
  }

  return (
    <textarea
      value={localTitle}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      onBlur={() => setIsEditing(false)}
      className="flex flex-1 resize-none bg-transparent text-black focus:outline-none"
      placeholder="Enter task title..."
      rows={2}
    />
  );
}
