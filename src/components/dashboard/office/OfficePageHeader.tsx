'use client';

import React, { useState } from 'react';
import CustomButton from '@/components/custom/CustomButton';
import AddNewOfficeDialog from './AddNewOfficeDialog';
import { Plus, Info } from 'lucide-react';

const OfficePageHeader = () => {
  const [isAddOfficeDialogOpen, setIsAddOfficeDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <p className="text-[#101828] font-semibold text-lg">Liste des LLPs</p>
          <span
            className="inline-flex items-center text-[#98A2B3] cursor-help"
            title="LLP — Limited Liability Partnership : structure juridique de société à responsabilité limitée rattachée à un consultant."
            aria-label="LLP signifie Limited Liability Partnership"
          >
            <Info className="size-4" />
          </span>
        </div>

        <CustomButton
          onClick={() => setIsAddOfficeDialogOpen(true)}
          className="sm:w-max w-full"
          icon={<Plus className="flex-none size-5" />}
        >
          Ajouter un LLP
        </CustomButton>
      </div>

      <AddNewOfficeDialog
        isOpen={isAddOfficeDialogOpen}
        onClose={() => setIsAddOfficeDialogOpen(false)}
      />
    </>
  );
};

export default OfficePageHeader;
