'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Task,
  TaskFormData,
  Category,
  CategoryFormData,
  Tag,
  TagFormData,
  TaskFilters,
  SortOptions,
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  Priority,
  Template,
  TemplateFormData,
  Unit,
  UnitFormData,
} from '@/types';
import { generateId, getCurrentISOString } from '@/utils';

// State interface
interface AppState {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  templates: Template[];
  units: Unit[];
  filters: TaskFilters;
  sortOptions: SortOptions;
  ui: {
    isTaskFormOpen: boolean;
    editingTaskId: string | null;
    isCategoryFormOpen: boolean;
    editingCategoryId: string | null;
    isTagFormOpen: boolean;
    isTemplateFormOpen: boolean;
    editingTemplateId: string | null;
    isApplyTemplateOpen: boolean;
    isUnitFormOpen: boolean;
    isSidebarOpen: boolean;
  };
}

// Action types
type AppAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'ADD_TASKS_BATCH'; payload: Task[] }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_STATUS'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_TAGS'; payload: Tag[] }
  | { type: 'ADD_TAG'; payload: Tag }
  | { type: 'DELETE_TAG'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: Template[] }
  | { type: 'ADD_TEMPLATE'; payload: Template }
  | { type: 'UPDATE_TEMPLATE'; payload: Template }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'SET_UNITS'; payload: Unit[] }
  | { type: 'ADD_UNIT'; payload: Unit }
  | { type: 'DELETE_UNIT'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<TaskFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_SORT'; payload: SortOptions }
  | { type: 'OPEN_TASK_FORM'; payload?: string }
  | { type: 'CLOSE_TASK_FORM' }
  | { type: 'OPEN_CATEGORY_FORM'; payload?: string }
  | { type: 'CLOSE_CATEGORY_FORM' }
  | { type: 'OPEN_TAG_FORM' }
  | { type: 'CLOSE_TAG_FORM' }
  | { type: 'OPEN_TEMPLATE_FORM'; payload?: string }
  | { type: 'CLOSE_TEMPLATE_FORM' }
  | { type: 'OPEN_APPLY_TEMPLATE' }
  | { type: 'CLOSE_APPLY_TEMPLATE' }
  | { type: 'OPEN_UNIT_FORM' }
  | { type: 'CLOSE_UNIT_FORM' }
  | { type: 'TOGGLE_SIDEBAR' };

// Initial state
const initialState: AppState = {
  tasks: [],
  categories: [],
  tags: [],
  templates: [],
  units: [],
  filters: DEFAULT_FILTERS,
  sortOptions: DEFAULT_SORT,
  ui: {
    isTaskFormOpen: false,
    editingTaskId: null,
    isCategoryFormOpen: false,
    editingCategoryId: null,
    isTagFormOpen: false,
    isTemplateFormOpen: false,
    editingTemplateId: null,
    isApplyTemplateOpen: false,
    isUnitFormOpen: false,
    isSidebarOpen: true,
  },
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };

    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case 'ADD_TASKS_BATCH':
      return { ...state, tasks: [...action.payload, ...state.tasks] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case 'TOGGLE_TASK_STATUS': {
      const now = getCurrentISOString();
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id !== action.payload) return task;
          const isCompleting = task.status !== 'completed';
          return {
            ...task,
            status: isCompleting ? 'completed' : 'pending',
            completedAt: isCompleting ? now : null,
            updatedAt: now,
          };
        }),
      };
    }

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        tasks: state.tasks.map((task) =>
          task.categoryId === action.payload ? { ...task, categoryId: null } : task
        ),
      };

    case 'SET_TAGS':
      return { ...state, tags: action.payload };

    case 'ADD_TAG':
      return { ...state, tags: [...state.tags, action.payload] };

    case 'DELETE_TAG':
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.id !== action.payload),
        tasks: state.tasks.map((task) => ({
          ...task,
          tagIds: task.tagIds.filter((id) => id !== action.payload),
        })),
      };

    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };

    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };

    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter((t) => t.id !== action.payload),
      };

    case 'SET_UNITS':
      return { ...state, units: action.payload };

    case 'ADD_UNIT':
      return { ...state, units: [...state.units, action.payload] };

    case 'DELETE_UNIT':
      return {
        ...state,
        units: state.units.filter((u) => u.id !== action.payload),
        templates: state.templates.map((t) =>
          t.unitId === action.payload ? { ...t, unitId: null } : t
        ),
      };

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return { ...state, filters: DEFAULT_FILTERS };

    case 'SET_SORT':
      return { ...state, sortOptions: action.payload };

    case 'OPEN_TASK_FORM':
      return {
        ...state,
        ui: {
          ...state.ui,
          isTaskFormOpen: true,
          editingTaskId: action.payload || null,
        },
      };

    case 'CLOSE_TASK_FORM':
      return {
        ...state,
        ui: { ...state.ui, isTaskFormOpen: false, editingTaskId: null },
      };

    case 'OPEN_CATEGORY_FORM':
      return {
        ...state,
        ui: {
          ...state.ui,
          isCategoryFormOpen: true,
          editingCategoryId: action.payload || null,
        },
      };

    case 'CLOSE_CATEGORY_FORM':
      return {
        ...state,
        ui: { ...state.ui, isCategoryFormOpen: false, editingCategoryId: null },
      };

    case 'OPEN_TAG_FORM':
      return { ...state, ui: { ...state.ui, isTagFormOpen: true } };

    case 'CLOSE_TAG_FORM':
      return { ...state, ui: { ...state.ui, isTagFormOpen: false } };

    case 'OPEN_TEMPLATE_FORM':
      return {
        ...state,
        ui: {
          ...state.ui,
          isTemplateFormOpen: true,
          editingTemplateId: action.payload || null,
        },
      };

    case 'CLOSE_TEMPLATE_FORM':
      return {
        ...state,
        ui: { ...state.ui, isTemplateFormOpen: false, editingTemplateId: null },
      };

    case 'OPEN_APPLY_TEMPLATE':
      return { ...state, ui: { ...state.ui, isApplyTemplateOpen: true } };

    case 'CLOSE_APPLY_TEMPLATE':
      return { ...state, ui: { ...state.ui, isApplyTemplateOpen: false } };

    case 'OPEN_UNIT_FORM':
      return { ...state, ui: { ...state.ui, isUnitFormOpen: true } };

    case 'CLOSE_UNIT_FORM':
      return { ...state, ui: { ...state.ui, isUnitFormOpen: false } };

    case 'TOGGLE_SIDEBAR':
      return { ...state, ui: { ...state.ui, isSidebarOpen: !state.ui.isSidebarOpen } };

    default:
      return state;
  }
}

// Context type
interface TaskContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  addCategory: (data: CategoryFormData) => void;
  updateCategory: (id: string, data: CategoryFormData) => void;
  deleteCategory: (id: string) => void;
  addTag: (data: TagFormData) => void;
  deleteTag: (id: string) => void;
  addTemplate: (data: TemplateFormData) => void;
  updateTemplate: (id: string, data: TemplateFormData) => void;
  deleteTemplate: (id: string) => void;
  applyTemplate: (templateId: string, categoryId: string | null) => void;
  addUnit: (data: UnitFormData) => void;
  deleteUnit: (id: string) => void;
  filteredTasks: Task[];
  getTaskById: (id: string) => Task | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getTagById: (id: string) => Tag | undefined;
  getTemplateById: (id: string) => Template | undefined;
  getUnitById: (id: string) => Unit | undefined;
}

const TaskContext = createContext<TaskContextType | null>(null);

const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

// Provider component
export function TaskProvider({ children }: { children: ReactNode }) {
  const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>('tasks', []);
  const [storedCategories, setStoredCategories] = useLocalStorage<Category[]>(
    'categories',
    []
  );
  const [storedTags, setStoredTags] = useLocalStorage<Tag[]>('tags', []);
  const [storedTemplates, setStoredTemplates] = useLocalStorage<Template[]>(
    'templates',
    []
  );
  const [storedUnits, setStoredUnits] = useLocalStorage<Unit[]>('units', []);

  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    tasks: storedTasks,
    categories: storedCategories,
    tags: storedTags,
    templates: storedTemplates,
    units: storedUnits,
  });

  // Sync to localStorage
  useEffect(() => {
    setStoredTasks(state.tasks);
  }, [state.tasks, setStoredTasks]);

  useEffect(() => {
    setStoredCategories(state.categories);
  }, [state.categories, setStoredCategories]);

  useEffect(() => {
    setStoredTags(state.tags);
  }, [state.tags, setStoredTags]);

  useEffect(() => {
    setStoredTemplates(state.templates);
  }, [state.templates, setStoredTemplates]);

  useEffect(() => {
    setStoredUnits(state.units);
  }, [state.units, setStoredUnits]);

  // Task actions
  const addTask = useCallback((data: TaskFormData) => {
    const now = getCurrentISOString();
    const newTask: Task = {
      id: generateId(),
      ...data,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  }, []);

  const updateTask = useCallback(
    (id: string, data: TaskFormData) => {
      const now = getCurrentISOString();
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          id,
          ...data,
          status: 'pending',
          createdAt: state.tasks.find((t) => t.id === id)?.createdAt || now,
          updatedAt: now,
          completedAt: null,
        } as Task,
      });
    },
    [state.tasks]
  );

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TASK_STATUS', payload: id });
  }, []);

  // Category actions
  const addCategory = useCallback((data: CategoryFormData) => {
    const now = getCurrentISOString();
    const newCategory: Category = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  }, []);

  const updateCategory = useCallback(
    (id: string, data: CategoryFormData) => {
      const now = getCurrentISOString();
      const existing = state.categories.find((c) => c.id === id);
      if (existing) {
        dispatch({
          type: 'UPDATE_CATEGORY',
          payload: { ...existing, ...data, updatedAt: now },
        });
      }
    },
    [state.categories]
  );

  const deleteCategory = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  }, []);

  // Tag actions
  const addTag = useCallback((data: TagFormData) => {
    const newTag: Tag = {
      id: generateId(),
      ...data,
      createdAt: getCurrentISOString(),
    };
    dispatch({ type: 'ADD_TAG', payload: newTag });
  }, []);

  const deleteTag = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TAG', payload: id });
  }, []);

  // Unit actions
  const addUnit = useCallback((data: UnitFormData) => {
    const newUnit: Unit = {
      id: generateId(),
      name: data.name,
      createdAt: getCurrentISOString(),
    };
    dispatch({ type: 'ADD_UNIT', payload: newUnit });
  }, []);

  const deleteUnit = useCallback((id: string) => {
    dispatch({ type: 'DELETE_UNIT', payload: id });
  }, []);

  // Template actions
  const addTemplate = useCallback((data: TemplateFormData) => {
    const now = getCurrentISOString();
    const newTemplate: Template = {
      id: generateId(),
      name: data.name,
      unitId: data.unitId,
      description: data.description,
      phases: data.phases.map((phase) => ({
        id: generateId(),
        name: phase.name,
        tasks: phase.tasks.map((task) => ({
          id: generateId(),
          title: task.title,
          description: task.description,
          priority: task.priority,
        })),
      })),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
  }, []);

  const updateTemplate = useCallback((id: string, data: TemplateFormData) => {
    const now = getCurrentISOString();
    const updated: Template = {
      id,
      name: data.name,
      unitId: data.unitId,
      description: data.description,
      phases: data.phases.map((phase) => ({
        id: generateId(),
        name: phase.name,
        tasks: phase.tasks.map((task) => ({
          id: generateId(),
          title: task.title,
          description: task.description,
          priority: task.priority,
        })),
      })),
      createdAt: state.templates.find((t) => t.id === id)?.createdAt || now,
      updatedAt: now,
    };
    dispatch({ type: 'UPDATE_TEMPLATE', payload: updated });
  }, [state.templates]);

  const deleteTemplate = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TEMPLATE', payload: id });
  }, []);

  const applyTemplate = useCallback(
    (templateId: string, categoryId: string | null) => {
      const template = state.templates.find((t) => t.id === templateId);
      if (!template) return;

      const now = getCurrentISOString();
      const newTasks: Task[] = [];

      for (const phase of template.phases) {
        for (const templateTask of phase.tasks) {
          newTasks.push({
            id: generateId(),
            title: `[${phase.name}] ${templateTask.title}`,
            description: templateTask.description,
            status: 'pending',
            priority: templateTask.priority,
            categoryId,
            projectId: null,
            tagIds: [],
            dueDate: null,
            createdAt: now,
            updatedAt: now,
            completedAt: null,
          });
        }
      }

      dispatch({ type: 'ADD_TASKS_BATCH', payload: newTasks });
    },
    [state.templates]
  );

  // Computed: filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...state.tasks];
    const { filters, sortOptions } = state;

    if (filters.status !== 'all') {
      result = result.filter((task) => task.status === filters.status);
    }
    if (filters.priority !== 'all') {
      result = result.filter((task) => task.priority === filters.priority);
    }
    if (filters.categoryId !== 'all') {
      result = result.filter((task) => task.categoryId === filters.categoryId);
    }
    if (filters.tagIds.length > 0) {
      result = result.filter((task) =>
        filters.tagIds.some((tagId) => task.tagIds.includes(tagId))
      );
    }
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortOptions.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = a.dueDate.localeCompare(b.dueDate);
          break;
        case 'createdAt':
          comparison = a.createdAt.localeCompare(b.createdAt);
          break;
        case 'updatedAt':
          comparison = a.updatedAt.localeCompare(b.updatedAt);
          break;
      }
      return sortOptions.order === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [state.tasks, state.filters, state.sortOptions]);

  // Getters
  const getTaskById = useCallback(
    (id: string) => state.tasks.find((task) => task.id === id),
    [state.tasks]
  );
  const getCategoryById = useCallback(
    (id: string) => state.categories.find((cat) => cat.id === id),
    [state.categories]
  );
  const getTagById = useCallback(
    (id: string) => state.tags.find((tag) => tag.id === id),
    [state.tags]
  );
  const getTemplateById = useCallback(
    (id: string) => state.templates.find((t) => t.id === id),
    [state.templates]
  );
  const getUnitById = useCallback(
    (id: string) => state.units.find((u) => u.id === id),
    [state.units]
  );

  const value: TaskContextType = {
    state,
    dispatch,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    deleteTag,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
    addUnit,
    deleteUnit,
    filteredTasks,
    getTaskById,
    getCategoryById,
    getTagById,
    getTemplateById,
    getUnitById,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}
