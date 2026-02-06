'use client';

import { useTaskContext } from '@/contexts/TaskContext';
import { TaskFilters } from '@/components/tasks';
import { CategoryList } from '@/components/categories';
import { TagList } from '@/components/tags';
import { TemplateList } from '@/components/templates';
import { UnitList } from '@/components/units';
import clsx from 'clsx';

export function Sidebar() {
  const { state, dispatch } = useTaskContext();
  const { isSidebarOpen } = state.ui;

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:sticky top-0 left-0 z-50 md:z-0',
          'w-72 h-screen md:h-[calc(100vh-64px)] md:top-16',
          'bg-gray-50 border-r border-gray-200',
          'transform transition-transform duration-300 ease-in-out',
          'overflow-y-auto',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'md:block'
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 md:hidden">
          <span className="font-semibold text-gray-900">メニュー</span>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">タスク概要</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-900">
                  {state.tasks.filter((t) => t.status !== 'completed').length}
                </div>
                <div className="text-gray-500">未完了</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {state.tasks.filter((t) => t.status === 'completed').length}
                </div>
                <div className="text-gray-500">完了</div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <CategoryList />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <TagList />
          </div>

          {/* Units */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <UnitList />
          </div>

          {/* Projects (Templates) */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <TemplateList />
          </div>

          {/* Filters */}
          <TaskFilters />
        </div>
      </aside>
    </>
  );
}
