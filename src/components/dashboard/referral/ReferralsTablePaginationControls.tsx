import React from 'react';
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink
} from "@/components/ui/pagination";
import {Button} from "@/components/ui/button";
import {ArrowLeft, ArrowRight} from "lucide-react";

interface ReferralsTablePaginationControlsProps {
    currentPage: number;
    totalCount: number;
    perPage: number;
    onPageChange: (page: number) => void;
}

const ReferralsTablePaginationControls = ({
                                            currentPage,
                                            totalCount,
                                            perPage,
                                            onPageChange
                                        }: ReferralsTablePaginationControlsProps) => {
    const totalPages = Math.ceil(totalCount / perPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show pages with ellipsis
            if (currentPage <= 3) {
                // Show first few pages
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Show last few pages
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Show pages around current page
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Don't render pagination if there's only one page or no data
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center mt-auto">
            <Pagination className="pt-6">
                <PaginationContent className="flex flex-col md:flex-row items-center justify-between w-full">
                    <PaginationItem>
                        <Button
                            variant="ghost"
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "text-[#475467]"}
                        >
                            <ArrowLeft/> Précédent
                        </Button>
                    </PaginationItem>

                    <div className="flex items-center gap-0.5">
                        {getPageNumbers().map((page, index) =>
                            page === "..." ? (
                                <PaginationItem key={index}>
                                    <PaginationEllipsis/>
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        isActive={page === currentPage}
                                        onClick={() => handlePageChange(Number(page))}
                                        className={`shadow-none border-none cursor-pointer ${
                                            page === currentPage ? "bg-[#F4F6FF] text-[#1D2939]" : "text-[#475467]"
                                        }`}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}
                    </div>

                    <PaginationItem>
                        <Button
                            variant="ghost"
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "text-[#475467]"}
                        >
                            Suivant <ArrowRight/>
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default ReferralsTablePaginationControls;
