import { Priority } from './task';

export interface TemplateTask {
  id: string;
  title: string;
  description: string;
  priority: Priority;
}

export interface TemplatePhase {
  id: string;
  name: string;
  tasks: TemplateTask[];
}

export interface Template {
  id: string;
  name: string;
  unitId: string | null;
  description: string;
  phases: TemplatePhase[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFormData {
  name: string;
  unitId: string | null;
  description: string;
  phases: {
    name: string;
    tasks: {
      title: string;
      description: string;
      priority: Priority;
    }[];
  }[];
}
