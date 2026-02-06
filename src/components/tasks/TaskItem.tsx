'use client';

import { Task, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types';
import { useTaskContext } from '@/contexts/TaskContext';
import { Badge } from '@/components/ui';
import { formatDate, isOverdue } from '@/utils';
import clsx from 'clsx';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { dispatch, toggleTaskStatus, deleteTask, getCategoryById, getTagById } =
    useTaskContext();

  const category = task.categoryId ? getCategoryById(task.categoryId) : null;
  const isTaskOverdue = task.status !== 'completed' && isOverdue(task.dueDate);

  const handleEdit = () => {
    dispatch({ type: 'OPEN_TASK_FORM', payload: task.id });
  };

  const handleDelete = () => {
    if (window.confirm('このタスクを削除しますか？')) {
      deleteTask(task.id);
    }
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-lg border p-4 transition-all hover:shadow-md',
        task.status === 'completed' ? 'opacity-60' : '',
        isTaskOverdue ? 'border-red-300' : 'border-gray-200'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className={clsx(
            'flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 transition-colors',
            task.status === 'completed'
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-blue-500'
          )}
        >
          {task.status === 'completed' && (
            <svg
              className="w-full h-full text-white p-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={clsx(
                'font-medium text-gray-900 truncate',
                task.status === 'completed' && 'line-through text-gray-500'
              )}
            >
              {task.title}
            </h3>
            <span
              className="flex-shrink-0 w-2 h-2 rounded-full"
              style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
              title={`優先度: ${PRIORITY_LABELS[task.priority]}`}
            />
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            {category && (
              <Badge color={category.color} size="sm">
                {category.name}
              </Badge>
            )}

            {/* Tags */}
            {task.tagIds.map((tagId) => {
              const tag = getTagById(tagId);
              if (!tag) return null;
              return (
                <Badge key={tagId} color={tag.color} size="sm" variant="outline">
                  {tag.name}
                </Badge>
              );
            })}

            {/* Due date */}
            {task.dueDate && (
              <span
                className={clsx(
                  'text-xs',
                  isTaskOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
                )}
              >
                {isTaskOverdue && '⚠️ '}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
            title="編集"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
            title="削除"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
