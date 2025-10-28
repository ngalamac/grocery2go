import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className || ''}`} />
);

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm">
    <SkeletonBox className="w-full h-48 rounded-t-lg" />
    <div className="p-4 space-y-3">
      <SkeletonBox className="h-4 w-1/2" />
      <SkeletonBox className="h-3 w-1/3" />
      <SkeletonBox className="h-6 w-1/4" />
    </div>
  </div>
);

export const SummarySkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
    <SkeletonBox className="h-5 w-1/3" />
    <SkeletonBox className="h-4 w-full" />
    <SkeletonBox className="h-4 w-full" />
    <SkeletonBox className="h-4 w-2/3" />
  </div>
);

