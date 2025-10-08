import React from 'react';
import { X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ToastViewport: React.FC = () => {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[60] space-y-2 w-[90vw] max-w-sm">
      {toasts.map(t => (
        <div key={t.id} className={`rounded shadow-md border p-3 bg-white flex items-start gap-3 ${t.type === 'success' ? 'border-green-200' : t.type === 'error' ? 'border-red-200' : 'border-gray-200'}`}>
          <div className={`w-1.5 rounded ${t.type === 'success' ? 'bg-green-500' : t.type === 'error' ? 'bg-red-500' : 'bg-gray-500'}`} />
          <div className="flex-1">
            {t.title && <div className="text-sm font-semibold mb-0.5">{t.title}</div>}
            <div className="text-sm text-gray-700">{t.message}</div>
          </div>
          <button onClick={() => dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastViewport;

