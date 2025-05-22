
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'destructive' | 'outline' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white";
    
    let variantStyle = '';
    switch (variant) {
      case 'ghost':
        variantStyle = 'hover:bg-gray-200 text-gray-700';
        break;
      case 'destructive':
        variantStyle = 'bg-red-600 text-white hover:bg-red-700';
        break;
      case 'outline':
        variantStyle = 'border border-gray-300 hover:bg-gray-100';
        break;
      case 'secondary':
        variantStyle = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
        break;
      case 'link':
        variantStyle = 'text-blue-600 underline-offset-4 hover:underline';
        break;
      default: // 'default'
        variantStyle = 'bg-blue-600 text-white hover:bg-blue-700';
        break;
    }

    let sizeStyle = '';
    switch (size) {
      case 'sm':
        sizeStyle = 'h-9 px-3';
        break;
      case 'lg':
        sizeStyle = 'h-11 px-8';
        break;
      case 'icon':
        sizeStyle = 'h-auto w-auto'; // Relies on className for specific padding like p-1.5
        break;
      default: // 'default'
        sizeStyle = 'h-10 py-2 px-4';
        break;
    }

    return (
      <button
        className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
