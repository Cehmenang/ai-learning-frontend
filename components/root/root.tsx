import { ReactNode } from "react";
import { cookies } from "next/headers";
import SidebarMobileWrapper from "../sidebar/sidebarMobileWrapper";
import { getUserInfo } from "@/action/user";

export default async function Root({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  let user = null
  token && ( user = await getUserInfo(token!) )

  return (
    <div className="flex bg-[#080810] overflow-hidden h-dvh">
      <SidebarMobileWrapper user={user}/>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}