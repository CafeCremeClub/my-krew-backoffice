"use client";

import React, {useState} from 'react';
import CustomButton from "@/components/custom/CustomButton";
import AddNewOfficeDialog from "./AddNewOfficeDialog";

const OfficePageHeader = () => {

    const [isAddOfficeDialogOpen, setIsAddOfficeDialogOpen] = useState<boolean>(false);

    return (
        <>
            <div className="flex items-center justify-between gap-8">
                <p className="text-[#101828] font-semibold text-lg">
                    Liste des bureaux
                </p>

                <CustomButton
                    onClick={() => setIsAddOfficeDialogOpen(true)}
                >
                    Ajouter un bureau
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
