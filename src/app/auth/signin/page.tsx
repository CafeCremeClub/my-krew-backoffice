import React from 'react';
import SignInForm from '@/components/auth/signin/SignInForm';

const SignInPage = () => {
  return (
    <div className="relative h-screen flex justify-center items-center px-2 overflow-hidden">
      <div className="-z-10 absolute flex gap-12 rotate-45">
        <div className="size-80 sm:size-96 rounded-full bg-gradient-to-br from-white via-[#51BAFF]/20 to-white blur-2xl" />
        <div className="size-80 sm:size-96 rounded-full bg-gradient-to-br from-white via-[#51BAFF]/20 to-white blur-2xl" />
      </div>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
