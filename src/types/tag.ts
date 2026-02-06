export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface TagFormData {
  name: string;
  color: string;
}

export const TAG_COLORS = [
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#14B8A6', // Teal
  '#10B981', // Emerald
] as const;
