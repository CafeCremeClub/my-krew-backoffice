'use client';

import React from 'react';
import useGetOffices from '@/hooks/office/useGetOffices';
import OfficesTableSkeleton from '@/components/dashboard/office/OfficesTableSkeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

const OfficesTable = () => {
  const { isPending, isError, data: offices } = useGetOffices();

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
        <OfficesTableSkeleton />
      ) : isError ? (
        <div className="flex justify-center items-center text-center text-red-500 text-sm h-full">
          Une erreur est survenue lors du chargement des LLPs.
        </div>
      ) : offices && offices.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="h-16">
              <TableRow>
                <TableHead className="text-[#475467] text-xs min-w-40">
                  Nom
                </TableHead>
                <TableHead className="text-[#475467] text-xs min-w-40">
                  Identifiant
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offices.map((office) => (
                <TableRow key={office.id} className="hover:bg-gray-50 h-16">
                  <TableCell className="text-sm text-[#101828] font-medium">
                    {office.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs text-[#98A2B3] font-mono"
                        title={office.id}
                      >
                        {office.id}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Copier l'identifiant"
                        title="Copier l'identifiant"
                        className="h-6 w-6 hover:bg-gray-100 cursor-pointer text-[#98A2B3]"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await copyToClipboard(office.id);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center items-center gap-0.5">
          <p className="font-semibold text-center text-2xl text-[#101828]">
            Pas encore de LLPs
          </p>
          <p className="text-center text-sm text-[#525866] font-medium">
            Aucun LLP n&apos;a encore été ajouté
          </p>
        </div>
      )}
    </div>
  );
};

export default OfficesTable;
