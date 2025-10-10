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

const ConsultantsTableSkeleton = () => {
  const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="h-16">
            <TableRow>
              <TableHead className="text-[#475467] text-xs min-w-40">
                Nom complet
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-40">
                Email
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-24">
                Statut
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-32">
                Date de début
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-32">
                Date de fin
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-32">
                LLP
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-40">
                Société de portage
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-28">
                Rôle
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-32">
                Estimation mensuelle
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-28">
                Taux de rendement
              </TableHead>
              <TableHead className="text-[#475467] text-xs min-w-28">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((index) => (
              <TableRow key={index} className="h-16">
                {/* Nom complet */}
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                {/* Email */}
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                {/* Statut */}
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                {/* Date de début */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                {/* Date de fin */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                {/* LLP */}
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                {/* Société de portage */}
                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>
                {/* Rôle */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                {/* Estimation mensuelle */}
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                {/* Taux de rendement */}
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                {/* Actions */}
                <TableCell>
                  <Skeleton className="h-9 w-20 rounded-md" />
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

export default ConsultantsTableSkeleton;
