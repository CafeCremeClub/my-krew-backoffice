import React, {useState} from 'react';
import CustomButton from "@/components/custom/CustomButton";
import AddNewConsultantDialog from "@/components/dashboard/consultant/AddNewConsultantDialog";

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
            <div className="flex items-center justify-between gap-8">
                <p className="text-[#101828] font-semibold text-lg">
                    Liste des utilisateurs
                </p>

                <CustomButton
                    onClick={() => setIsAddUserDialogOpen(true)}
                >
                    Ajouter un utilisateur
                </CustomButton>
            </div>
        </>
    );
};

export default ConsultantsPageHeader;