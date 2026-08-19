import { Check, Clipboard, CornerDownLeft, MessageCirclePlus, PanelLeft, RotateCcw, Send, ThumbsDown, ThumbsUp, Mic, ExternalLink } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { EmergencyCard } from "../components/EmergencyCard";
import { FileUploader } from "../components/FileUploader";
import { api } from "../lib/api";
import type { ChatMessage } from "../types/api";

const prompts = ["What are warning signs of a stroke?", "How does physical activity support health?", "ما علامات السكتة الدماغية؟"];
const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

export function ChatPage({ initialPrompt }: { initialPrompt?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialPrompt ? [{ id: "welcome", role: "assistant", body: "Welcome to CARE360. I can share general health information grounded in the sources shown below each answer." }] : [{ id: "welcome", role: "assistant", body: "Welcome to CARE360. Ask a health-information question in English or العربية. I will show the evidence I use." }]);
  const [draft, setDraft] = useState(initialPrompt ?? "");
  const [conversationId, setConversationId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState<string>();
  
  // حالة الاستماع الصوتي للميكروفون
  const [isListening, setIsListening] = useState(false);

  const recent = useMemo(() => messages.filter((item) => item.role === "user").slice(-5).reverse(), [messages]);

  // دالة تشغيل وإيقاف الميكروفون
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Your browser does not support voice input. Please try using Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG'; 
    recognition.interimResults = true;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setDraft(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  async function send(value = draft) {
    const question = value.trim();
    if (!question || loading) return;
    setDraft(""); setError(undefined); setLoading(true);
    const user: ChatMessage = { id: crypto.randomUUID(), role: "user", body: question };
    setMessages((current) => [...current, user]);
    try {
      const reply = await api.chat(question, conversationId);
      setConversationId(reply.conversation_id);
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", body: reply.answer, reply }]);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to reach CARE360 right now."); }
    finally { setLoading(false); }
  }

  function newConversation() { setMessages([{ id: crypto.randomUUID(), role: "assistant", body: "New conversation started. What would you like to learn about?" }]); setConversationId(undefined); setError(undefined); setSidebarOpen(false); }
  function submit(event: FormEvent) { event.preventDefault(); void send(); }
  async function copy(id: string, text: string) { await navigator.clipboard?.writeText(text); setCopied(id); window.setTimeout(() => setCopied(undefined), 1800); }

  return (
    <main className="container-page py-6 sm:py-8">
      <div className="surface flex min-h-[calc(100vh-9rem)] overflow-hidden animate-cube-in">
        {/* السايدبار */}
        <aside className={`${sidebarOpen ? "absolute inset-y-0 left-0 z-30 flex animate-zipper" : "hidden"} w-80 shrink-0 flex-col border-r border-teal-100 bg-white p-5 lg:static lg:flex shadow-2xl lg:shadow-none`}>
          <button onClick={newConversation} className="button-primary w-full shadow-md"><MessageCirclePlus size={18} /> New conversation</button>
          <div className="mt-8">
            <p className="px-2 text-xs font-extrabold uppercase tracking-wider text-teal-600">This session</p>
            <div className="mt-3 space-y-1.5">
              {recent.length ? recent.map((item) => <button key={item.id} onClick={() => { setDraft(item.body); setSidebarOpen(false); }} className="block w-full truncate rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-900">{item.body}</button>) : <p className="px-2 py-3 text-sm text-slate-400">Your recent questions appear here for this browser session.</p>}
            </div>
          </div>
          <div className="mt-auto border-t border-slate-100 pt-5">
            <FileUploader />
            <p className="mt-3 text-xs leading-5 text-slate-400">Only upload documents you are authorized to use. Avoid personal medical records.</p>
          </div>
        </aside>

        {/* قسم المحادثة */}
        <section className="flex min-w-0 flex-1 flex-col bg-[#fafcfc]">
          <header className="flex items-center gap-3 border-b border-teal-100/60 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
            <button className="rounded-xl p-2.5 hover:bg-teal-50 text-teal-700 lg:hidden transition" aria-label="Open conversation panel" onClick={() => setSidebarOpen(!sidebarOpen)}><PanelLeft size={20} /></button>
            <div>
              <h1 className="font-extrabold text-slate-800 text-lg">Health Information Intelligence</h1>
              <p className="text-xs font-medium text-teal-600">Evidence-grounded · Verified clinical safety boundaries</p>
            </div>
          </header>

          <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-8">
            {messages.map((message, index) => (
              <div key={message.id} className={`animate-zipper ${message.role === "user" ? "ml-auto max-w-2xl" : "max-w-3xl"}`}>
                <div dir={isArabic(message.body) ? "rtl" : "ltr"} className={message.role === "user" ? "rounded-3xl rounded-br-sm bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-4 text-sm leading-7 text-white shadow-md shadow-teal-900/10 font-medium" : "rounded-3xl rounded-bl-sm border border-teal-100 bg-white px-5 py-5 text-sm leading-7 text-slate-800 shadow-sm"}>
                  {message.reply && message.reply.risk_level === "urgent" && (
                    <div className="mb-4">
                      <EmergencyCard arabic={isArabic(message.body)} />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.body}</div>
                  
                  {/* أزرار المصادر التفاعلية (تظهر مباشرة أسفل الإجابة بشكل أنيق ومضغوط) */}
                  {message.reply && message.reply.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Sources:</span>
                      {message.reply.sources.map((source, idx) => (
                        <a
                          key={source.source_id}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/80 px-3 py-1 text-xs font-semibold text-teal-800 transition hover:bg-teal-600 hover:text-white hover:border-teal-600 shadow-xs"
                          title={source.title}
                        >
                          <span className="w-4 h-4 rounded-full bg-teal-200 text-teal-900 flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                          <span className="max-w-[150px] truncate">{source.title}</span>
                          <ExternalLink size={12} className="opacity-70" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === "assistant" && index > 0 && (
                  <div className="mt-2.5 flex gap-1.5">
                    <button onClick={() => void copy(message.id, message.body)} className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-teal-700 hover:shadow-sm transition" aria-label="Copy answer">{copied === message.id ? <Check size={16} className="text-emerald-600" /> : <Clipboard size={16} />}</button>
                    <button onClick={() => { const previous = messages[index - 1]; if (previous?.role === "user") void send(previous.body); }} className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-teal-700 hover:shadow-sm transition" aria-label="Retry answer"><RotateCcw size={16} /></button>
                    <button className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-teal-700 hover:shadow-sm transition" aria-label="Helpful"><ThumbsUp size={16} /></button>
                    <button className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-teal-700 hover:shadow-sm transition" aria-label="Not helpful"><ThumbsDown size={16} /></button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="max-w-xs rounded-3xl rounded-bl-sm border border-teal-100 bg-white px-5 py-4 shadow-sm animate-zipper">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-500" />
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-500 [animation-delay:150ms]" />
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-500 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 animate-cube-in">{error}</div>}
          </div>

          <div className="border-t border-teal-100/60 bg-white/90 backdrop-blur-md p-4 sm:p-6">
            <div className="mb-3 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button key={prompt} onClick={() => void send(prompt)} className="rounded-full border border-teal-100 bg-teal-50/40 px-3.5 py-1.5 text-xs font-bold text-teal-900 transition hover:bg-teal-100/60 hover:border-teal-300">
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="flex items-end gap-3 rounded-3xl border border-teal-200 bg-white p-2.5 shadow-sm transition-all focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
              <button 
                type="button"
                onClick={toggleListening}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${isListening ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}
                title={isListening ? "Listening..." : "Use Microphone"}
              >
                <Mic size={19} />
              </button>

              <textarea 
                rows={2} 
                value={draft} 
                onChange={(event) => setDraft(event.target.value)} 
                placeholder={isListening ? "Listening now... Speak clearly!" : "Ask a general health question or describe symptoms…"} 
                className="min-h-12 flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400" 
                maxLength={4000} 
              />
              <button disabled={!draft.trim() || loading} className="button-primary h-12 w-12 rounded-2xl p-0 shrink-0" aria-label="Send question"><Send size={18} /></button>
            </form>

            <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <CornerDownLeft size={13} className="text-teal-600" /> Press Enter for a new line; use Send when ready. For emergencies, call local services.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}