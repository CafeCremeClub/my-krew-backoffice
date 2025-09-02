"use client";

import React from 'react';
import ConsultantsPageHeader from "@/components/dashboard/consultant/ConsultantsPageHeader";
import ConsultantsTable from "@/components/dashboard/consultant/ConsultantsTable";

const DashboardPage = () => {
    return (
        <div
            className="flex flex-col p-8 gap-10 h-full"
        >
            <ConsultantsPageHeader/>
            <ConsultantsTable/>
        </div>
    );
};

export default DashboardPage;