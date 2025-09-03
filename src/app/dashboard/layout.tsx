"use client";

import React, {useState} from 'react';
import SheetSidebar from "@/components/dashboard/SheetSidebar";
import Sidebar from "@/components/dashboard/Sidebar";
import CustomButton from "@/components/custom/CustomButton";
import {Menu} from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({children}: DashboardLayoutProps) => {

    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

    return (
        <>
            <SheetSidebar isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}/>
            <div className="flex flex-col h-screen bg-white overflow-hidden">
                <div className="block md:hidden p-1.5">
                    <CustomButton
                        onClick={() => setIsSheetOpen(true)}
                    >
                        <Menu/>
                    </CustomButton>
                </div>
                <div className="flex flex-1 h-full overflow-y-auto">
                    <div className="md:inline hidden">
                        <Sidebar/>
                    </div>
                    <main className="min-h-screen overflow-y-auto w-full scroll-hidden ">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default DashboardLayout;