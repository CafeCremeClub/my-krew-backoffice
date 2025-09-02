import {
    Users,
    Briefcase,
    Building
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
    }
];