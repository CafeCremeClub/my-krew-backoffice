'use client';

import React, { useState } from 'react';
import ConsultantsPageHeader from '@/components/dashboard/consultant/ConsultantsPageHeader';
import ConsultantsTable from '@/components/dashboard/consultant/ConsultantsTable';
import ConsultantsFilters, {
  ALL_VALUE,
} from '@/components/dashboard/consultant/ConsultantsFilters';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import {
  ConsultantsSortBy,
  ConsultantsSortOrder,
} from '@/types/consultant/GetConsultantsParams';

const DashboardPage = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [portageId, setPortageId] = useState<string>('');
  const [officeId, setOfficeId] = useState<string>('');
  const [sortBy, setSortBy] = useState<ConsultantsSortBy | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<ConsultantsSortOrder>('asc');

  const debouncedSearch = useDebouncedValue(search, 400);

  // Reset to page 1 whenever a filter/search/sort changes.
  const resetToFirstPage = () => setPage(1);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetToFirstPage();
  };

  const handleFilterChange =
    (setter: (v: string) => void) => (value: string) => {
      setter(value === ALL_VALUE ? '' : value);
      resetToFirstPage();
    };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    resetToFirstPage();
  };

  const handleSort = (column: ConsultantsSortBy) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    resetToFirstPage();
  };

  return (
    <div className="flex flex-col p-8 gap-6 h-full overflow-hidden">
      <ConsultantsPageHeader page={page} />

      <ConsultantsFilters
        value={{ search, status, portageId, officeId, perPage }}
        onSearchChange={handleSearchChange}
        onStatusChange={handleFilterChange(setStatus)}
        onPortageChange={handleFilterChange(setPortageId)}
        onOfficeChange={handleFilterChange(setOfficeId)}
        onPerPageChange={handlePerPageChange}
      />

      <ConsultantsTable
        page={page}
        setPage={setPage}
        perPage={perPage}
        search={debouncedSearch}
        status={status}
        portageId={portageId}
        officeId={officeId}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    </div>
  );
};

export default DashboardPage;
