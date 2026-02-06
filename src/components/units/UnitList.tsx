'use client';

import { useTaskContext } from '@/contexts/TaskContext';

export function UnitList() {
  const { state, dispatch, deleteUnit } = useTaskContext();

  const handleAdd = () => {
    dispatch({ type: 'OPEN_UNIT_FORM' });
  };

  const handleDelete = (id: string) => {
    if (confirm('このユニットを削除しますか？関連するプロジェクトからユニットが解除されます。')) {
      deleteUnit(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">ユニット</h3>
        <button
          onClick={handleAdd}
          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="ユニットを追加"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {state.units.length === 0 ? (
        <p className="text-sm text-gray-500">ユニットがありません</p>
      ) : (
        <div className="space-y-1">
          {state.units.map((unit) => (
            <div
              key={unit.id}
              className="group flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-700 truncate">{unit.name}</span>
              <button
                onClick={() => handleDelete(unit.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="削除"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
