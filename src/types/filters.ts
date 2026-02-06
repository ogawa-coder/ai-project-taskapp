import { Priority, TaskStatus } from './task';

export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'title' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilters {
  status: TaskStatus | 'all';
  priority: Priority | 'all';
  categoryId: string | 'all';
  projectId: string | 'all';
  tagIds: string[];
  searchQuery: string;
}

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

export const DEFAULT_FILTERS: TaskFilters = {
  status: 'all',
  priority: 'all',
  categoryId: 'all',
  projectId: 'all',
  tagIds: [],
  searchQuery: '',
};

export const DEFAULT_SORT: SortOptions = {
  field: 'createdAt',
  order: 'desc',
};

export const SORT_FIELD_LABELS: Record<SortField, string> = {
  createdAt: '作成日',
  updatedAt: '更新日',
  dueDate: '期限',
  priority: '優先度',
  title: 'タイトル',
};
