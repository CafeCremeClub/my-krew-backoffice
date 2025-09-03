"use client";

import React, {useState} from 'react';
import CustomButton from "@/components/custom/CustomButton";
import AddNewConsultantDialog from "@/components/dashboard/consultant/AddNewConsultantDialog";
import {Plus} from "lucide-react";

interface ConsultantsPageHeaderProps {
    page?: number;
}

const ConsultantsPageHeader = ({page = 1}: ConsultantsPageHeaderProps) => {

    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState<boolean>(false);

    return (
        <>
            <AddNewConsultantDialog
                page={page}
                isOpen={isAddUserDialogOpen}
                onClose={() => setIsAddUserDialogOpen(false)}
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-[#101828] font-semibold text-lg">
                    Liste des utilisateurs
                </p>

                <CustomButton
                    onClick={() => setIsAddUserDialogOpen(true)}
                    className="sm:w-max w-full"
                    icon={<Plus className="flex-none size-5"/>}
                >
                    Ajouter un utilisateur
                </CustomButton>
            </div>
        </>
    );
};

export default ConsultantsPageHeader;