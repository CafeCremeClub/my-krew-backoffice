"use client";

import React, {useState} from 'react';
import CustomButton from "@/components/custom/CustomButton";
import AddNewPortageDialog from "./AddNewPortageDialog";

const PortagePageHeader = () => {

    const [isAddPortageDialogOpen, setIsAddPortageDialogOpen] = useState<boolean>(false);

    return (
        <>
            <AddNewPortageDialog
                isOpen={isAddPortageDialogOpen}
                onClose={() => setIsAddPortageDialogOpen(false)}
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-[#101828] font-semibold text-lg">
                    Liste des portages
                </p>

                <CustomButton
                    onClick={() => setIsAddPortageDialogOpen(true)}
                    className="sm:w-max w-full"
                >
                    Ajouter un portage
                </CustomButton>
            </div>
        </>
    );
};

export default PortagePageHeader;