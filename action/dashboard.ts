export async function getAllCount(){
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/document/count`,
        { method: 'GET', credentials: 'include' }
    )
    return await response.json()
}