'use client';

import React, { useState } from 'react';
import CustomButton from '@/components/custom/CustomButton';
import { FaFileCsv, FaDownload } from 'react-icons/fa6';
import ImportTransactionsCSVDialog from '@/components/dashboard/transaction/ImportTransactionsCSVDialog';
import useExportTransactionsCSV from '@/hooks/transaction/useExportTransactionsCSV';
import { Transaction } from '@/types/transaction/Transaction';
import { toast } from 'sonner';

interface TransactionPageHeaderProps {
  exportSearch?: string;
  selectedTransactions?: Transaction[];
}

const TransactionPageHeader = ({
  exportSearch,
  selectedTransactions = [],
}: TransactionPageHeaderProps) => {
  const [isImportCSVDialogOpen, setIsImportCSVDialogOpen] =
    useState<boolean>(false);

  const { mutate: exportTransactions, isPending: isExporting } =
    useExportTransactionsCSV();

  const hasSelection = selectedTransactions.length > 0;

  const handleExport = () => {
    exportTransactions(
      { selected: selectedTransactions, search: exportSearch },
      {
        onSuccess: ({ transactions }) => {
          if (transactions.length === 0) {
            toast.error('Aucune transaction à exporter', {
              position: 'bottom-right',
              className: '!bg-[#DF1C41] !text-white',
            });
            return;
          }

          toast.success(`${transactions.length} transaction(s) exportée(s)`, {
            position: 'bottom-right',
            className:
              '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          });
        },
        onError: (error) => {
          const errorMessage =
            (
              error as {
                response?: { data?: { message?: string } };
              }
            )?.response?.data?.message || "Erreur lors de l'export";

          toast.error("Échec de l'export des transactions", {
            description: errorMessage,
            position: 'bottom-right',
            className: '!bg-[#DF1C41] !text-white',
            descriptionClassName: '!text-white !text-xs',
          });
        },
      }
    );
  };

  const exportLabel = isExporting
    ? 'Export...'
    : hasSelection
      ? `Exporter la sélection (${selectedTransactions.length})`
      : 'Exporter CSV';

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[#101828] font-semibold text-lg">
          Liste des transactions
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:w-max w-full">
          <CustomButton
            onClick={handleExport}
            isLoading={isExporting}
            className="sm:w-max w-full bg-white !text-[#375DFB] border border-[#375DFB] hover:bg-[#375DFB]/5 shadow-none"
            icon={<FaDownload className="flex-none size-4" />}
          >
            {exportLabel}
          </CustomButton>

          <CustomButton
            onClick={() => setIsImportCSVDialogOpen(true)}
            className="sm:w-max w-full"
            icon={<FaFileCsv className="flex-none size-5" />}
          >
            Importer CSV
          </CustomButton>
        </div>
      </div>

      <ImportTransactionsCSVDialog
        isOpen={isImportCSVDialogOpen}
        onClose={() => setIsImportCSVDialogOpen(false)}
      />
    </>
  );
};

export default TransactionPageHeader;
