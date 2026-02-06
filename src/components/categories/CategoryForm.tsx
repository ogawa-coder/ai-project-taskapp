'use client';

import { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Modal, Button, Input } from '@/components/ui';
import { CATEGORY_COLORS } from '@/types';

export function CategoryForm() {
  const { state, dispatch, addCategory, updateCategory, getCategoryById } =
    useTaskContext();
  const { isCategoryFormOpen, editingCategoryId } = state.ui;
  const editingCategory = editingCategoryId ? getCategoryById(editingCategoryId) : null;

  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setColor(editingCategory.color);
    } else {
      setName('');
      setColor(CATEGORY_COLORS[0]);
    }
    setError('');
  }, [editingCategory, isCategoryFormOpen]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_CATEGORY_FORM' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('カテゴリ名を入力してください');
      return;
    }

    if (editingCategoryId) {
      updateCategory(editingCategoryId, { name: name.trim(), color });
    } else {
      addCategory({ name: name.trim(), color });
    }

    handleClose();
  };

  return (
    <Modal
      isOpen={isCategoryFormOpen}
      onClose={handleClose}
      title={editingCategoryId ? 'カテゴリを編集' : '新規カテゴリ'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="category-name"
          label="カテゴリ名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          placeholder="カテゴリ名を入力"
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">色</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button type="submit">{editingCategoryId ? '更新' : '作成'}</Button>
        </div>
      </form>
    </Modal>
  );
}
