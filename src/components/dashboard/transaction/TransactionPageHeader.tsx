"use client";

import React, {useState} from 'react';
import CustomButton from "@/components/custom/CustomButton";
import {FaFileCsv} from "react-icons/fa6";
import ImportTransactionsCSVDialog from "@/components/dashboard/transaction/ImportTransactionsCSVDialog";


const TransactionPageHeader = () => {

    const [isImportCSVDialogOpen, setIsImportCSVDialogOpen] = useState<boolean>(false);

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-[#101828] font-semibold text-lg">
                    Liste des transactions
                </p>

                <CustomButton
                    onClick={() => setIsImportCSVDialogOpen(true)}
                    className="sm:w-max w-full"
                    icon={<FaFileCsv className="flex-none size-5"/>}
                >
                    Importer CSV
                </CustomButton>
            </div>

            <ImportTransactionsCSVDialog
                isOpen={isImportCSVDialogOpen}
                onClose={() => setIsImportCSVDialogOpen(false)}
            />
        </>
    );
};

export default TransactionPageHeader;
