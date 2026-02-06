'use client';

import { Header, Sidebar } from '@/components/layout';
import { TaskList, TaskForm } from '@/components/tasks';
import { CategoryForm } from '@/components/categories';
import { TagForm } from '@/components/tags';
import { TemplateForm, ApplyTemplate } from '@/components/templates';
import { UnitForm } from '@/components/units';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <TaskList />
          </div>
        </main>
      </div>

      {/* Modals */}
      <TaskForm />
      <CategoryForm />
      <TagForm />
      <TemplateForm />
      <ApplyTemplate />
      <UnitForm />
    </div>
  );
}
