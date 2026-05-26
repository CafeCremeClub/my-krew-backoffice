import React, { useEffect, useMemo, useRef, useState } from 'react';
import useGetConsultants from '@/hooks/consultant/useGetConsultants';
import ConsultantsTableSkeleton from '@/components/dashboard/consultant/ConsultantsTableSkeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ConsultantRole } from '@/types/consultant/ConsultantRole';
import { ConsultantStatus } from '@/types/consultant/ConsultantStatus';
import { Consultant } from '@/types/consultant/Consultant';
import {
  ConsultantsSortBy,
  ConsultantsSortOrder,
} from '@/types/consultant/GetConsultantsParams';
import { formatDateToFR } from '@/utils/helpers/formatDateToFR';
import ConsultantsTablePaginationControls from '@/components/dashboard/consultant/ConsultantsTablePaginationControls';
import EditConsultantDialog from '@/components/dashboard/consultant/EditConsultantDialog';
import DeleteConsultantAlertDialog from '@/components/dashboard/consultant/DeleteConsultantAlertDialog';
import BulkEditConsultantsDialog from '@/components/dashboard/consultant/BulkEditConsultantsDialog';
import CustomButton from '@/components/custom/CustomButton';
import { ArrowDown, ArrowUp, ChevronsUpDown, Eye, Pen, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConsultantsTableProps {
  page?: number;
  setPage?: (page: number) => void;
  perPage?: number;
  search?: string;
  status?: string;
  portageId?: string;
  officeId?: string;
  sortBy?: ConsultantsSortBy;
  sortOrder?: ConsultantsSortOrder;
  onSort?: (column: ConsultantsSortBy) => void;
}

const ConsultantsTable = ({
  page,
  setPage = () => {},
  perPage,
  search,
  status,
  portageId,
  officeId,
  sortBy,
  sortOrder,
  onSort = () => {},
}: ConsultantsTableProps) => {
  const router = useRouter();

  const [consultantToEdit, setConsultantToEdit] = useState<Consultant | null>(
    null
  );
  const [consultantToDelete, setConsultantToDelete] =
    useState<Consultant | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkEditOpen, setIsBulkEditOpen] = useState<boolean>(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const {
    isPending,
    isError,
    data: consultants,
  } = useGetConsultants({
    page,
    perPage,
    search: search || undefined,
    status: status || undefined,
    portageId: portageId || undefined,
    officeId: officeId || undefined,
    sortBy,
    sortOrder,
  });

  const hasActiveQuery = Boolean(
    search || status || portageId || officeId || sortBy
  );

  const currentPageIds = useMemo(
    () => consultants?.data.map((consultant) => consultant.id) ?? [],
    [consultants]
  );

  // Reset selection whenever the displayed page of data changes.
  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, perPage, search, status, portageId, officeId, sortBy, sortOrder]);

  const allCurrentSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.has(id));
  const someCurrentSelected =
    currentPageIds.some((id) => selectedIds.has(id)) && !allCurrentSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someCurrentSelected;
    }
  }, [someCurrentSelected, currentPageIds.length, selectedIds]);

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allCurrentSelected) {
        currentPageIds.forEach((id) => next.delete(id));
      } else {
        currentPageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderSortIcon = (column: ConsultantsSortBy) => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="size-3.5 text-[#98A2B3]" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="size-3.5 text-[#375DFB]" />
    ) : (
      <ArrowDown className="size-3.5 text-[#375DFB]" />
    );
  };

  const getStatusLabel = (status: ConsultantStatus) => {
    return status === 'active' ? 'Actif' : 'Inactif';
  };

  const getStatusBadge = (status: ConsultantStatus) => {
    const isActive = status === 'active';
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${roleConfig.className}`}
      >
        {roleConfig.label}
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

  const handleViewDetails = (consultantId: string) => {
    router.push(`/dashboard/consultants/${consultantId}`);
  };

  return (
    <>
      {consultantToEdit && (
        <EditConsultantDialog
          isOpen={!!consultantToEdit}
          onClose={() => setConsultantToEdit(null)}
          consultant={consultantToEdit}
        />
      )}

      {consultantToDelete && (
        <DeleteConsultantAlertDialog
          open={!!consultantToDelete}
          onClose={() => setConsultantToDelete(null)}
          consultant={consultantToDelete}
          page={page}
        />
      )}

      {isBulkEditOpen && (
        <BulkEditConsultantsDialog
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
          selectedIds={Array.from(selectedIds)}
          onSuccess={() => {
            setIsBulkEditOpen(false);
            clearSelection();
          }}
        />
      )}

      <div className="h-full overflow-y-auto">
        {isPending ? (
          <ConsultantsTableSkeleton />
        ) : isError ? (
          <div className="flex justify-center items-center text-center text-red-500 text-sm h-full">
            Une erreur est survenue lors du chargement des consultants.
          </div>
        ) : consultants && consultants.data.length > 0 ? (
          <>
            {selectedIds.size > 0 && (
              <div className="flex items-center justify-between gap-4 mb-3 px-4 py-3 rounded-[0.625rem] border border-[#E2E4E9] bg-[#F6F8FA]">
                <p className="text-sm font-medium text-[#101828]">
                  {selectedIds.size} sélectionné(s)
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-sm font-medium text-[#475467] hover:text-[#101828] cursor-pointer"
                  >
                    Désélectionner
                  </button>
                  <CustomButton
                    onClick={() => setIsBulkEditOpen(true)}
                    icon={<Pen className="flex-none size-4" />}
                  >
                    Modifier la sélection
                  </CustomButton>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="h-16">
                  <TableRow>
                    <TableHead className="text-[#475467] text-xs w-12">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        aria-label="Tout sélectionner sur cette page"
                        className="size-4 cursor-pointer accent-[#375DFB]"
                        checked={allCurrentSelected}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-40">
                      <button
                        type="button"
                        onClick={() => onSort('name')}
                        className="flex items-center gap-1 cursor-pointer hover:text-[#101828]"
                      >
                        Nom complet
                        {renderSortIcon('name')}
                      </button>
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-40">
                      Email
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-24">
                      Statut
                    </TableHead>
                    <TableHead className="text-[#475467] text-xs min-w-32">
                      <button
                        type="button"
                        onClick={() => onSort('startDate')}
                        className="flex items-center gap-1 cursor-pointer hover:text-[#101828]"
                      >
                        Date de début
                        {renderSortIcon('startDate')}
                      </button>
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
                  {consultants.data.map((consultant) => (
                    <TableRow
                      key={consultant.id}
                      className="hover:bg-gray-50 h-16"
                    >
                      <TableCell className="text-sm">
                        <input
                          type="checkbox"
                          aria-label={`Sélectionner ${consultant.firstname} ${consultant.lastname}`}
                          className="size-4 cursor-pointer accent-[#375DFB]"
                          checked={selectedIds.has(consultant.id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleSelectOne(consultant.id)}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-[#101828] font-medium">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(consultant.id)}
                          className="text-left hover:text-[#375DFB] hover:underline cursor-pointer"
                        >
                          {`${consultant.firstname} ${consultant.lastname}`}
                        </button>
                      </TableCell>
                      <TableCell className="text-sm text-[#475467]">
                        {consultant.email}
                      </TableCell>
                      <TableCell className="text-sm">
                        {getStatusBadge(consultant.status)}
                      </TableCell>
                      <TableCell className="text-sm text-[#475467]">
                        {formatDateToFR(consultant.startDate)}
                      </TableCell>
                      <TableCell className="text-sm text-[#475467]">
                        {consultant.endDate
                          ? formatDateToFR(consultant.endDate)
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-[#475467]">
                        {consultant.office}
                      </TableCell>
                      <TableCell className="text-sm text-[#475467]">
                        {consultant.portage}
                      </TableCell>
                      <TableCell className="text-sm">
                        {getRoleBadge(consultant.role)}
                      </TableCell>
                      <TableCell className="text-sm text-[#475467]">
                        {formatCurrency(consultant.monthlyEstimation)}
                      </TableCell>
                      <TableCell className="text-sm text-[#475467]">
                        {formatPerformance(consultant.performance)}
                      </TableCell>
                      <TableCell className="text-sm text-[#475467]">
                        <div className="flex items-center gap-2">
                          <CustomButton
                            onClick={() => handleViewDetails(consultant.id)}
                            icon={<Eye className="flex-none size-4" />}
                          >
                            Voir
                          </CustomButton>
                          <CustomButton
                            aria-label="Modifier le consultant"
                            title="Modifier"
                            onClick={() => setConsultantToEdit(consultant)}
                            className="bg-white border border-gray-200 shadow-none text-[#475467] hover:bg-gray-100 px-2.5"
                            icon={<Pen className="flex-none size-4" />}
                          >
                            <span className="sr-only">Modifier</span>
                          </CustomButton>
                          <CustomButton
                            aria-label="Supprimer le consultant"
                            title="Supprimer"
                            onClick={() => setConsultantToDelete(consultant)}
                            className="bg-white border border-gray-200 shadow-none text-red-600 hover:bg-red-50 px-2.5"
                            icon={<Trash className="flex-none size-4" />}
                          >
                            <span className="sr-only">Supprimer</span>
                          </CustomButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <ConsultantsTablePaginationControls
              currentPage={consultants.page}
              totalCount={consultants.total}
              perPage={consultants.perPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : hasActiveQuery ? (
          <div className="h-full flex flex-col justify-center items-center gap-0.5">
            <p className="font-semibold text-center text-2xl text-[#101828]">
              Aucun résultat
            </p>
            <p className="text-center text-sm text-[#525866] font-medium">
              Aucun consultant ne correspond à votre recherche ou à vos filtres.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center gap-0.5">
            <p className="font-semibold text-center text-2xl text-[#101828]">
              Pas encore de consultants
            </p>
            <p className="text-center text-sm text-[#525866] font-medium">
              Aucun consultant n&apos;a encore été ajouté
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultantsTable;
