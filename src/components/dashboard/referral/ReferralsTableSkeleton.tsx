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

const ReferralsTableSkeleton = () => {
  // Create skeleton rows - typically 8 rows for a good skeleton effect
  const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div className="overflow-hidden">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((index) => (
              <TableRow key={index} className="h-16">
                {/* Parrain */}
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                {/* Email parrain */}
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                {/* Téléphone parrain */}
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                {/* Filleul */}
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                {/* Email filleul */}
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                {/* Téléphone filleul */}
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                {/* Statut */}
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                {/* Montant */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                {/* Date début */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                {/* Date fin */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                {/* Date création */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
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

export default ReferralsTableSkeleton;
