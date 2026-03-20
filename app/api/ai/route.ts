import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.NEXT_PUBLIC_GROQ_KEY
})

export async function POST(req: Request){
    try{
        const { prompt } = await req.json()
        const response = await streamText({
            model: groq('llama-3.3-70b-versatile'),
            messages: [{ role: 'user', content: prompt }]
        }) 
        const data = response.toTextStreamResponse()
        return data
    }catch(err){ console.log(err) }
}