'use client';

import { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function UnitForm() {
  const { state, dispatch, addUnit } = useTaskContext();
  const { isUnitFormOpen } = state.ui;

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    dispatch({ type: 'CLOSE_UNIT_FORM' });
    setName('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('ユニット名を入力してください');
      return;
    }
    if (state.units.some((u) => u.name === name.trim())) {
      setError('同じ名前のユニットが既に存在します');
      return;
    }
    addUnit({ name: name.trim() });
    handleClose();
  };

  return (
    <Modal isOpen={isUnitFormOpen} onClose={handleClose} title="ユニットを追加" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ユニット名"
          placeholder="例: コンサルティング事業部"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button type="submit">追加</Button>
        </div>
      </form>
    </Modal>
  );
}
