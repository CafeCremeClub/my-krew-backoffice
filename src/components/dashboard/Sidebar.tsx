import React, {useEffect, useState} from 'react';
import {routes} from "@/utils/routes";
import Image from "next/image";
import {userImage} from "../../../public";
import {usePathname, useRouter} from "next/navigation";

const Sidebar = () => {

    const router = useRouter();
    const pathname = usePathname();

    const [selectedRoute, setSelectedRoute] = useState<string>(routes[0].routeName);

    const onRoutePress = (routeName: string) => {
        setSelectedRoute(routeName)
        router.push(routeName);
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

                <div
                    className="mt-auto flex gap-4 items-center px-4 cursor-pointer"
                    onClick={() => router.push("/dashboard/profile")}
                >
                    <Image
                        src={userImage}
                        alt="user image"
                        width={40}
                        height={40}
                        className="rounded-full object-cover object-center"
                    />
                    <p className="text-sm font-medium">
                        Hello, Arthur
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;