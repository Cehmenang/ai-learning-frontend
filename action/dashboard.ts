"use server"

import { cookies } from "next/headers"

export async function getAllCount(){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/document/count`,
        { method: 'GET', headers: { "Cookie": `access_token=${cookieStore.get('access_token')}` } }
    )
    return await response.json()
}