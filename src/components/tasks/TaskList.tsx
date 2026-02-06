'use client';

import { useTaskContext } from '@/contexts/TaskContext';
import { TaskItem } from './TaskItem';

export function TaskList() {
  const { filteredTasks, state } = useTaskContext();

  if (filteredTasks.length === 0) {
    const hasFilters =
      state.filters.status !== 'all' ||
      state.filters.priority !== 'all' ||
      state.filters.categoryId !== 'all' ||
      state.filters.tagIds.length > 0 ||
      state.filters.searchQuery.trim() !== '';

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 mb-4 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {hasFilters ? 'タスクが見つかりません' : 'タスクがありません'}
        </h3>
        <p className="text-sm text-gray-500">
          {hasFilters
            ? 'フィルター条件を変更してください'
            : '「新規タスク」ボタンでタスクを追加しましょう'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
