import React, {useState} from 'react';
import useGetConsultants from "@/hooks/consultant/useGetConsultants";
import ConsultantsTableSkeleton from "@/components/dashboard/consultant/ConsultantsTableSkeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ConsultantRole} from "@/types/consultant/ConsultantRole";
import {ConsultantStatus} from "@/types/consultant/ConsultantStatus";
import {formatDateToFR} from "@/utils/helpers/formatDateToFR";
import ConsultantsTablePaginationControls from "@/components/dashboard/consultant/ConsultantsTablePaginationControls";

interface ConsultantsTableProps {
    page?: number;
    setPage?: (page: number) => void;
}

const ConsultantsTable = ({
                              page = 1,
                              setPage = () => {
                              }
                          }: ConsultantsTableProps) => {

    const {
        isPending,
        isError,
        data: consultants
    } = useGetConsultants({
        page
    });


    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };


    const getStatusLabel = (status: ConsultantStatus) => {
        return status === 'active' ? 'Actif' : 'Inactif';
    };

    const getStatusBadge = (status: ConsultantStatus) => {
        const isActive = status === 'active';
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isActive
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
                {getStatusLabel(status)}
            </span>
        );
    };

    const getRoleLabel = (role: ConsultantRole) => {
        switch (role) {
            case ConsultantRole.AMBASSADOR:
                return 'Ambassadeur';
            case ConsultantRole.INFLUENCER:
                return 'Influenceur';
            case ConsultantRole.ELITE:
                return 'Élite';
            case ConsultantRole.NONE:
                return 'Aucun';
            default:
                return role;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const formatPerformance = (value: number | null) => {
        if (value === null || value === undefined) {
            return 'N/A';
        }
        return `${value}`;
    };

    return (
        <div className="overflow-hidden h-full">
            {
                isPending ? (
                    <ConsultantsTableSkeleton/>
                ) : isError ? (
                    <div className="flex justify-center items-center text-center text-red-500 text-sm h-full">
                        Une erreur est survenue lors du chargement des consultants.
                    </div>
                ) : consultants && consultants.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="h-16">
                                    <TableRow>
                                        <TableHead className="text-[#475467] text-xs min-w-40">Nom complet</TableHead>
                                        <TableHead className="text-[#475467] text-xs min-w-40">Email</TableHead>
                                        <TableHead className="text-[#475467] text-xs min-w-24">Statut</TableHead>
                                        <TableHead className="text-[#475467] text-xs min-w-32">Date de début</TableHead>
                                        <TableHead className="text-[#475467] text-xs min-w-32">Date de fin</TableHead>
                                        <TableHead className="text-[#475467] text-xs min-w-32">Bureau</TableHead>
                                        <TableHead className="text-[#475467] text-xs min-w-40">Société de
                                            portage</TableHead>
                                        <TableHead className="text-[#475467] text-xs min-w-28">Rôle</TableHead>
                                        <TableHead className="text-[#475467] text-xs min-w-32">Estimation
                                            mensuelle</TableHead>
                                        <TableHead className="text-[#475467] text-xs min-w-28">Performance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {consultants.data.map((consultant) => (
                                        <TableRow
                                            key={consultant.id}
                                            className="cursor-pointer hover:bg-gray-50 h-16"
                                        >
                                            <TableCell className="text-sm text-[#101828] font-medium">
                                                {`${consultant.firstname} ${consultant.lastname}`}
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
                                                {formatDateToFR(consultant.endDate)}
                                            </TableCell>
                                            <TableCell className="text-sm text-[#475467]">
                                                {consultant.office}
                                            </TableCell>
                                            <TableCell className="text-sm text-[#475467]">
                                                {consultant.portage}
                                            </TableCell>
                                            <TableCell className="text-sm text-[#475467]">
                                                {getRoleLabel(consultant.role)}
                                            </TableCell>
                                            <TableCell className="text-sm text-[#475467]">
                                                {formatCurrency(consultant.monthlyEstimation)}
                                            </TableCell>
                                            <TableCell className="text-sm text-[#475467]">
                                                {formatPerformance(consultant.performance)}
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
                ) : (
                    <div className="h-full flex flex-col justify-center items-center gap-0.5">
                        <p className="font-semibold text-center text-2xl text-[#101828]">
                            Pas encore de consultants
                        </p>
                        <p className="text-center text-sm text-[#525866] font-medium">
                            Aucun consultant n&apos;a encore été ajouté
                        </p>
                    </div>
                )
            }
        </div>
    );
};

export default ConsultantsTable;