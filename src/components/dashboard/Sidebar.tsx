import React, {useEffect, useState} from 'react';
import {routes} from "@/utils/routes";
import Image from "next/image";
import {defaultUserImage} from "../../../public";
import {usePathname, useRouter} from "next/navigation";
import useGetMe from "@/hooks/auth/useGetMe";
import CustomButton from "@/components/custom/CustomButton";
import {logout} from "@/app/actions/logout";
import {useQueryClient} from "@tanstack/react-query";
import {LogOut} from "lucide-react";

const Sidebar = () => {

    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();

    const [selectedRoute, setSelectedRoute] = useState<string>(routes[0].routeName);

    const onRoutePress = (routeName: string) => {
        setSelectedRoute(routeName)
        router.push(routeName);
    }

    const {
        isPending,
        data
    } = useGetMe();


    const handleLogout = async () => {
        await logout();
        queryClient.clear();
        router.replace("/auth/signin");
    }

    useEffect(() => {
        const currentRoute = routes.find(route => route.routeName === pathname);
        if (currentRoute) {
            setSelectedRoute(currentRoute.routeName);
        } else {
            setSelectedRoute(routes[0].routeName);
        }
    }, [pathname])

    return (
        <div
            className="relative flex flex-col flex-none px-4 py-8 bg-white h-screen w-[17rem] border-e border-e-[#EAECF0] shadow-lg">
            <div className="flex justify-center w-full mb-4">
                My Krew
            </div>
            <hr/>
            <div className="flex flex-col gap-1.5 h-full pt-4">
                {
                    routes.map((route, index) => (
                        <button
                            key={index}
                            className={`flex items-center gap-4 w-full py-2.5 px-4 text-black text-sm font-semibold cursor-pointer hover:bg-[#F9FAFB] ${
                                selectedRoute === route.routeName ? "bg-[#F9FAFB]" : ""
                            }`}
                            onClick={() => onRoutePress(route.routeName)}
                        >
                            <route.icon className="w-4 h-4"/>
                            {route.name}
                        </button>
                    ))
                }

                <div className="mt-auto flex flex-col gap-2.5">
                    <div
                        className="flex gap-4 items-center px-4"
                    >
                        <Image
                            src={defaultUserImage}
                            alt="user image"
                            width={40}
                            height={40}
                            className="rounded-full object-cover object-center"
                        />
                        {
                            isPending ?
                                <div
                                    className="h-8 rounded w-28 bg-gray-200 animate-pulse"
                                /> :
                                data && data.firstname && data.lastname ?
                                    <p className="text-sm font-medium leading-6">
                                        Hello, <b className="font-semibold">{data.firstname} {data.lastname}</b>
                                    </p> : null
                        }
                    </div>
                    <CustomButton
                        onClick={handleLogout}
                        icon={<LogOut className="size-5"/>}
                    >
                        Déconnexion
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;