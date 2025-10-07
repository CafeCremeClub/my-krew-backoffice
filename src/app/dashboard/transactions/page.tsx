import React from 'react';
import TransactionPageHeader from '@/components/dashboard/transaction/TransactionPageHeader';
import TransactionsTable from '@/components/dashboard/transaction/TransactionsTable';

const TransactionPage = () => {
  return (
    <div className="flex flex-col p-8 gap-10 h-full overflow-hidden">
      <TransactionPageHeader />
      <TransactionsTable />
    </div>
  );
};

export default TransactionPage;
