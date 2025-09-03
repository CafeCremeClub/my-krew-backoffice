"use client";

import React, {useState} from 'react';
import CustomButton from "@/components/custom/CustomButton";
import AddNewTransactionDialog from "@/components/dashboard/transaction/AddNewTransactionDialog";

interface TransactionPageHeaderProps {
    page?: number;
}

const TransactionPageHeader = ({page = 1}: TransactionPageHeaderProps) => {

    const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState<boolean>(false);

    return (
        <>
            <AddNewTransactionDialog
                page={page}
                isOpen={isAddTransactionDialogOpen}
                onClose={() => setIsAddTransactionDialogOpen(false)}
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-[#101828] font-semibold text-lg">
                    Liste des transactions
                </p>
            </div>
        </>
    );
};

export default TransactionPageHeader;
