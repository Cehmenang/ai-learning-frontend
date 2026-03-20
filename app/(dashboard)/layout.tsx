import Root from "@/components/root/root";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }){
    return (
        <Root>
            {children}
        </Root>
    )
}