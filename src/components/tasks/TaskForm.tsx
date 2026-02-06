'use client';

import { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Modal, Button, Input, Select } from '@/components/ui';
import { TaskFormData, PRIORITY_LABELS, Priority } from '@/types';
import { toISODateString } from '@/utils';

export function TaskForm() {
  const { state, dispatch, addTask, updateTask, getTaskById } = useTaskContext();
  const { isTaskFormOpen, editingTaskId } = state.ui;
  const editingTask = editingTaskId ? getTaskById(editingTaskId) : null;

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    categoryId: null,
    projectId: null,
    tagIds: [],
    dueDate: null,
  });

  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        categoryId: editingTask.categoryId,
        projectId: editingTask.projectId,
        tagIds: editingTask.tagIds,
        dueDate: editingTask.dueDate,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        categoryId: null,
        projectId: null,
        tagIds: [],
        dueDate: null,
      });
    }
    setErrors({});
  }, [editingTask, isTaskFormOpen]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_TASK_FORM' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrors({ title: 'タイトルを入力してください' });
      return;
    }

    if (editingTaskId) {
      updateTask(editingTaskId, formData);
    } else {
      addTask(formData);
    }

    handleClose();
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const categoryOptions = [
    { value: '', label: 'カテゴリなし' },
    ...state.categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  return (
    <Modal
      isOpen={isTaskFormOpen}
      onClose={handleClose}
      title={editingTaskId ? 'タスクを編集' : '新規タスク'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          label="タイトル"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          placeholder="タスクのタイトルを入力"
          autoFocus
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            説明
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            placeholder="タスクの詳細を入力（任意）"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="priority"
            label="優先度"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value as Priority })
            }
            options={priorityOptions}
          />

          <Select
            id="category"
            label="カテゴリ"
            value={formData.categoryId || ''}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value || null })
            }
            options={categoryOptions}
          />
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            期限
          </label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate || ''}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value || null })
            }
            min={toISODateString(new Date())}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {state.tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">タグ</label>
            <div className="flex flex-wrap gap-2">
              {state.tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    formData.tagIds.includes(tag.id)
                      ? 'border-transparent text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  style={
                    formData.tagIds.includes(tag.id)
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

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button type="submit">{editingTaskId ? '更新' : '作成'}</Button>
        </div>
      </form>
    </Modal>
  );
}
