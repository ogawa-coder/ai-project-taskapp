'use client';

import { useTaskContext } from '@/contexts/TaskContext';
import { CATEGORY_COLORS } from '@/types';

export function CategoryList() {
  const { state, dispatch, deleteCategory } = useTaskContext();

  const handleAddCategory = () => {
    dispatch({ type: 'OPEN_CATEGORY_FORM' });
  };

  const handleEditCategory = (id: string) => {
    dispatch({ type: 'OPEN_CATEGORY_FORM', payload: id });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`カテゴリ「${name}」を削除しますか？`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">カテゴリ</h3>
        <button
          onClick={handleAddCategory}
          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          title="カテゴリを追加"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {state.categories.length === 0 ? (
        <p className="text-sm text-gray-500 py-2">カテゴリがありません</p>
      ) : (
        <ul className="space-y-1">
          {state.categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 group"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditCategory(category.id)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="編集"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="削除"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
