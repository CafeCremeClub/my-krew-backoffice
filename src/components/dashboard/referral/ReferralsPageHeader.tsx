'use client';

import React, { useState } from 'react';
import CustomButton from '@/components/custom/CustomButton';
import AddNewReferralDialog from '@/components/dashboard/referral/AddNewReferralDialog';
import { Plus } from 'lucide-react';

interface ReferralsPageHeaderProps {
  page?: number;
}

const ReferralsPageHeader = ({ page = 1 }: ReferralsPageHeaderProps) => {
  const [isAddReferralDialogOpen, setIsAddReferralDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <AddNewReferralDialog
        page={page}
        isOpen={isAddReferralDialogOpen}
        onClose={() => setIsAddReferralDialogOpen(false)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[#101828] font-semibold text-lg">
          Liste des cooptations
        </p>

        <CustomButton
          onClick={() => setIsAddReferralDialogOpen(true)}
          className="sm:w-max w-full"
          icon={<Plus className="flex-none size-5" />}
        >
          Ajouter une cooptation
        </CustomButton>
      </div>
    </>
  );
};

export default ReferralsPageHeader;
