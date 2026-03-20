"use client"

export default function Ask(){

    async function askHandler(e: any){
        e.preventDefault()
        const form = new FormData(e.target)
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/document/ask`, {
            method: 'POST',
            body: JSON.stringify({ question: form.get('question') }),
            headers: { "Content-Type": 'application/json' },
            credentials: 'include'
        })
        const data = await response.json()
        console.log(data)
    }

    return (
        <div className="ask-ai">
            <form onSubmit={askHandler}>
                <input type="text" name="question"/>
                <button type="submit">Kirim!</button>
            </form>
        </div>
    )
}