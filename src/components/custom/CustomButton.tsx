import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const CustomButton = ({
  icon,
  children,
  isLoading,
  disabled,
  className,
  iconPosition = 'left',
  type = 'button',
  ...props
}: React.ComponentProps<'button'> & CustomButtonProps) => {
  return (
    <Button
      type={type}
      disabled={isLoading || disabled}
      className={cn(
        'flex justify-center items-center shadow-md shadow-[#E4E5E73D] h-[2.5rem] px-3 text-white text-sm bg-[#375DFB] rounded-[0.625rem] gap-2 font-medium cursor-pointer hover:bg-[#375DFB]/90',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="h-4 w-4 flex items-center justify-center shrink-0">
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="h-4 w-4 flex items-center justify-center shrink-0">
              {icon}
            </span>
          )}
        </>
      )}
    </Button>
  );
};

export default CustomButton;
