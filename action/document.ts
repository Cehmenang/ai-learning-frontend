"use server"

import { cookies } from "next/headers"
import { Dispatch, SetStateAction } from "react"

export async function getDocumentsByUser(setDocuments: Dispatch<SetStateAction<any>>){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/document`, {
        method: 'GET',
        headers: { "Cookie": `access_token=${cookieStore.get('access_token')}` }
    })
    if(response.ok){
        const { documents } = await response.json()
        return setDocuments(documents)
    } else setDocuments([])
}

export async function getDocumentById(id: string, setDocument: Dispatch<SetStateAction<any>>){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/document/${id}`, {
        method: 'GET',
        headers: { "Cookie": `access_token=${cookieStore.get('access_token')}` }
    })
    if(response.ok){
        const { document } = await response.json()
        return setDocument(document)
    } else setDocument(null)
}

export async function uploadDocument(form: any){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/document/upload`, {
          method: "POST",
          body: form,
          headers: { "Cookie": `access_token=${cookieStore.get('access_token')}` }
    });
    return await response
}