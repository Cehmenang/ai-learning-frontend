"use client"

import { useState } from "react";
import Sidebar from "./side";
import { Menu } from "lucide-react";

export default function SidebarMobileWrapper({ user }: { user:{ username: string, email: string } }){
  const [mobileOpen, setMobileOpen] = useState(false);
    return(
        <>
         <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#0e0e16] border-b border-[#1e1e2e] flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#13131f] text-[#5a5a7a] hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-white" style={{ fontSize: "11px", fontWeight: 700 }}>S</span>
            </div>
            <span className="text-white" style={{ fontWeight: 600, fontSize: "15px" }}>
              StudyAI
            </span>
          </div>
        </header>

     <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={user}
      />
        </>
    ) 
}