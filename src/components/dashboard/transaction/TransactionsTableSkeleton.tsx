import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const TransactionsTableSkeleton = () => {
  const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div className="overflow-hidden">
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
              <TableHead className="text-[#475467] text-xs min-w-40">
                Commentaires
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((index) => (
              <TableRow key={index} className="h-16">
                {/* Consultant */}
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                {/* Email */}
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                {/* Téléphone */}
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                {/* Type transaction */}
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                {/* Statut */}
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                {/* Statut consultant */}
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                {/* Montant */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                {/* Date */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                {/* Commentaires */}
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                {/* Actions */}
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default TransactionsTableSkeleton;
