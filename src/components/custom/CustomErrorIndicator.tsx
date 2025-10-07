import React from 'react';
import { MdOutlineError } from 'react-icons/md';

interface CustomErrorIndicatorProps {
  message?: string;
}

const CustomErrorIndicator = ({
  message = ':(',
}: CustomErrorIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 text-[#DF1C41] text-xs">
      <MdOutlineError className="size-4" /> {message}
    </div>
  );
};

export default CustomErrorIndicator;
