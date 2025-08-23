import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { riderSidebarItems } from "@/routes/riderSidebarItems";
import type { TRole } from "@/types/index.types";

export const getSidebarItems = (userRole: TRole) => {
    switch (userRole) {
        case role.ADMIN:
            return [...adminSidebarItems]
        case role.RIDER:
            return [...riderSidebarItems]
        // case role.DRIVER:
        //     return [...userSidebarItems]
        default:
            return [];
    }
}
