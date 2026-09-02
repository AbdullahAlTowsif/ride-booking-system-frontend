import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types/index.types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
    return function AuthWrapper () {
        const { data, isLoading, isError } = useUserInfoQuery(undefined);

        if (isLoading) return null;

        if (isError || !data?.data?.email) {
            return <Navigate to="/login" />
        }

        if (data?.data?.isBlock === "BLOCK") {
            return <Navigate to="/" />
        }

        if (requiredRole && requiredRole !== data?.data?.role) {
            return <Navigate to="/unauthorized" />;
        }
        return <Component />;
    }
}
