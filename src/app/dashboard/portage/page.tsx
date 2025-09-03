import React from 'react';
import PortagePageHeader from "@/components/dashboard/portage/PortagePageHeader";
import PortagesTable from "@/components/dashboard/portage/PortagesTable";

const PortagePage = () => {
    return (
        <div
            className="flex flex-col p-8 gap-10 h-full overflow-hidden"
        >
            <PortagePageHeader/>
            <PortagesTable/>
        </div>
    );
};

export default PortagePage;