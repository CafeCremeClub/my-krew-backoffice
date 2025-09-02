import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

const ConsultantsTableSkeleton = () => {
    // Create skeleton rows - typically 5-10 rows for a good skeleton effect
    const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

    return (
        <div className="overflow-hidden">
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
                            <TableHead className="text-[#475467] text-xs min-w-40">Société de portage</TableHead>
                            <TableHead className="text-[#475467] text-xs min-w-28">Rôle</TableHead>
                            <TableHead className="text-[#475467] text-xs min-w-32">Estimation mensuelle</TableHead>
                            <TableHead className="text-[#475467] text-xs min-w-28">Performance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {skeletonRows.map((index) => (
                            <TableRow key={index} className="h-16">
                                {/* Nom complet */}
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                                </TableCell>
                                {/* Email */}
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
                                </TableCell>
                                {/* Statut */}
                                <TableCell>
                                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                </TableCell>
                                {/* Date de début */}
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                </TableCell>
                                {/* Date de fin */}
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                </TableCell>
                                {/* Bureau */}
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                </TableCell>
                                {/* Société de portage */}
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
                                </TableCell>
                                {/* Rôle */}
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                </TableCell>
                                {/* Estimation mensuelle */}
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                </TableCell>
                                {/* Performance */}
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            {/* Pagination skeleton */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                </div>
            </div>
        </div>
    );
};

export default ConsultantsTableSkeleton;