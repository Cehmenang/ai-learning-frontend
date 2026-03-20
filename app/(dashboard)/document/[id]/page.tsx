"use client"

import { getDocumentById } from "@/action/document"
import { askQuestion, generateQuiz } from "@/action/quiz"
import { useEffect, useState } from "react"

interface IMessage{
    role: string, content: string
}

function ConversationMapping({ messages }: { messages: IMessage[] }){
    return messages.map(msg=>{
        return (
            <div className={`parent-conversation ${msg.role == "user" && 'self-end'} flex flex-col gap-y-1`}>
                <p className="capitalize bg-gradient-to-tr from-gray-700 to-gray-900 px-4 py-1 rounded-full border-1 border-gray-600 font-semibold">{msg.role}</p>
                <p className="text-justify text-gray-300 leading-6">{msg.content}</p>
            </div>
        )
    })
}

export default function SingleDocument({ params }: { params: { id: string } }){
    const [document, setDocument] = useState<any>(null)
    const [messages, setMessages] = useState<IMessage[]>([])

    useEffect(()=>{
        (async function(){
            const {id} = await params
            const response = await getDocumentById(id)
            response && setDocument(response)
        })()
    }, [])

    async function handleQuestion(e: any){
        e.preventDefault()
        const form = new FormData(e.target) 
        const question = form.get('question')! as string
        
        const data = await askQuestion(question, document.id)

        const chat = await fetch('/api/ai', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: data.prompt
            })
        })

        const reader = await chat.body?.getReader()
        const decoder = new TextDecoder()

        setMessages((prev)=>
            [ ...prev, { role: 'user', content: question }, { role: 'assistant', content: '' } ])

        while(true){
            const { done, value } = await reader!.read()
            if(done) break
            const chunk = decoder.decode(value, { stream: true })

            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                const otherMessages = prev.slice(0, -1);
                return [
                        ...otherMessages,
                        { ...lastMessage, content: lastMessage.content + chunk }
                ];
            });
        }

        }

    return (
    <div className="h-dvh w-full box-border flex relative">
        <div className="preview h-[100vh] border-r overflow-hidden box-border absolute w-[690px]">
    <iframe
      src={`${document?.content}#view=FitH`}
      width="100%"
      height="100%"
      title="PDF Preview"
      style={{ border: 'none' }}
    />
        </div>

        <div className="assistant px-10 py-6 overflow-y-auto box-border absolute bottom-0 h-dvh right-0 bg-gray-900 w-[400px] flex flex-col gap-y-3">

            <div className="assistant-head flex justify-between">
                <h1 className="font-bold text-2xl tracking-tight">Assistant</h1>
                <button className="border-1 border-emerald-300 bg-gradient-to-tr from-emerald-500 to-emerald-800 px-4 py-1 rounded-full cursor-pointer font-bold text-[12px]" onClick={()=>generateQuiz(document.id)}>Generate Quiz</button>
            </div>

            <div className="border-b-1 border-gray-600"></div>
    
            <div className="conversation flex gap-y-8 flex-col h-full overflow-y-scroll">
        { messages.length > 0 && <ConversationMapping messages={messages}/> }
            </div>

            <form action="" onSubmit={handleQuestion}>
                <input type="text" name="question" className="bg-gray-800 rounded-4xl px-5 py-2 w-full focus:outline-none text-[12px] placeholder:text-gray-600 " placeholder="Ask Something ..."/>
            </form>
  </div>
</div>
    )
    }
