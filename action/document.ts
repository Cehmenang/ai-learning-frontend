"use server"

import { cookies } from "next/headers"
import { Dispatch, SetStateAction } from "react"

export async function getDocumentsByUser(){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.SERVER}/document`, {
        method: 'GET',
        headers: { "Cookie": `access_token=${cookieStore.get('access_token')?.value}` }
    })
    if(response.ok){
        const { documents } = await response.json()
        return documents
    } else return null
}

export async function getDocumentById(id: string){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.SERVER}/document/${id}`, {
        method: 'GET',
        headers: { "Cookie": `access_token=${cookieStore.get('access_token')?.value}` }
    })
    if(response.ok){
        const { document } = await response.json()
        return document
    } else null
}

export async function uploadDocument(form: any){
    try{
        const cookieStore = await cookies()
        await fetch(`${process.env.SERVER}/document/upload`, {
              method: "POST",
              body: form,
              headers: { "Cookie": `access_token=${cookieStore.get('access_token')?.value}` }
        });
        return true
    }catch(err){ console.log(err) }
}