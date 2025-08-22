import type { ComponentType } from "react";

export type TRole = "ADMIN" | "RIDER" | "DRIVER"

export interface ISidebarItem {
    title: string;
    items: {
        title: string;
        url: string;
        component: ComponentType
    }[];
}

