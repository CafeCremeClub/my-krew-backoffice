'use client';

import React, { useState } from 'react';
import ConsultantsPageHeader from '@/components/dashboard/consultant/ConsultantsPageHeader';
import ConsultantsTable from '@/components/dashboard/consultant/ConsultantsTable';

const DashboardPage = () => {
  const [page, setPage] = useState<number>(1);

  return (
    <div className="flex flex-col p-8 gap-10 h-full overflow-hidden">
      <ConsultantsPageHeader page={page} />
      <ConsultantsTable page={page} setPage={setPage} />
    </div>
  );
};

export default DashboardPage;
