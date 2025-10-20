import React from 'react';
import { cn } from '../../utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('container-custom', className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
