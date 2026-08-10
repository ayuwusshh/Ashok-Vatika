import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'lg', fullScreen = false, text }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={`animate-spin text-brand-primary ${sizeClasses[size]}`} />
      {text && <p className="mt-4 text-brand-on-surface-variant font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-brand-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="py-20">{content}</div>;
};

export default Loader;
