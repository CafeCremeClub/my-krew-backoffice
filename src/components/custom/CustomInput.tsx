'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface CustomInputProps {
  className?: string;
  isError?: boolean;
  /** Optional icon to render on the left side of the input */
  leftIcon?: React.ReactNode;
}

const CustomInput = ({
  className,
  type = 'text',
  isError = false,
  leftIcon,
  ...props
}: CustomInputProps & React.ComponentProps<'input'>) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative w-full h-max">
      {/* Left icon, if provided */}
      {leftIcon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-gray-500">
          {leftIcon}
        </span>
      )}
      <Input
        type={inputType}
        className={cn(
          'cursor-pointer shadow-md shadow-[#E4E5E73D] h-[2.5rem] px-3 bg-white rounded-[0.625rem] text-[#0A0D14] text-sm focus:outline-none focus:!ring-0 placeholder:text-[#868C98] placeholder:text-sm',
          // Border styles, change if error
          isError
            ? 'border border-[#DF1C41] focus:border-[#DF1C41]'
            : 'border border-[#E2E4E9] focus:border focus:!border-gray-400',
          leftIcon ? 'pl-12' : '',
          className
        )}
        {...props}
      />

      {/* Password eye toggle */}
      {type === 'password' && (
        <Button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="shadow-none bg-transparent hover:bg-transparent cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      )}
    </div>
  );
};

export default CustomInput;
