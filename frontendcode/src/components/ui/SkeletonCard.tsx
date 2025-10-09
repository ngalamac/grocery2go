import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <div className={cn('animate-pulse bg-white rounded-xl shadow-soft overflow-hidden', className)}>
      <div className="w-full h-48 bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 rounded w-1/2" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-6 bg-neutral-200 rounded w-1/4" />
          <div className="h-8 w-8 bg-neutral-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
