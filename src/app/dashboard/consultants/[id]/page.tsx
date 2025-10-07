'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useGetConsultantById from '@/hooks/consultant/useGetConsultantById';
import { ArrowLeft, Pen, Plus, Trash } from 'lucide-react';
import CustomButton from '@/components/custom/CustomButton';
import { Skeleton } from '@/components/ui/skeleton';
import { ConsultantRole } from '@/types/consultant/ConsultantRole';
import { ConsultantStatus } from '@/types/consultant/ConsultantStatus';
import { formatDateToFR } from '@/utils/helpers/formatDateToFR';
import EditConsultantDialog from '@/components/dashboard/consultant/EditConsultantDialog';
import DeleteConsultantAlertDialog from '@/components/dashboard/consultant/DeleteConsultantAlertDialog';
import AddNewTransactionDialog from '@/components/dashboard/transaction/AddNewTransactionDialog';

const ConsultantDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const consultantId = params.id as string;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] =
    useState(false);

  const {
    data: consultant,
    isPending,
    isError,
  } = useGetConsultantById(consultantId);

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleDeleteSuccess = () => {
    router.push('/dashboard');
  };

  const getStatusLabel = (status: ConsultantStatus) => {
    return status === 'active' ? 'Actif' : 'Inactif';
  };

  const getStatusBadge = (status: ConsultantStatus) => {
    const isActive = status === 'active';
    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
          isActive
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}
      >
        {getStatusLabel(status)}
      </span>
    );
  };

  const getRoleBadge = (role: ConsultantRole) => {
    const getRoleConfig = (role: ConsultantRole) => {
      switch (role) {
        case ConsultantRole.AMBASSADOR:
          return {
            label: 'Ambassadeur',
            className: 'bg-purple-100 text-purple-800 border-purple-200',
          };
        case ConsultantRole.INFLUENCER:
          return {
            label: 'Influenceur',
            className: 'bg-blue-100 text-blue-800 border-blue-200',
          };
        case ConsultantRole.ELITE:
          return {
            label: 'Élite',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          };
        case ConsultantRole.NONE:
          return {
            label: 'Aucun',
            className: 'bg-gray-100 text-gray-800 border-gray-200',
          };
        default:
          return {
            label: role,
            className: 'bg-gray-100 text-gray-800 border-gray-200',
          };
      }
    };

    const roleConfig = getRoleConfig(role);
    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${roleConfig.className}`}
      >
        {roleConfig.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
        {type === 'balkani' ? 'Balkani' : 'Entrepreneur'}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatPerformance = (value: number | null) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return `${value}`;
  };

  if (isPending) {
    return (
      <div className="flex flex-col h-full bg-[#FAFAFA] p-6 gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="bg-white rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !consultant) {
    return (
      <div className="flex flex-col h-full bg-[#FAFAFA] p-6">
        <div className="flex items-center gap-4 mb-6">
          <CustomButton
            onClick={handleBack}
            icon={<ArrowLeft className="size-5" />}
            className="bg-white border border-gray-200 shadow-none text-secondary-foreground hover:bg-secondary/90"
          >
            Retour
          </CustomButton>
        </div>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <p className="text-xl font-semibold text-red-500">
              Erreur de chargement
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Impossible de charger les détails du consultant
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isEditDialogOpen && (
        <EditConsultantDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          consultant={consultant}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteConsultantAlertDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          consultant={consultant}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}

      {isAddTransactionDialogOpen && (
        <AddNewTransactionDialog
          isOpen={isAddTransactionDialogOpen}
          onClose={() => setIsAddTransactionDialogOpen(false)}
          consultant={consultant}
        />
      )}

      <div className="flex flex-col h-full bg-[#FAFAFA] p-6 gap-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CustomButton
              onClick={handleBack}
              icon={<ArrowLeft className="size-5" />}
              className="bg-white border border-gray-200 shadow-none text-secondary-foreground hover:bg-secondary/90"
            >
              Retour
            </CustomButton>
            <h1 className="text-2xl font-bold text-[#101828]">
              {consultant.firstname} {consultant.lastname}
            </h1>
          </div>

          <div className="flex gap-3">
            <CustomButton
              onClick={() => setIsAddTransactionDialogOpen(true)}
              icon={<Plus className="size-5" />}
            >
              Ajouter une transaction
            </CustomButton>
            <CustomButton
              onClick={() => setIsEditDialogOpen(true)}
              icon={<Pen className="size-4" />}
            >
              Modifier
            </CustomButton>
            <CustomButton
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setIsDeleteDialogOpen(true)}
              icon={<Trash className="size-4" />}
            >
              Supprimer
            </CustomButton>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Informations personnelles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#101828] mb-4">
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm text-[#475467] font-medium">
                  Email
                </span>
                <span className="text-sm text-[#101828] text-right">
                  {consultant.email}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-[#475467] font-medium">
                  Téléphone
                </span>
                <span className="text-sm text-[#101828] text-right">
                  {consultant.phone || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-[#475467] font-medium">
                  Statut
                </span>
                <div>{getStatusBadge(consultant.status)}</div>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-[#475467] font-medium">Type</span>
                <div>{getTypeBadge(consultant.type)}</div>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-[#475467] font-medium">Rôle</span>
                <div>{getRoleBadge(consultant.role)}</div>
              </div>
            </div>
          </div>

          {/* Card 2: Informations professionnelles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#101828] mb-4">
              Informations professionnelles
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm text-[#475467] font-medium">
                  Bureau
                </span>
                <span className="text-sm text-[#101828] text-right">
                  {consultant.office}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-[#475467] font-medium">
                  Société de portage
                </span>
                <span className="text-sm text-[#101828] text-right">
                  {consultant.portage}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-[#475467] font-medium">
                  Date de début
                </span>
                <span className="text-sm text-[#101828] text-right">
                  {formatDateToFR(consultant.startDate)}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-[#475467] font-medium">
                  Date de fin
                </span>
                <span className="text-sm text-[#101828] text-right">
                  {consultant.endDate
                    ? formatDateToFR(consultant.endDate)
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Performance et estimations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-[#101828] mb-4">
              Performance et estimations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <span className="text-sm text-[#475467] font-medium">
                  Estimation mensuelle
                </span>
                <p className="text-2xl font-bold text-[#101828]">
                  {formatCurrency(consultant.monthlyEstimation)}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-[#475467] font-medium">
                  Performance
                </span>
                <p className="text-2xl font-bold text-[#101828]">
                  {formatPerformance(consultant.performance)}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-[#475467] font-medium">
                  Parrainages
                </span>
                <p className="text-2xl font-bold text-[#101828]">
                  {consultant.referrals}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDetailsPage;
