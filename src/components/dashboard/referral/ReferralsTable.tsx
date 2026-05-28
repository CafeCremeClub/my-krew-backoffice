'use client';

import React, { useState } from 'react';
import useGetReferrals from '@/hooks/referral/useGetReferrals';
import ReferralsTableSkeleton from '@/components/dashboard/referral/ReferralsTableSkeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pen, Trash } from 'lucide-react';
import { formatDateToFR } from '@/utils/helpers/formatDateToFR';
import ReferralsTablePaginationControls from '@/components/dashboard/referral/ReferralsTablePaginationControls';
import EditReferralDialog from '@/components/dashboard/referral/EditReferralDialog';
import DeleteReferralAlertDialog from '@/components/dashboard/referral/DeleteReferralAlertDialog';
import { Referral } from '@/types/referral/Referral';

const ReferralsTable = () => {
  const [page, setPage] = useState<number>(1);
  const [referralToEdit, setReferralToEdit] = useState<Referral | null>(null);
  const [referralToDelete, setReferralToDelete] = useState<Referral | null>(
    null
  );

  const {
    isPending,
    isError,
    data: referrals,
  } = useGetReferrals({
    page,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getStatusBadge = (status: string) => {
    const getStatusConfig = (status: string) => {
      switch (status.toLowerCase()) {
        case 'active':
        case 'actif':
          return {
            label: 'Actif',
            className: 'bg-green-100 text-green-800 border-green-200',
          };
        case 'inactive':
        case 'inactif':
          return {
            label: 'Inactif',
            className: 'bg-red-100 text-red-800 border-red-200',
          };
        case 'pending':
        case 'en attente':
          return {
            label: 'En attente',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          };
        case 'completed':
        case 'terminé':
          return {
            label: 'Terminé',
            className: 'bg-blue-100 text-blue-800 border-blue-200',
          };
        default:
          return {
            label: status,
            className: 'bg-gray-100 text-gray-800 border-gray-200',
          };
      }
    };

    const statusConfig = getStatusConfig(status);
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}
      >
        {statusConfig.label}
      </span>
    );
  };

  const formatCurrency = (amount: string) => {
    const numericAmount = parseFloat(amount);
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(numericAmount);
  };

  const isArchivedEmail = (email: string) => email.startsWith('deleted-');

  const archivedBadge = (
    <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs rounded px-1.5 py-0.5 ml-2">
      Archivé
    </span>
  );

  const deletedEmailCell = (
    <span className="text-[#98A2B3] italic">Supprimé</span>
  );

  return (
    <>
      {referralToEdit && (
        <EditReferralDialog
          isOpen={!!referralToEdit}
          onClose={() => setReferralToEdit(null)}
          referral={referralToEdit}
        />
      )}

      {referralToDelete && (
        <DeleteReferralAlertDialog
          open={!!referralToDelete}
          onClose={() => setReferralToDelete(null)}
          referral={referralToDelete}
        />
      )}

      <div className="h-full overflow-y-auto">
        {isPending ? (
          <ReferralsTableSkeleton />
        ) : isError ? (
          <div className="flex justify-center items-center text-center text-red-500 text-sm h-full">
            Une erreur est survenue lors du chargement des parrainages.
          </div>
        ) : referrals && referrals.data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="h-16">
                  <TableRow>
                    <TableHead className="text-[#475467] text-xs min-w-40">
                      Parrain
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-40">
                      Email parrain
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      Téléphone parrain
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-40">
                      Filleul
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-40">
                      Email filleul
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      Téléphone filleul
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-24">
                      Statut
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-28">
                      Montant
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      Date début
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      Date fin
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      Date création
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-24">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.data.map((referral) => {
                    const deletedReferre = isArchivedEmail(
                      referral.referee.email
                    );
                    const deletedReferrer = isArchivedEmail(
                      referral.referrer.email
                    );
                    return (
                      <TableRow
                        key={referral.id}
                        className="hover:bg-gray-50 h-16"
                      >
                        <TableCell className="text-sm text-[#101828] font-medium">
                          <span className="inline-flex items-center">
                            {`${referral.referrer.firstname} ${referral.referrer.lastname}`}
                            {deletedReferrer ? archivedBadge : null}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {deletedReferrer
                            ? deletedEmailCell
                            : referral.referrer.email}
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {referral.referrer.phone}
                        </TableCell>
                        <TableCell className="text-sm text-[#101828] font-medium">
                          <span className="inline-flex items-center">
                            {`${referral.referee.firstname} ${referral.referee.lastname}`}
                            {deletedReferre ? archivedBadge : null}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {deletedReferre
                            ? deletedEmailCell
                            : referral.referee.email}
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {referral.referee.phone}
                        </TableCell>
                        <TableCell className="text-sm">
                          {getStatusBadge(referral.status)}
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {formatCurrency(referral.amount)}
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {formatDateToFR(referral.startDate)}
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {formatDateToFR(referral.endDate)}
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {formatDateToFR(referral.creationDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Modifier le parrainage"
                              title="Modifier"
                              className="h-8 w-8 hover:bg-gray-100 cursor-pointer text-[#475467]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReferralToEdit(referral);
                              }}
                            >
                              <Pen className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Supprimer le parrainage"
                              title="Supprimer"
                              className="h-8 w-8 hover:bg-red-50 cursor-pointer text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReferralToDelete(referral);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <ReferralsTablePaginationControls
              currentPage={referrals.page}
              totalCount={referrals.count}
              perPage={referrals.perPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="h-full flex flex-col justify-center items-center gap-0.5">
            <p className="font-semibold text-center text-2xl text-[#101828]">
              Pas encore de parrainages
            </p>
            <p className="text-center text-sm text-[#525866] font-medium">
              Aucun parrainage n&apos;a encore été ajouté
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ReferralsTable;
