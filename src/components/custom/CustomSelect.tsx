'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CustomSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options: { label: string; value: string }[];
  className?: string;
  isError?: boolean;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select an option',
  options,
  className,
  isError = false,
  disabled = false,
}) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          'cursor-pointer shadow-md shadow-[#E4E5E73D] !h-[2.5rem] px-3 bg-white rounded-[0.625rem] text-[#0A0D14] text-sm focus:outline-none focus:!ring-0 placeholder:text-[#868C98] placeholder:text-sm',
          // Border styles, change if error
          isError
            ? 'border border-[#DF1C41] focus:border-[#DF1C41]'
            : 'border border-[#E2E4E9] focus:border focus:!border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white rounded-lg shadow-lg border border-[#E2E4E9]">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-[#0A0D14] text-sm"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
