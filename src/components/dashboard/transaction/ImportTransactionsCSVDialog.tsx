'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomButton from '@/components/custom/CustomButton';
import { FaFileCsv, FaUpload } from 'react-icons/fa6';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import useCreateCSVTransactions from '@/hooks/transaction/useCreateCSVTransactions';
import { CreateCSVTransactionsPayload } from '@/types/transaction/CreateCSVTransactionsPayload';
import { TransactionType } from '@/types/transaction/TransactionType';
import { TransactionStatus } from '@/types/transaction/TransactionStatus';
import { toast } from 'sonner';
import Papa from 'papaparse';
import * as yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { GET_TRANSACTIONS_DEFAULT_PER_PAGE } from '@/hooks/transaction/useGetTransactions';

interface ImportTransactionsCSVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  page?: number;
}

type TransactionData = CreateCSVTransactionsPayload['transactions'][0];

interface CSVRowData extends TransactionData {
  rowIndex: number;
}

// Validation schema using yup
const transactionValidationSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  amount: yup
    .number()
    .min(0, 'Montant doit être positif')
    .required('Montant requis'),
  type: yup
    .string()
    .oneOf(
      Object.values(TransactionType),
      `Type invalide (${Object.values(TransactionType).join(', ')})`
    )
    .required('Type requis'),
  status: yup
    .string()
    .oneOf(
      Object.values(TransactionStatus),
      `Statut invalide (${Object.values(TransactionStatus).join(', ')})`
    )
    .required('Statut requis'),
  date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .required('Date requise'),
  comment: yup.string().optional(),
});

const validatePayload = (
  data: CSVRowData[]
): { validData: TransactionData[]; errors: string[] } => {
  const validData: TransactionData[] = [];
  const errors: string[] = [];

  data.forEach((row) => {
    try {
      // Remove rowIndex for validation
      const { ...transactionData } = row;
      transactionValidationSchema.validateSync(transactionData, {
        abortEarly: false,
      });
      validData.push(transactionData);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.errors.forEach((err) => {
          errors.push(`Ligne ${row.rowIndex}: ${err}`);
        });
      } else {
        errors.push(`Ligne ${row.rowIndex}: Erreur de validation`);
      }
    }
  });

  return { validData, errors };
};

const ImportTransactionsCSVDialog = ({
  isOpen,
  onClose,
  page,
}: ImportTransactionsCSVDialogProps) => {
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<TransactionData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createCSVTransactions, isPending } =
    useCreateCSVTransactions();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setErrors([]);
      processCSVFile(file);
    } else {
      toast.error('Veuillez sélectionner un fichier CSV valide');
    }
  };

  const processCSVFile = (file: File) => {
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => value.trim(),
      complete: (results) => {
        try {
          // Expected headers
          const expectedHeaders = ['email', 'amount', 'type', 'status', 'date'];

          // Validate headers
          const actualHeaders = results.meta.fields || [];
          const missingHeaders = expectedHeaders.filter(
            (header) => !actualHeaders.includes(header)
          );

          if (missingHeaders.length > 0) {
            setErrors([`Colonnes manquantes: ${missingHeaders.join(', ')}`]);
            setIsProcessing(false);
            return;
          }

          // Check for parsing errors
          if (results.errors.length > 0) {
            const parseErrors = results.errors.map(
              (error) =>
                `Ligne ${
                  error.row !== undefined ? error.row + 2 : 'inconnue'
                }: ${error.message}`
            );
            setErrors(parseErrors);
            setIsProcessing(false);
            return;
          }

          // Add row index to data for validation error reporting
          const dataWithRowIndex: CSVRowData[] = (
            results.data as CSVRowData[]
          ).map((row, index) => ({
            email: row.email || '',
            amount: parseFloat(row.amount.toString()) || 0,
            type: row.type || '',
            status: row.status || '',
            date: row.date || '',
            comment: row.comment || undefined,
            rowIndex: index + 2, // +2 because CSV row numbers start at 1 and we skip header
          }));

          // Validate data using yup
          const { validData, errors: validationErrors } =
            validatePayload(dataWithRowIndex);

          if (validationErrors.length > 0) {
            setErrors(validationErrors);
          } else {
            setCsvData(validData);
          }
        } catch (error) {
          console.error('Error processing CSV file:', error);
          setErrors(['Erreur lors du traitement du fichier CSV']);
        } finally {
          setIsProcessing(false);
        }
      },
      error: (error) => {
        setErrors([`Erreur de lecture du fichier: ${error.message}`]);
        setIsProcessing(false);
      },
    });
  };

  const handleImport = async () => {
    if (csvData.length === 0) return;

    const payload: CreateCSVTransactionsPayload = {
      transactions: csvData,
    };

    try {
      await createCSVTransactions(payload);

      // Update the cache with the new transactions
      await queryClient.invalidateQueries({
        queryKey: [
          'get-transactions',
          page ?? 1,
          GET_TRANSACTIONS_DEFAULT_PER_PAGE,
        ],
        type: 'all',
        exact: true,
      });

      toast.success(
        `${csvData.length} transaction(s) importée(s) avec succès`,
        {
          position: 'bottom-right',
          className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          descriptionClassName: '!text-[#176448] !text-sm',
        }
      );

      handleClose();
    } catch (error) {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
          }
        )?.response?.data?.message || "Erreur lors de l'importation";

      toast.error("Échec de l'importation des transactions", {
        description: errorMessage,
        position: 'bottom-right',
        className: '!bg-[#DF1C41] !text-white',
        descriptionClassName: '!text-white !text-xs',
      });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCsvData([]);
    setErrors([]);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaFileCsv className="size-5 text-blue-600" />
            Importer des transactions via CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FaUpload className="mx-auto size-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Sélectionnez un fichier CSV contenant les données des
                transactions
              </p>
              <CustomButton
                onClick={triggerFileInput}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Traitement...' : 'Choisir un fichier'}
              </CustomButton>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FaFileCsv className="size-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setCsvData([]);
                    setErrors([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>

          {/* Format Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Format requis du fichier CSV:
            </h4>
            <p className="text-sm text-blue-800 mb-2">
              Le fichier doit contenir les colonnes suivantes:
            </p>
            <div className="text-xs font-mono bg-white p-2 rounded border">
              email, amount, type, status, date, comment (optionnel)
            </div>
            <p className="text-xs text-blue-700 mt-2">
              • type: {Object.values(TransactionType).join(', ')}
              <br />• status: {Object.values(TransactionStatus).join(', ')}
              <br />
              • Dates au format: YYYY-MM-DD
              <br />
              • amount: montant numérique (ex: 1500.50)
              <br />• comment: texte libre (optionnel)
            </p>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="size-4 text-red-600" />
                <h4 className="font-medium text-red-900">Erreurs détectées:</h4>
              </div>
              <ul className="text-sm text-red-800 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Preview */}
          {csvData.length > 0 && errors.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="size-4 text-green-600" />
                <h4 className="font-medium text-green-900">
                  Fichier validé - {csvData.length} transaction(s) prête(s) à
                  être importée(s)
                </h4>
              </div>
              <div className="text-sm text-green-800">
                <p className="mb-2">Aperçu des premières entrées:</p>
                <div className="bg-white p-2 rounded border text-xs">
                  {csvData.slice(0, 3).map((row, index) => (
                    <div key={index} className="mb-1">
                      {row.email} - {row.amount}€ ({row.type}) - {row.status}
                      {row.comment && ` - ${row.comment}`}
                    </div>
                  ))}
                  {csvData.length > 3 && (
                    <div className="text-gray-500">
                      ... et {csvData.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <CustomButton
              onClick={handleImport}
              disabled={csvData.length === 0 || errors.length > 0 || isPending}
              isLoading={isPending}
            >
              {isPending
                ? 'Importation...'
                : `Importer ${csvData.length} transaction(s)`}
            </CustomButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTransactionsCSVDialog;
