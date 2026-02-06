'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  onRemove?: () => void;
}

export function Badge({
  children,
  color,
  variant = 'solid',
  size = 'sm',
  className,
  onRemove,
}: BadgeProps) {
  const baseStyles = clsx(
    'inline-flex items-center rounded-full font-medium',
    {
      'px-2 py-0.5 text-xs': size === 'sm',
      'px-3 py-1 text-sm': size === 'md',
    },
    className
  );

  if (color) {
    const style =
      variant === 'solid'
        ? { backgroundColor: color, color: getContrastColor(color) }
        : { borderColor: color, color: color, borderWidth: '1px' };

    return (
      <span className={baseStyles} style={style}>
        {children}
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 -mr-1 hover:opacity-75"
            type="button"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }

  return (
    <span className={clsx(baseStyles, 'bg-gray-100 text-gray-700')}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 -mr-1 hover:opacity-75"
          type="button"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
