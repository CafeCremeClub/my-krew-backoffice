"use client";

import React from 'react';
import {usePathname} from "next/navigation";
import {clsx} from "clsx";

const CustomLinearGradientBox = () => {

    const pathname = usePathname();
    const isDashboard = pathname === "/dashboard"

    return (
        <div
            className={clsx(
                "absolute blur-lg custom-linear-gradient w-full opacity-30 z-0 inset-0",
                isDashboard ? "h-[15.5rem]" : "h-[12rem]"
            )}
        />
    );
};

export default CustomLinearGradientBox;