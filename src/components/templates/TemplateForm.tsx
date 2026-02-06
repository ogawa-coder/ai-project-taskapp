'use client';

import { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Priority } from '@/types';

const PRIORITY_OPTIONS = [
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'low', label: '低' },
];

interface PhaseFormData {
  name: string;
  tasks: {
    title: string;
    description: string;
    priority: Priority;
  }[];
}

export function TemplateForm() {
  const { state, dispatch, addTemplate, updateTemplate, getTemplateById } = useTaskContext();
  const { isTemplateFormOpen, editingTemplateId } = state.ui;
  const editingTemplate = editingTemplateId ? getTemplateById(editingTemplateId) : null;

  const [name, setName] = useState('');
  const [unitId, setUnitId] = useState<string>('none');
  const [description, setDescription] = useState('');
  const [phases, setPhases] = useState<PhaseFormData[]>([
    { name: '', tasks: [{ title: '', description: '', priority: 'medium' }] },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name);
      setUnitId(editingTemplate.unitId || 'none');
      setDescription(editingTemplate.description);
      setPhases(
        editingTemplate.phases.map((p) => ({
          name: p.name,
          tasks: p.tasks.map((t) => ({
            title: t.title,
            description: t.description,
            priority: t.priority,
          })),
        }))
      );
    } else {
      setName('');
      setUnitId('none');
      setDescription('');
      setPhases([
        { name: '', tasks: [{ title: '', description: '', priority: 'medium' }] },
      ]);
    }
    setErrors({});
  }, [editingTemplate, isTemplateFormOpen]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_TEMPLATE_FORM' });
  };

  const addPhase = () => {
    setPhases([...phases, { name: '', tasks: [{ title: '', description: '', priority: 'medium' }] }]);
  };

  const removePhase = (phaseIndex: number) => {
    if (phases.length <= 1) return;
    setPhases(phases.filter((_, i) => i !== phaseIndex));
  };

  const updatePhaseName = (phaseIndex: number, value: string) => {
    setPhases(phases.map((p, i) => (i === phaseIndex ? { ...p, name: value } : p)));
  };

  const addTask = (phaseIndex: number) => {
    setPhases(
      phases.map((p, i) =>
        i === phaseIndex
          ? { ...p, tasks: [...p.tasks, { title: '', description: '', priority: 'medium' }] }
          : p
      )
    );
  };

  const removeTask = (phaseIndex: number, taskIndex: number) => {
    setPhases(
      phases.map((p, i) => {
        if (i !== phaseIndex) return p;
        if (p.tasks.length <= 1) return p;
        return { ...p, tasks: p.tasks.filter((_, j) => j !== taskIndex) };
      })
    );
  };

  const updateTask = (
    phaseIndex: number,
    taskIndex: number,
    field: 'title' | 'description' | 'priority',
    value: string
  ) => {
    setPhases(
      phases.map((p, i) => {
        if (i !== phaseIndex) return p;
        return {
          ...p,
          tasks: p.tasks.map((t, j) =>
            j === taskIndex ? { ...t, [field]: value } : t
          ),
        };
      })
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'プロジェクト名を入力してください';
    }
    phases.forEach((phase, pi) => {
      if (!phase.name.trim()) {
        newErrors[`phase_${pi}_name`] = 'フェーズ名を入力してください';
      }
      phase.tasks.forEach((task, ti) => {
        if (!task.title.trim()) {
          newErrors[`phase_${pi}_task_${ti}_title`] = 'タスク名を入力してください';
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = {
      name: name.trim(),
      unitId: unitId === 'none' ? null : unitId,
      description: description.trim(),
      phases: phases.map((p) => ({
        name: p.name.trim(),
        tasks: p.tasks.map((t) => ({
          title: t.title.trim(),
          description: t.description.trim(),
          priority: t.priority,
        })),
      })),
    };

    if (editingTemplateId) {
      updateTemplate(editingTemplateId, formData);
    } else {
      addTemplate(formData);
    }
    handleClose();
  };

  const unitOptions = [
    { value: 'none', label: '選択してください' },
    ...state.units.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <Modal
      isOpen={isTemplateFormOpen}
      onClose={handleClose}
      title={editingTemplate ? 'プロジェクトを編集' : 'プロジェクトを作成'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project name */}
        <Input
          label="プロジェクト名"
          placeholder="例: 株式会社●●様"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        {/* Unit dropdown */}
        <Select
          label="ユニット"
          options={unitOptions}
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 resize-none"
            rows={2}
            placeholder="プロジェクトの説明（任意）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Phases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">フェーズ（中カテゴリ）</h3>
            <Button type="button" variant="ghost" size="sm" onClick={addPhase}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              フェーズ追加
            </Button>
          </div>

          <div className="space-y-4">
            {phases.map((phase, phaseIndex) => (
              <div
                key={phaseIndex}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                {/* Phase header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <Input
                      placeholder={`フェーズ名（例: ${phaseIndex === 0 ? 'キックオフ会議' : `${phaseIndex + 1}回目会議`}）`}
                      value={phase.name}
                      onChange={(e) => updatePhaseName(phaseIndex, e.target.value)}
                      error={errors[`phase_${phaseIndex}_name`]}
                    />
                  </div>
                  {phases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhase(phaseIndex)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors mt-0.5"
                      title="フェーズを削除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Tasks in this phase */}
                <div className="space-y-2 ml-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">タスク</span>
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-start gap-2 bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="タスク名"
                          value={task.title}
                          onChange={(e) => updateTask(phaseIndex, taskIndex, 'title', e.target.value)}
                          error={errors[`phase_${phaseIndex}_task_${taskIndex}_title`]}
                        />
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <input
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                              placeholder="説明（任意）"
                              value={task.description}
                              onChange={(e) => updateTask(phaseIndex, taskIndex, 'description', e.target.value)}
                            />
                          </div>
                          <Select
                            options={PRIORITY_OPTIONS}
                            value={task.priority}
                            onChange={(e) => updateTask(phaseIndex, taskIndex, 'priority', e.target.value)}
                            className="w-20"
                          />
                        </div>
                      </div>
                      {phase.tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(phaseIndex, taskIndex)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors mt-1"
                          title="タスクを削除"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTask(phaseIndex)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 py-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    タスクを追加
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button type="submit">
            {editingTemplate ? '更新' : '作成'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
