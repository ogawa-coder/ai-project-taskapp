'use client';

import { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Modal, Button, Input } from '@/components/ui';
import { TAG_COLORS } from '@/types';

export function TagForm() {
  const { state, dispatch, addTag } = useTaskContext();
  const { isTagFormOpen } = state.ui;

  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(TAG_COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isTagFormOpen) {
      setName('');
      setColor(TAG_COLORS[0]);
      setError('');
    }
  }, [isTagFormOpen]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_TAG_FORM' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('タグ名を入力してください');
      return;
    }

    addTag({ name: name.trim(), color });
    handleClose();
  };

  return (
    <Modal isOpen={isTagFormOpen} onClose={handleClose} title="新規タグ" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="tag-name"
          label="タグ名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          placeholder="タグ名を入力"
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">色</label>
          <div className="flex flex-wrap gap-2">
            {TAG_COLORS.map((c) => (
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
          <Button type="submit">作成</Button>
        </div>
      </form>
    </Modal>
  );
}
