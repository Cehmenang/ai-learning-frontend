"use server"

import { cookies } from "next/headers"

export async function getAttemptsByQuiz(quizId: string){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.SERVER}/attempt/quiz/${quizId}`,{
        method: 'GET',
        headers: { "Cookie": `access_token=${cookieStore.get('access_token')}` }
    })
    const result = await response.json()
    return result
}

export async function getAttemptById(attemptId: string){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.SERVER}/attempt/${attemptId}`, {
        method: 'GET',
        headers: { "Cookie": `access_token=${cookieStore.get('access_token')}` }
    })
    return await response.json()
}