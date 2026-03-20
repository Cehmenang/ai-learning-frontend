"use server"

import Main from "@/components/dashboard/Main";
import { cookies } from "next/headers";

export default async function App(){
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  return (
    <>
      {token && <Main token={token}/>}
    </>
  )
}