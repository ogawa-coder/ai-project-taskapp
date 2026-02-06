'use client';

import { useTaskContext } from '@/contexts/TaskContext';
import { Select } from '@/components/ui';
import { PRIORITY_LABELS, STATUS_LABELS, SORT_FIELD_LABELS, SortField, SortOrder } from '@/types';

export function TaskFilters() {
  const { state, dispatch } = useTaskContext();
  const { filters, sortOptions } = state;

  const statusOptions = [
    { value: 'all', label: 'すべてのステータス' },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const priorityOptions = [
    { value: 'all', label: 'すべての優先度' },
    ...Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const categoryOptions = [
    { value: 'all', label: 'すべてのカテゴリ' },
    ...state.categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const sortFieldOptions = Object.entries(SORT_FIELD_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const sortOrderOptions = [
    { value: 'desc', label: '降順' },
    { value: 'asc', label: '昇順' },
  ];

  const handleResetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.categoryId !== 'all' ||
    filters.tagIds.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">フィルター</h3>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            リセット
          </button>
        )}
      </div>

      <Select
        id="filter-status"
        value={filters.status}
        onChange={(e) =>
          dispatch({ type: 'SET_FILTERS', payload: { status: e.target.value as any } })
        }
        options={statusOptions}
      />

      <Select
        id="filter-priority"
        value={filters.priority}
        onChange={(e) =>
          dispatch({ type: 'SET_FILTERS', payload: { priority: e.target.value as any } })
        }
        options={priorityOptions}
      />

      {state.categories.length > 0 && (
        <Select
          id="filter-category"
          value={filters.categoryId}
          onChange={(e) =>
            dispatch({
              type: 'SET_FILTERS',
              payload: { categoryId: e.target.value as any },
            })
          }
          options={categoryOptions}
        />
      )}

      {state.tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">タグ</label>
          <div className="flex flex-wrap gap-2">
            {state.tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  const newTagIds = filters.tagIds.includes(tag.id)
                    ? filters.tagIds.filter((id) => id !== tag.id)
                    : [...filters.tagIds, tag.id];
                  dispatch({ type: 'SET_FILTERS', payload: { tagIds: newTagIds } });
                }}
                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                  filters.tagIds.includes(tag.id)
                    ? 'border-transparent text-white'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
                style={
                  filters.tagIds.includes(tag.id)
                    ? { backgroundColor: tag.color }
                    : undefined
                }
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <hr className="border-gray-200" />

      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">並び替え</h3>

        <Select
          id="sort-field"
          value={sortOptions.field}
          onChange={(e) =>
            dispatch({
              type: 'SET_SORT',
              payload: { ...sortOptions, field: e.target.value as SortField },
            })
          }
          options={sortFieldOptions}
        />

        <Select
          id="sort-order"
          value={sortOptions.order}
          onChange={(e) =>
            dispatch({
              type: 'SET_SORT',
              payload: { ...sortOptions, order: e.target.value as SortOrder },
            })
          }
          options={sortOrderOptions}
        />
      </div>
    </div>
  );
}
