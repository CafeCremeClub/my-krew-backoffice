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
import useCreateCSVConsultants from '@/hooks/consultant/useCreateCSVConsultants';
import { CreateCSVConsultantsPayload } from '@/types/consultant/CreateCSVConsultantsPayload';
import { ConsultantType } from '@/types/consultant/ConsultantType';
import { toast } from 'sonner';
import Papa from 'papaparse';
import * as yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { GET_CONSULTANTS_DEFAULT_PER_PAGE } from '@/hooks/consultant/useGetConsultants';
import { Consultant } from '@/types/consultant/Consultant';
import { ConsultantRole } from '@/types/consultant/ConsultantRole';
import { GetConsultantsResponse } from '@/types/consultant/GetConsultantsResponse';
import useGetPortages from '@/hooks/portage/useGetPortages';
import useGetOffices from '@/hooks/office/useGetOffices';
import { ConsultantStatus } from '@/types/consultant/ConsultantStatus';

interface ImportCSVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  page?: number;
}

type UserData = CreateCSVConsultantsPayload['users'][0];

interface CSVRowData extends UserData {
  rowIndex: number;
}

const userValidationSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  firstname: yup.string().required('Prénom requis'),
  lastname: yup.string().required('Nom requis'),
  phone: yup.string().required('Téléphone requis'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Statut invalide (active ou inactive)')
    .required('Statut requis'),
  type: yup
    .string()
    .oneOf(
      Object.values(ConsultantType),
      `Type invalide (${Object.values(ConsultantType).join(', ')})`
    )
    .required('Type requis'),
  startDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .required('Date de début requise'),
  endDate: yup
    .string()
    .nullable()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  portageId: yup.string().required('ID portage requis'),
  officeId: yup.string().required('ID bureau requis'),
});

const validatePayload = (
  data: CSVRowData[]
): { validData: UserData[]; errors: string[] } => {
  const validData: UserData[] = [];
  const errors: string[] = [];

  data.forEach((row) => {
    try {
      const { ...userData } = row;
      userValidationSchema.validateSync(userData, { abortEarly: false });
      validData.push(userData);
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

const ImportConsultantsCSVDialog = ({
  isOpen,
  onClose,
  page,
}: ImportCSVDialogProps) => {
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<UserData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createCSVConsultants, isPending } =
    useCreateCSVConsultants();

  const { data: portagesData } = useGetPortages();

  const { data: officesData } = useGetOffices();

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
          const requiredHeaders = [
            'email',
            'firstname',
            'lastname',
            'phone',
            'status',
            'type',
            'startDate',
            'portageId',
            'officeId',
          ];

          const actualHeaders = results.meta.fields || [];
          const missingHeaders = requiredHeaders.filter(
            (header) => !actualHeaders.includes(header)
          );

          if (missingHeaders.length > 0) {
            setErrors([`Colonnes manquantes: ${missingHeaders.join(', ')}`]);
            setIsProcessing(false);
            return;
          }

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

          const dataWithRowIndex: CSVRowData[] = (
            results.data as CSVRowData[]
          ).map((row, index) => {
            const rowData: CSVRowData = {
              email: row.email || '',
              firstname: row.firstname || '',
              lastname: row.lastname || '',
              phone: row.phone || '',
              status: row.status || '',
              type: row.type || '',
              startDate: row.startDate || '',
              portageId: row.portageId || '',
              officeId: row.officeId || '',
              rowIndex: index + 2,
            };

            if (row.endDate) {
              rowData.endDate = row.endDate;
            }

            return rowData;
          });

          const { validData, errors: validationErrors } =
            validatePayload(dataWithRowIndex);

          if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setIsProcessing(false);
            return;
          }

          const dataValidationErrors: string[] = [];

          validData.forEach((row, index) => {
            const rowNumber = index + 2;

            if (
              row.portageId &&
              !portagesData?.find((portage) => portage.id === row.portageId)
            ) {
              dataValidationErrors.push(
                `Ligne ${rowNumber}: ID portage "${row.portageId}" introuvable. Vérifiez que cet ID existe dans les données.`
              );
            }

            if (
              row.officeId &&
              !officesData?.find((office) => office.id === row.officeId)
            ) {
              dataValidationErrors.push(
                `Ligne ${rowNumber}: ID bureau "${row.officeId}" introuvable. Vérifiez que cet ID existe dans les données.`
              );
            }
          });

          if (dataValidationErrors.length > 0) {
            setErrors(dataValidationErrors);
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

    const payload: CreateCSVConsultantsPayload = {
      users: csvData,
    };

    try {
      const res = await createCSVConsultants(payload);

      const createdConsultants: Consultant[] = res.map((consultant, index) => {
        const csvUser = csvData[index];
        const officeName =
          officesData?.find((office) => office.id === csvUser.officeId)?.name ||
          'N/A';
        const portageName =
          portagesData?.find((portage) => portage.id === csvUser.portageId)
            ?.name || 'N/A';

        return {
          id: consultant.id,
          firstname: consultant.firstname,
          lastname: consultant.lastname,
          email: consultant.email,
          phone: consultant.phone,
          role: ConsultantRole.NONE,
          endDate: csvUser.endDate || undefined,
          monthlyEstimation: 0,
          office: officeName,
          performance: 0,
          portage: portageName,
          referrals: 0,
          startDate: csvUser.startDate,
          status: csvUser.status as ConsultantStatus,
          type: csvUser.type as ConsultantType,
        };
      });

      const queryKey = [
        'get-consultants',
        page ?? 1,
        GET_CONSULTANTS_DEFAULT_PER_PAGE,
        undefined,
      ];
      queryClient.setQueryData<GetConsultantsResponse>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          total: oldData.total + createdConsultants.length,
          data: [...createdConsultants, ...oldData.data],
        };
      });

      toast.success(`${csvData.length} consultant(s) importé(s) avec succès`, {
        position: 'bottom-right',
        className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
        descriptionClassName: '!text-[#176448] !text-sm',
      });

      handleClose();
    } catch (error) {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
          }
        )?.response?.data?.message || "Erreur lors de l'importation";

      toast.error("Échec de l'importation des consultants", {
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
            Importer des consultants via CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FaUpload className="mx-auto size-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Sélectionnez un fichier CSV contenant les données des
                consultants
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
              Le fichier doit contenir les colonnes suivantes (dans cet ordre):
            </p>
            <div className="text-xs font-mono bg-white p-2 rounded border">
              email, firstname, lastname, phone, status, type, startDate,
              endDate, portageId, officeId
            </div>
            <p className="text-xs text-blue-700 mt-2">
              • type: {Object.values(ConsultantType).join(', ')}
              <br />
              • status: active, inactive
              <br />
              • Dates au format: YYYY-MM-DD
              <br />• endDate est optionnelle (peut être laissée vide)
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
                  Fichier validé - {csvData.length} consultant(s) prêt(s) à être
                  importé(s)
                </h4>
              </div>
              <div className="text-sm text-green-800">
                <p className="mb-2">Aperçu des premières entrées:</p>
                <div className="bg-white p-2 rounded border text-xs">
                  {csvData.slice(0, 3).map((row, index) => (
                    <div key={index} className="mb-1">
                      {row.email} - {row.firstname} {row.lastname} ({row.type})
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
                : `Importer ${csvData.length} consultant(s)`}
            </CustomButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportConsultantsCSVDialog;
