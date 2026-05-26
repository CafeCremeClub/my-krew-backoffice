'use client';

import React from 'react';
import { Search } from 'lucide-react';
import CustomInput from '@/components/custom/CustomInput';
import CustomSelect from '@/components/custom/CustomSelect';
import useGetPortages from '@/hooks/portage/useGetPortages';
import useGetOffices from '@/hooks/office/useGetOffices';

export const ALL_VALUE = 'all';

export interface ConsultantsFiltersValue {
  search: string;
  status: string;
  portageId: string;
  officeId: string;
  perPage: number;
}

interface ConsultantsFiltersProps {
  value: ConsultantsFiltersValue;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onPortageChange: (portageId: string) => void;
  onOfficeChange: (officeId: string) => void;
  onPerPageChange: (perPage: number) => void;
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

const ConsultantsFilters = ({
  value,
  onSearchChange,
  onStatusChange,
  onPortageChange,
  onOfficeChange,
  onPerPageChange,
}: ConsultantsFiltersProps) => {
  const { data: portagesData } = useGetPortages();
  const { data: officesData } = useGetOffices();

  const portageOptions = [
    { label: 'Toutes les sociétés de portage', value: ALL_VALUE },
    ...(portagesData?.map((p) => ({ label: p.name, value: p.id })) || []),
  ];

  const officeOptions = [
    { label: 'Tous les LLP', value: ALL_VALUE },
    ...(officesData?.map((o) => ({ label: o.name, value: o.id })) || []),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-full sm:w-72">
        <CustomInput
          type="text"
          placeholder="Rechercher par nom ou email"
          value={value.search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="text-[#868C98]" size={16} />}
        />
      </div>

      <CustomSelect
        value={value.status || ALL_VALUE}
        onChange={onStatusChange}
        placeholder="Statut"
        options={[
          { label: 'Tous les statuts', value: ALL_VALUE },
          { label: 'Actif', value: 'active' },
          { label: 'Inactif', value: 'inactive' },
        ]}
        className="w-full sm:w-44"
      />

      <CustomSelect
        value={value.portageId || ALL_VALUE}
        onChange={onPortageChange}
        placeholder="Société de portage"
        options={portageOptions}
        className="w-full sm:w-56"
      />

      <CustomSelect
        value={value.officeId || ALL_VALUE}
        onChange={onOfficeChange}
        placeholder="LLP"
        options={officeOptions}
        className="w-full sm:w-44"
      />

      <CustomSelect
        value={String(value.perPage)}
        onChange={(v) => onPerPageChange(Number(v))}
        placeholder="Par page"
        options={PER_PAGE_OPTIONS.map((n) => ({
          label: `${n} / page`,
          value: String(n),
        }))}
        className="w-full sm:w-32"
      />
    </div>
  );
};

export default ConsultantsFilters;
