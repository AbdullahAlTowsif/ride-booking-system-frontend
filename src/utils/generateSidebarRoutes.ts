import type { ISidebarItem } from "@/types/index.types";


export const generateSidebarRoutes = (sidebarItems: ISidebarItem[]) => {
  return sidebarItems.flatMap((section) =>
    section.items.map((route) => ({
      path: route.url,
      Component: route.component,
    }))
  );
};
