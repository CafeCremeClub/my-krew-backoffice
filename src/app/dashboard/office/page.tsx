import React from 'react';
import OfficePageHeader from "@/components/dashboard/office/OfficePageHeader";
import OfficesTable from "@/components/dashboard/office/OfficesTable";

const OfficePage = () => {
    return (
        <div
            className="flex flex-col p-8 gap-10 h-full overflow-hidden"
        >
            <OfficePageHeader/>
            <OfficesTable/>
        </div>
    );
};

export default OfficePage;