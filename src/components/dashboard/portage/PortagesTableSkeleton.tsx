import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";

const PortagesTableSkeleton = () => {
    // Create skeleton rows - typically 5-8 rows for a good skeleton effect
    const skeletonRows = Array.from({length: 6}, (_, index) => index);

    return (
        <div className="overflow-hidden">
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
                        {skeletonRows.map((index) => (
                            <TableRow key={index} className="h-16">
                                {/* Nom */}
                                <TableCell>
                                    <Skeleton className="h-4 w-32"/>
                                </TableCell>
                                {/* URL */}
                                <TableCell>
                                    <Skeleton className="h-4 w-48"/>
                                </TableCell>
                                {/* WhatsApp */}
                                <TableCell>
                                    <Skeleton className="h-4 w-36"/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default PortagesTableSkeleton;
