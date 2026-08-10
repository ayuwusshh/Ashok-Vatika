import React from 'react';

const Input = ({ 
  icon: Icon, 
  className = '', 
  containerClassName = '',
  error,
  ...props 
}) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 transition-colors ${error ? 'text-brand-error' : 'text-brand-on-surface-variant group-focus-within:text-brand-primary'}`} />
          </div>
        )}
        <input
          className={`block w-full py-4 bg-brand-surface border-2 rounded-full text-brand-on-surface placeholder-brand-on-surface-variant focus:outline-none focus:ring-0 shadow-sm transition-all duration-300
            ${Icon ? 'pl-11 pr-4' : 'px-6'}
            ${error 
              ? 'border-brand-error focus:border-brand-error' 
              : 'border-brand-surface-dim focus:border-brand-primary hover:border-brand-primary/50'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-sm text-brand-error mt-2 ml-4">{error}</span>}
    </div>
  );
};

export default Input;
