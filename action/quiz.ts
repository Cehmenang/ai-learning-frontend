'use server'

import { cookies } from "next/headers"
import { Dispatch, SetStateAction } from "react"

export async function generateQuiz(id: string){
    const cookieStore = await cookies()
    await fetch(`${process.env.SERVER}/quiz/generate/${id}`, {
        method: 'GET',
        headers: { "Cookie": `access_token=${cookieStore.get('access_token')?.value}` }
    })
}

export async function getQuizzesByDocument(id: string){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.SERVER}/quiz/document/${id}`, {
        method: 'GET',
        headers: { "Cookie": `access_token=${cookieStore.get('access_token')?.value}` }
    })
    if(response.ok){
        const data = await response.json()
        return data.quizzes
    }else { return null }
}

export async function getQuizByDocument(documentId: string, id: string){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.SERVER}/quiz/${id}/document/${documentId}`, {
        method: 'GET',
        headers: { "Cookie": `access_token=${cookieStore.get('access_token')?.value}` }
    })
    const data = await response.json()
    return data
}

export async function createAttempt(questionsId: string[], optionsId: string[], score: number, quizId: string){
    try{
        const cookieStore = await cookies()
        const result = await fetch(`${process.env.SERVER}/quiz/${quizId}/attempt`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                "Cookie": `access_token=${cookieStore.get('access_token')?.value}`
             },
            body: JSON.stringify({
                questionsId,
                optionsId,
                score
            })
        })
        return await result.json()
    }catch(err){ console.log(err) }
}

export async function askQuestion(question: string, documentId: string){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.SERVER}/document/ask/${documentId}`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                "Cookie": `access_token=${cookieStore.get('access_token')?.value}`
            },
            body: JSON.stringify({ question })
    })
    return await response.json()
}