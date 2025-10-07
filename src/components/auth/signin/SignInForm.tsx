'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomInput from '@/components/custom/CustomInput';
import { Mail } from 'lucide-react';
import CustomButton from '@/components/custom/CustomButton';
import CustomOtpInput from '@/components/custom/CustomOTPInput';
import CustomErrorIndicator from '@/components/custom/CustomErrorIndicator';
import { useRouter } from 'next/navigation';
import useSendOtp from '@/hooks/auth/useSendOtp';
import { handleOtpError } from '@/utils/helpers/handleOtpError';
import { toast } from 'sonner';
import useSignin from '@/hooks/auth/useSignin';
import { handleSignupError } from '@/utils/helpers/handleSignupError';
import { saveCookies } from '@/app/actions/saveCookies';
import { UserAuthRole } from '@/types/UserAuthRole';

const SignInForm = () => {
  const { mutateAsync: mutateSendOtp, isPending: isSendOtpPending } =
    useSendOtp();

  const { mutateAsync: mutateSignup, isPending: isSignupPending } = useSignin();

  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Adresse email invalide')
      .required("L'email est requis"),
    otp: Yup.string()
      .length(4, 'Le code OTP doit contenir 4 chiffres')
      .matches(/^\d+$/, 'Le code OTP ne doit contenir que des chiffres'),
  });

  // Formik hook
  const formik = useFormik({
    initialValues: {
      email: '',
      otp: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (step === 'email') {
        try {
          await mutateSendOtp(values.email);
          setStep('otp');
          await formik.setFieldValue('step', 'otp');
        } catch (error) {
          console.log(error);
          const errorMessage = handleOtpError(error);
          toast.error("Échec de l'envoi du code OTP", {
            description: errorMessage,
            position: 'bottom-right',
            className: '!bg-[#DF1C41] !text-white',
            descriptionClassName: '!text-white !text-xs',
          });
        }
      } else {
        try {
          const response = await mutateSignup({
            email: values.email,
            code: values.otp,
          });

          if (response.user.role === UserAuthRole.USER) {
            toast.error('Échec de la connexion', {
              description:
                "Vous n'avez pas les autorisations nécessaires pour accéder à cette application.",
              position: 'bottom-right',
              className: '!bg-[#DF1C41] !text-white',
              descriptionClassName: '!text-white !text-xs',
            });

            return;
          }

          await saveCookies(response.accessToken);

          toast.success('Connexion réussie', {
            description: 'Vous êtes maintenant connecté à votre compte.',
            position: 'bottom-right',
            className:
              '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
            descriptionClassName: '!text-[#176448] !text-sm',
          });

          router.replace('/dashboard');
        } catch (error) {
          const errorMessage = handleSignupError(error);
          toast.error('Échec de la connexion', {
            description: errorMessage,
            position: 'bottom-right',
            className: '!bg-[#DF1C41] !text-white',
            descriptionClassName: '!text-white !text-xs',
          });
        }
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white flex flex-col gap-6 w-full md:w-[27.5rem] rounded-3xl border border-[#E6E7E9] shadow-2xl shadow-[#585C5F1A] py-16 px-8"
    >
      <div className="flex flex-col gap-1 pb-8">
        <h2 className="text-center font-semibold text-2xl leading-6">
          Connectez-vous à votre compte
        </h2>
        <p className="text-center text-[#525866] leading-8">
          Saisissez vos coordonnées pour continuer
        </p>
      </div>

      <div className="flex flex-col gap-3 pb-8">
        {step === 'email' ? (
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <CustomInput
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              leftIcon={<Mail className="text-[#868C98]" size={16} />}
              placeholder="admin@gmail.com"
            />
            {formik.touched.email && formik.errors.email && (
              <CustomErrorIndicator message={formik.errors.email} />
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex justify-center">
              <CustomOtpInput
                value={formik.values.otp}
                onChange={(value: string) => formik.setFieldValue('otp', value)}
              />
            </div>
            {formik.touched.otp && formik.errors.otp && (
              <CustomErrorIndicator message={formik.errors.otp} />
            )}
          </div>
        )}
      </div>

      <CustomButton
        type="submit"
        disabled={isSendOtpPending || isSignupPending}
        isLoading={isSendOtpPending || isSignupPending}
      >
        {step === 'email' ? 'Se connecter' : 'Vérifier'}
      </CustomButton>
    </form>
  );
};

export default SignInForm;
