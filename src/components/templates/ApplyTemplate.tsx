'use client';

import { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export function ApplyTemplate() {
  const { state, dispatch, applyTemplate } = useTaskContext();
  const { isApplyTemplateOpen } = state.ui;

  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('none');

  const handleClose = () => {
    dispatch({ type: 'CLOSE_APPLY_TEMPLATE' });
    setSelectedTemplateId('');
    setSelectedCategoryId('none');
  };

  const handleApply = () => {
    if (!selectedTemplateId) return;
    applyTemplate(selectedTemplateId, selectedCategoryId === 'none' ? null : selectedCategoryId);
    handleClose();
  };

  const selectedTemplate = state.templates.find((t) => t.id === selectedTemplateId);

  const templateOptions = [
    { value: '', label: 'プロジェクトを選択...' },
    ...state.templates.map((t) => ({ value: t.id, label: t.name })),
  ];

  const categoryOptions = [
    { value: 'none', label: 'カテゴリなし' },
    ...state.categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <Modal
      isOpen={isApplyTemplateOpen}
      onClose={handleClose}
      title="プロジェクトからタスクを作成"
      size="lg"
    >
      <div className="space-y-4">
        <Select
          label="プロジェクト"
          options={templateOptions}
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
        />

        {selectedTemplate && (
          <>
            {selectedTemplate.description && (
              <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
            )}

            <Select
              label="カテゴリ（作成されるタスクに割り当て）"
              options={categoryOptions}
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />

            {/* Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">作成されるタスク（プレビュー）</h4>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                {selectedTemplate.phases.map((phase) =>
                  phase.tasks.map((task, taskIndex) => (
                    <div key={`${phase.id}-${taskIndex}`} className="px-3 py-2 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          task.priority === 'high'
                            ? 'bg-red-500'
                            : task.priority === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                        }`}
                      />
                      <span className="text-sm text-gray-900">
                        <span className="text-blue-600 font-medium">[{phase.name}]</span>{' '}
                        {task.title}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                合計{' '}
                {selectedTemplate.phases.reduce((sum, p) => sum + p.tasks.length, 0)}{' '}
                タスクが作成されます
              </p>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            disabled={!selectedTemplateId}
          >
            タスクを作成
          </Button>
        </div>
      </div>
    </Modal>
  );
}
