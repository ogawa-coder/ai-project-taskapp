'use client';

import { useTaskContext } from '@/contexts/TaskContext';

export function TagList() {
  const { state, dispatch, deleteTag } = useTaskContext();

  const handleAddTag = () => {
    dispatch({ type: 'OPEN_TAG_FORM' });
  };

  const handleDeleteTag = (id: string, name: string) => {
    if (window.confirm(`タグ「${name}」を削除しますか？`)) {
      deleteTag(id);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">タグ</h3>
        <button
          onClick={handleAddTag}
          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          title="タグを追加"
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

      {state.tags.length === 0 ? (
        <p className="text-sm text-gray-500 py-2">タグがありません</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {state.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full text-white group"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
              <button
                onClick={() => handleDeleteTag(tag.id, tag.name)}
                className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                title="削除"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
