import {
    Users,
    Briefcase,
    Building,
    ArrowLeftRight, Repeat
} from "lucide-react";

export const routes = [
    {
        id: 1,
        name: "Consultants",
        routeName: "/dashboard",
        icon: Users,
    },
    {
        id: 2,
        name: "Portage",
        routeName: "/dashboard/portage",
        icon: Briefcase,
    },
    {
        id: 3,
        name: "Office",
        routeName: "/dashboard/office",
        icon: Building,
    },
    {
        id: 4,
        name: "Transactions",
        routeName: "/dashboard/transactions",
        icon: ArrowLeftRight,
    },
    {
        id: 5,
        name: "Cooptation",
        routeName: "/dashboard/referrals",
        icon: Repeat,
    }
];