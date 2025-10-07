'use client';

import React from 'react';
import { Copy } from 'lucide-react';
import useGetPortages from '@/hooks/portage/useGetPortages';
import PortagesTableSkeleton from '@/components/dashboard/portage/PortagesTableSkeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PortagesTable = () => {
  const { isPending, isError, data: portages } = useGetPortages();

  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('ID copié dans le presse-papier', {
        position: 'bottom-right',
        className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {isPending ? (
        <PortagesTableSkeleton />
      ) : isError ? (
        <div className="flex justify-center items-center text-center text-red-500 text-sm h-full">
          Une erreur est survenue lors du chargement des portages.
        </div>
      ) : portages && portages.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="h-16">
              <TableRow>
                <TableHead className="text-[#475467] text-xs min-w-40">
                  ID
                </TableHead>
                <TableHead className="text-[#475467] text-xs min-w-40">
                  Nom
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portages.map((portage) => (
                <TableRow
                  key={portage.id}
                  className="cursor-pointer hover:bg-gray-50 h-16"
                >
                  <TableCell className="text-sm text-[#101828] font-medium">
                    <div className="flex items-center gap-2">
                      <span>{portage.id}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-gray-100 cursor-pointer"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await copyToClipboard(portage.id);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#101828] font-medium">
                    {portage.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center items-center gap-0.5">
          <p className="font-semibold text-center text-2xl text-[#101828]">
            Pas encore de portages
          </p>
          <p className="text-center text-sm text-[#525866] font-medium">
            Aucun portage n&apos;a encore été ajouté
          </p>
        </div>
      )}
    </div>
  );
};

export default PortagesTable;
