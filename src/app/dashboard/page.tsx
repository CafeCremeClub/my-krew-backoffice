"use client";

import React from 'react';
import useGetMe from "@/hooks/auth/useGetMe";
import CustomLinearGradientBox from "@/components/dashboard/CustomLinearGradientBox";

const DashboardPage = () => {

    const {
        isPending,
        data
    } = useGetMe();

    return (
        <div
            className="relative flex flex-col p-8 gap-10 h-full"
        >
            <div className="flex flex-col gap-4">
                {
                    isPending ?
                        <div
                            className="h-8 rounded w-28 bg-gray-200 animate-pulse"
                        /> :
                        data && data.firstname && data.lastname ?
                            <p className="leading-6">
                                Hello, <b className="font-semibold">{data.firstname} {data.lastname}</b>
                            </p> : null
                }
                <p className="leading-6">
                    Voici le détail des transactions de votre compte !
                </p>
            </div>
        </div>
    );
};

export default DashboardPage;