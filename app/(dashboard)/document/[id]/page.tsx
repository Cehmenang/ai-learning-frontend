"use client"
import { getDocumentById } from "@/action/document"
import { askQuestion, generateQuiz } from "@/action/quiz"
import { useEffect, useState, useRef } from "react"
import { Bot, Sparkles, Send, FileText } from "lucide-react"

interface IMessage {
    role: string
    content: string
}

function ConversationMapping({ messages }: { messages: IMessage[] }) {
    return (
        <>
            {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col gap-y-1 ${msg.role === "user" ? "items-end self-end" : "items-start"}`}>
                    <p className={`text-xs font-semibold px-3 py-0.5 rounded-full capitalize ${
                        msg.role === "user"
                            ? "bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/30"
                            : "bg-[#1e1e2e] text-[#4a4a6a] border border-[#2e2e4e]"
                    }`}>
                        {msg.role}
                    </p>
                    <p className={`text-sm leading-6 text-justify ${
                        msg.role === "user" ? "text-white" : "text-gray-300"
                    }`}>
                        {msg.content}
                    </p>
                </div>
            ))}
        </>
    )
}

export default function SingleDocument({ params }: { params: { id: string } }) {
    const [document, setDocument] = useState<any>(null)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<"preview" | "assistant">("preview")
    const conversationRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        (async function () {
            const { id } = await params
            const response = await getDocumentById(id)
            response && setDocument(response)
        })()
    }, [])

    useEffect(() => {
        if (conversationRef.current) {
            conversationRef.current.scrollTop = conversationRef.current.scrollHeight
        }
    }, [messages])

    async function handleQuestion(e: any) {
        e.preventDefault()
        const form = new FormData(e.target)
        const question = form.get('question')! as string
        if (!question.trim()) return
        e.target.reset()

        setLoading(true)
        const data = await askQuestion(question, document.id)
        const chat = await fetch('/api/ai', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: data.prompt })
        })

        const reader = await chat.body?.getReader()
        const decoder = new TextDecoder()

        setMessages((prev) => [
            ...prev,
            { role: 'user', content: question },
            { role: 'assistant', content: '' }
        ])
        setLoading(false)

        while (true) {
            const { done, value } = await reader!.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1]
                const otherMessages = prev.slice(0, -1)
                return [...otherMessages, { ...lastMessage, content: lastMessage.content + chunk }]
            })
        }
    }

    return (
        <div className="h-dvh w-full flex flex-col overflow-hidden">

            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex border-b border-[#1e1e2e] bg-[#080810] flex-shrink-0">
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                        activeTab === "preview"
                            ? "text-[#818cf8] border-b-2 border-[#6366f1]"
                            : "text-[#4a4a6a]"
                    }`}
                >
                    <FileText className="w-4 h-4" />
                    Preview
                </button>
                <button
                    onClick={() => setActiveTab("assistant")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                        activeTab === "assistant"
                            ? "text-[#818cf8] border-b-2 border-[#6366f1]"
                            : "text-[#4a4a6a]"
                    }`}
                >
                    <Bot className="w-4 h-4" />
                    Assistant
                    {messages.length > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#6366f1] text-white text-xs flex items-center justify-center">
                            {messages.filter(m => m.role === 'user').length}
                        </span>
                    )}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">

                {/* PDF Preview */}
                <div className={`
                    h-full border-r border-[#1e1e2e] overflow-hidden
                    ${activeTab === "preview" ? "flex" : "hidden"}
                    lg:flex lg:flex-1
                `}>
                    {document?.content ? (
                        <iframe
                            src={`${document.content}#view=FitH`}
                            width="100%"
                            height="100%"
                            title="PDF Preview"
                            style={{ border: 'none' }}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[#4a4a6a]">
                            <div className="text-center">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Memuat dokumen...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Assistant Panel */}
                <div className={`
                    flex flex-col bg-[#0a0a14]
                    ${activeTab === "assistant" ? "flex" : "hidden"}
                    lg:flex lg:w-[400px] lg:flex-shrink-0
                    w-full
                `}>
                    {/* Assistant Header */}
                    <div className="px-5 py-4 border-b border-[#1e1e2e] flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-[#6366f1]/15 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-[#818cf8]" />
                            </div>
                            <h1 className="font-bold text-lg tracking-tight text-white">Assistant</h1>
                        </div>
                        <button
                            className="flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full cursor-pointer font-semibold text-xs transition-all"
                            onClick={() => generateQuiz(document?.id)}
                        >
                            <Sparkles className="w-3 h-3" />
                            Generate Quiz
                        </button>
                    </div>

                    {/* Conversation */}
                    <div
                        ref={conversationRef}
                        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-y-6"
                    >
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                                <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center mb-3">
                                    <Bot className="w-6 h-6 text-[#6366f1]" />
                                </div>
                                <p className="text-[#4a4a6a] text-sm">Tanya apapun tentang dokumen ini</p>
                            </div>
                        ) : (
                            <ConversationMapping messages={messages} />
                        )}
                        {loading && (
                            <div className="flex items-center gap-2 text-[#4a4a6a] text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="px-4 py-4 border-t border-[#1e1e2e] flex-shrink-0">
                        <form onSubmit={handleQuestion} className="flex items-center gap-2">
                            <input
                                type="text"
                                name="question"
                                className="flex-1 bg-[#13131f] rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#6366f1]/50 text-sm placeholder:text-[#3a3a5a] text-white border border-[#1e1e2e]"
                                placeholder="Tanya sesuatu..."
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-9 h-9 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}