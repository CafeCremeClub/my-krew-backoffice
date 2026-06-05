'use client';

import React, { useCallback, useState } from 'react';
import TransactionPageHeader from '@/components/dashboard/transaction/TransactionPageHeader';
import TransactionsTable from '@/components/dashboard/transaction/TransactionsTable';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { Transaction } from '@/types/transaction/Transaction';

const TransactionPage = () => {
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]);

  // Stable identity so the table's selection effect doesn't loop.
  const handleSelectionChange = useCallback((selected: Transaction[]) => {
    setSelectedTransactions(selected);
  }, []);

  return (
    <div className="flex flex-col p-8 gap-10 h-full overflow-hidden">
      <TransactionPageHeader
        exportSearch={debouncedSearch || undefined}
        selectedTransactions={selectedTransactions}
      />
      <TransactionsTable
        search={search}
        onSearchChange={setSearch}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default TransactionPage;
