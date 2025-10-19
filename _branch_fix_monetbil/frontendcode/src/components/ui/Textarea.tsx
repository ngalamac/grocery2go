import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none',
            error
              ? 'border-accent-500 focus:ring-accent-500 focus:border-accent-500'
              : 'border-neutral-300 focus:ring-primary-500 focus:border-transparent',
            className
          )}
          rows={4}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-accent-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
