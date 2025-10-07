'use client';

import React, { useState } from 'react';
import useGetTransactions from '@/hooks/transaction/useGetTransactions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TransactionType } from '@/types/transaction/TransactionType';
import { TransactionStatus } from '@/types/transaction/TransactionStatus';
import { ConsultantStatus } from '@/types/consultant/ConsultantStatus';
import { formatDateToFR } from '@/utils/helpers/formatDateToFR';
import TransactionsTablePaginationControls from '@/components/dashboard/transaction/TransactionsTablePaginationControls';
import TransactionsTableSkeleton from '@/components/dashboard/transaction/TransactionsTableSkeleton';
import { Transaction } from '@/types/transaction/Transaction';

const TransactionsTable = () => {
  const [page, setPage] = useState<number>(1);

  const {
    isPending,
    isError,
    data: transactions,
  } = useGetTransactions({
    page,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getTransactionTypeBadge = (type: TransactionType) => {
    const getTypeConfig = (type: TransactionType) => {
      switch (type) {
        case TransactionType.SALARY:
          return {
            label: 'Salaire',
            className: 'bg-blue-100 text-blue-800 border-blue-200',
          };
        case TransactionType.PARTICIPATION:
          return {
            label: 'Participation',
            className: 'bg-green-100 text-green-800 border-green-200',
          };
        case TransactionType.REFERRAL:
          return {
            label: 'Parrainage',
            className: 'bg-purple-100 text-purple-800 border-purple-200',
          };
        default:
          return {
            label: type,
            className: 'bg-gray-100 text-gray-800 border-gray-200',
          };
      }
    };

    const typeConfig = getTypeConfig(type);
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${typeConfig.className}`}
      >
        {typeConfig.label}
      </span>
    );
  };

  const getTransactionStatusBadge = (status: TransactionStatus) => {
    const getStatusConfig = (status: TransactionStatus) => {
      switch (status) {
        case TransactionStatus.PAYED:
          return {
            label: 'Payée',
            className: 'bg-green-100 text-green-800 border-green-200',
          };
        case TransactionStatus.PENDING:
          return {
            label: 'En attente',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          };
        case TransactionStatus.WAITING:
          return {
            label: 'En cours',
            className: 'bg-orange-100 text-orange-800 border-orange-200',
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

  const getConsultantStatusBadge = (status: ConsultantStatus) => {
    const isActive = status === 'active';
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isActive
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}
      >
        {isActive ? 'Actif' : 'Inactif'}
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

  const isDeletedConsultant = (transaction: Transaction) => {
    return transaction.email.includes('deleted-');
  };

  return (
    <>
      <div className="h-full overflow-y-auto">
        {isPending ? (
          <TransactionsTableSkeleton />
        ) : isError ? (
          <div className="flex justify-center items-center text-center text-red-500 text-sm h-full">
            Une erreur est survenue lors du chargement des transactions.
          </div>
        ) : transactions && transactions.data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="h-16">
                  <TableRow>
                    <TableHead className="text-[#475467] text-xs min-w-40">
                      Consultant
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-40">
                      Email
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      Téléphone
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      Type transaction
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-24">
                      Statut
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      Statut consultant
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-28">
                      Montant
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.data.map((transaction) => {
                    const deletedConsultant = isDeletedConsultant(transaction);
                    return (
                      <TableRow
                        key={transaction.id}
                        className={`cursor-pointer hover:bg-gray-50 h-16 ${
                          deletedConsultant
                            ? 'bg-red-50 border-l-4 border-red-400'
                            : ''
                        }`}
                      >
                        <TableCell
                          className={`text-sm font-medium ${
                            deletedConsultant
                              ? 'text-red-600'
                              : 'text-[#101828]'
                          }`}
                        >
                          {deletedConsultant ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Supprimé
                            </span>
                          ) : (
                            `${transaction.firstname} ${transaction.lastname}`
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-sm ${
                            deletedConsultant
                              ? 'text-red-600'
                              : 'text-[#475467]'
                          }`}
                        >
                          {deletedConsultant ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Supprimé
                            </span>
                          ) : (
                            transaction.email
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-sm ${
                            deletedConsultant
                              ? 'text-red-600'
                              : 'text-[#475467]'
                          }`}
                        >
                          {deletedConsultant ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Supprimé
                            </span>
                          ) : (
                            transaction.phone
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {deletedConsultant ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Supprimé
                            </span>
                          ) : (
                            getTransactionTypeBadge(transaction.type)
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {deletedConsultant ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Supprimé
                            </span>
                          ) : (
                            getTransactionStatusBadge(transaction.status)
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {deletedConsultant ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Supprimé
                            </span>
                          ) : (
                            getConsultantStatusBadge(
                              transaction.consultantStatus
                            )
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-sm text-[#475467]">
                          {formatDateToFR(transaction.date)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <TransactionsTablePaginationControls
              currentPage={transactions.page}
              totalCount={transactions.count}
              perPage={transactions.perPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="h-full flex flex-col justify-center items-center gap-0.5">
            <p className="font-semibold text-center text-2xl text-[#101828]">
              Pas encore de transactions
            </p>
            <p className="text-center text-sm text-[#525866] font-medium">
              Aucune transaction n&apos;a encore été ajoutée
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionsTable;
