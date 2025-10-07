import React from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface CustomOTPInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const CustomOtpInput = ({
  value,
  onChange,
  maxLength = 4,
}: CustomOTPInputProps) => {
  const renderSlots = () => {
    const slots = [];
    const halfLength = Math.ceil(maxLength / 2);

    // First group
    slots.push(
      <InputOTPGroup key="group-1">
        {Array.from({ length: halfLength }, (_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    );

    // Add separator if we have more than one group
    if (maxLength > halfLength) {
      slots.push(<InputOTPSeparator key="separator" />);

      // Second group
      slots.push(
        <InputOTPGroup key="group-2">
          {Array.from({ length: maxLength - halfLength }, (_, index) => (
            <InputOTPSlot key={halfLength + index} index={halfLength + index} />
          ))}
        </InputOTPGroup>
      );
    }

    return slots;
  };

  return (
    <InputOTP maxLength={maxLength} value={value} onChange={onChange}>
      {renderSlots()}
    </InputOTP>
  );
};

export default CustomOtpInput;
