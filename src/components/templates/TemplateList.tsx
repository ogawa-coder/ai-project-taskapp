'use client';

import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/Button';

export function TemplateList() {
  const { state, dispatch, deleteTemplate } = useTaskContext();

  const handleCreate = () => {
    dispatch({ type: 'OPEN_TEMPLATE_FORM' });
  };

  const handleEdit = (id: string) => {
    dispatch({ type: 'OPEN_TEMPLATE_FORM', payload: id });
  };

  const handleDelete = (id: string) => {
    if (confirm('このプロジェクトを削除しますか？')) {
      deleteTemplate(id);
    }
  };

  const handleApply = () => {
    dispatch({ type: 'OPEN_APPLY_TEMPLATE' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">プロジェクト</h3>
        <button
          onClick={handleCreate}
          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="プロジェクトを追加"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {state.templates.length === 0 ? (
        <p className="text-sm text-gray-500">プロジェクトがありません</p>
      ) : (
        <>
          <div className="space-y-2 mb-3">
            {state.templates.map((template) => (
              <div
                key={template.id}
                className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{template.name}</div>
                  <div className="text-xs text-gray-500">
                    {template.phases.length} フェーズ ·{' '}
                    {template.phases.reduce((sum, p) => sum + p.tasks.length, 0)} タスク
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(template.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    title="編集"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                    title="削除"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={handleApply}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            プロジェクトから作成
          </Button>
        </>
      )}
    </div>
  );
}
