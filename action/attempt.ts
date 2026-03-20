export async function getAttemptsByQuiz(quizId: string){
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/attempt/quiz/${quizId}`,{
        method: 'GET',
        credentials: 'include'
    })
    const result = await response.json()
    return result
}

export async function getAttemptById(attemptId: string){
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/attempt/${attemptId}`, {
        method: 'GET',
        credentials: 'include'
    })
    return await response.json()
}