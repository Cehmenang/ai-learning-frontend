"use server"

import { CredentialResponse } from "@react-oauth/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginSubmitHandler(data: { username: string, password: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/user/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include'
    })

    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
        const token = setCookie.split('access_token=')[1]?.split(';')[0]
        const cookieStore = await cookies()
        cookieStore.set('access_token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 1000 * 3600
        })
    }

    return await response.json()
}

export async function googleLoginHandler(credential: CredentialResponse) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/user/google-login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
        credentials: 'include'
    })

    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
        const token = setCookie.split('access_token=')[1]?.split(';')[0]
        const cookieStore = await cookies()
        cookieStore.set('access_token', token, {
            httpOnly: true,
            path: '/',
        })
    }

    return await response.json()
}

export async function getUserInfo(token: string){
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/user/info`, {
      method: 'GET',
      headers: { "Cookie": `access_token=${token}` }
    })
    return await response.json()
}

export async function logoutHandler(){
    const cookieStore = await cookies()
    cookieStore.get('access_token') && cookieStore.delete('access_token')
    return redirect('/login')
}