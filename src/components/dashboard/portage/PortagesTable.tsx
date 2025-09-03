"use client";

import React from 'react';
import useGetPortages from "@/hooks/portage/useGetPortages";
import PortagesTableSkeleton from "@/components/dashboard/portage/PortagesTableSkeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

const PortagesTable = () => {

    const {
        isPending,
        isError,
        data: portages
    } = useGetPortages();

    const formatWhatsAppNumber = (whatsApp: string) => {
        // Format the WhatsApp number for better display
        return whatsApp.replace(/(\+\d{2})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            {
                isPending ? (
                    <PortagesTableSkeleton/>
                ) : isError ? (
                    <div className="flex justify-center items-center text-center text-red-500 text-sm h-full">
                        Une erreur est survenue lors du chargement des portages.
                    </div>
                ) : portages && portages.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="h-16">
                                <TableRow>
                                    <TableHead className="text-[#475467] text-xs min-w-40">Nom</TableHead>
                                    <TableHead className="text-[#475467] text-xs min-w-60">URL</TableHead>
                                    <TableHead className="text-[#475467] text-xs min-w-40">WhatsApp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {portages.map((portage) => (
                                    <TableRow
                                        key={portage.id}
                                        className="cursor-pointer hover:bg-gray-50 h-16"
                                    >
                                        <TableCell className="text-sm text-[#101828] font-medium">
                                            {portage.name}
                                        </TableCell>
                                        <TableCell className="text-sm text-[#475467]">
                                            {isValidUrl(portage.url) ? (
                                                <a
                                                    href={portage.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {portage.url}
                                                </a>
                                            ) : (
                                                <span>{portage.url}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-[#475467]">
                                            <a
                                                href={`https://wa.me/${portage.whatsApp.replace(/\s+/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:text-green-800 hover:underline"
                                            >
                                                {formatWhatsAppNumber(portage.whatsApp)}
                                            </a>
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
                )
            }
        </div>
    );
};

export default PortagesTable;
