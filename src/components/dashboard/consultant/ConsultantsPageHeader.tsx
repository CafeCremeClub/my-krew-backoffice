'use client';

import React, { useState } from 'react';
import CustomButton from '@/components/custom/CustomButton';
import AddNewConsultantDialog from '@/components/dashboard/consultant/AddNewConsultantDialog';
import ImportConsultantsCSVDialog from '@/components/dashboard/consultant/ImportConsultantsCSVDialog';
import { Plus } from 'lucide-react';
import { FaFileCsv } from 'react-icons/fa6';

interface ConsultantsPageHeaderProps {
  page?: number;
}

const ConsultantsPageHeader = ({ page = 1 }: ConsultantsPageHeaderProps) => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] =
    useState<boolean>(false);
  const [isImportCSVDialogOpen, setIsImportCSVDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <AddNewConsultantDialog
        page={page}
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
      />
      <ImportConsultantsCSVDialog
        page={page}
        isOpen={isImportCSVDialogOpen}
        onClose={() => setIsImportCSVDialogOpen(false)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[#101828] font-semibold text-lg">
          Liste des utilisateurs
        </p>

        <div className="flex items-center gap-2">
          <CustomButton
            onClick={() => setIsImportCSVDialogOpen(true)}
            className="sm:w-max w-full"
            icon={<FaFileCsv className="flex-none size-5" />}
          >
            Importer CSV
          </CustomButton>
          <CustomButton
            onClick={() => setIsAddUserDialogOpen(true)}
            className="sm:w-max w-full"
            icon={<Plus className="flex-none size-5" />}
          >
            Ajouter un utilisateur
          </CustomButton>
        </div>
      </div>
    </>
  );
};

export default ConsultantsPageHeader;
