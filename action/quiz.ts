import { Dispatch, SetStateAction } from "react"

export async function generateQuiz(id: string){
    await fetch(`${process.env.NEXT_PUBLIC_SERVER}/quiz/generate/${id}`, {
        method: 'GET',
        credentials: 'include'
    })
}

export async function getQuizzesByDocument(id: string, setQuizzes: Dispatch<SetStateAction<any>>){
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/quiz/document/${id}`, {
        method: 'GET',
        credentials: 'include'
    })
    const data = await response.json()
    return setQuizzes(data.quizzes)
}

export async function getQuizByDocument(documentId: string, id: string){
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/quiz/${id}/document/${documentId}`, {
        method: 'GET',
        credentials: 'include'
    })
    const data = await response.json()
    return data
}

export async function createAttempt(questionsId: string[], optionsId: string[], score: number, quizId: string){
    try{
        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/quiz/${quizId}/attempt`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                questionsId,
                optionsId,
                score
            }),
            credentials: 'include'
        })
        return await result.json()
    }catch(err){ console.log(err) }
}