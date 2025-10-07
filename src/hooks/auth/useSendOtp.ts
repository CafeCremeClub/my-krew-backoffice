import { useMutation } from '@tanstack/react-query';
import { sendOtp } from '@/services/authService';

const useSendOtp = () => {
  return useMutation({
    mutationKey: ['send-otp'],
    mutationFn: async (email: string) => await sendOtp(email),
    retry: 0,
  });
};

export default useSendOtp;
