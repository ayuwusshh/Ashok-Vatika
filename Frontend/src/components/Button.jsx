import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 ease-out-expo focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-secondary hover:scale-[1.02] shadow-ambient focus:ring-brand-primary",
    secondary: "bg-brand-secondary/10 text-brand-primary hover:bg-brand-secondary/20 focus:ring-brand-secondary",
    outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary-light hover:text-white hover:border-brand-primary-light focus:ring-brand-primary",
    ghost: "text-brand-on-surface-variant hover:text-brand-primary hover:bg-brand-surface-dim focus:ring-brand-surface-dim",
    danger: "bg-brand-error text-white hover:bg-brand-error/90 focus:ring-brand-error"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-[0.75rem]",
    md: "px-6 py-3 text-base rounded-[1rem]",
    lg: "px-8 py-4 text-lg rounded-[1.25rem]"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
