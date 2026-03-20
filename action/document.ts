import { Dispatch, SetStateAction } from "react"

export async function getDocumentsByUser(setDocuments: Dispatch<SetStateAction<any>>){
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/document`, {
        method: 'GET',
        credentials: 'include'
    })
    if(response.ok){
        const { documents } = await response.json()
        return setDocuments(documents)
    } else setDocuments([])
}

export async function getDocumentById(id: string, setDocument: Dispatch<SetStateAction<any>>){
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/document/${id}`, {
        method: 'GET',
        credentials: 'include'
    })
    if(response.ok){
        const { document } = await response.json()
        return setDocument(document)
    } else setDocument(null)
}

