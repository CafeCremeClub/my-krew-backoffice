import React from 'react';
import ReferralsPageHeader from '@/components/dashboard/referral/ReferralsPageHeader';
import ReferralsTable from '@/components/dashboard/referral/ReferralsTable';

const ReferralsPage = () => {

    return (
        <div
            className="flex flex-col p-8 gap-10 h-full overflow-hidden"
        >
            <ReferralsPageHeader />
            <ReferralsTable/>
        </div>
    );
};

export default ReferralsPage;