'use client';

import React, { useState } from 'react';
import { Copy, Pen } from 'lucide-react';
import useGetPortages from '@/hooks/portage/useGetPortages';
import PortagesTableSkeleton from '@/components/dashboard/portage/PortagesTableSkeleton';
import EditPortageDialog from '@/components/dashboard/portage/EditPortageDialog';
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
import { Portage } from '@/types/portage/Portage';

const PortagesTable = () => {
  const { isPending, isError, data: portages } = useGetPortages();

  const [portageToEdit, setPortageToEdit] = useState<Portage | null>(null);

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
      {portageToEdit && (
        <EditPortageDialog
          isOpen={!!portageToEdit}
          onClose={() => setPortageToEdit(null)}
          portage={portageToEdit}
        />
      )}

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
                  Nom
                </TableHead>
                <TableHead className="text-[#475467] text-xs min-w-40">
                  Identifiant
                </TableHead>
                <TableHead className="text-[#475467] text-xs min-w-24">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portages.map((portage) => (
                <TableRow key={portage.id} className="hover:bg-gray-50 h-16">
                  <TableCell className="text-sm text-[#101828] font-medium">
                    {portage.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs text-[#98A2B3] font-mono"
                        title={portage.id}
                      >
                        {portage.id}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Copier l'identifiant"
                        title="Copier l'identifiant"
                        className="h-6 w-6 hover:bg-gray-100 cursor-pointer text-[#98A2B3]"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await copyToClipboard(portage.id);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Modifier la société de portage"
                      title="Modifier"
                      className="h-8 w-8 hover:bg-gray-100 cursor-pointer text-[#475467]"
                      onClick={() => setPortageToEdit(portage)}
                    >
                      <Pen className="h-4 w-4" />
                    </Button>
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
