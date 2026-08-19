import { useState } from "react";
import { TopNav, type Page } from "./components/TopNav";
import { ChatPage } from "./pages/ChatPage";
import { HomePage } from "./pages/HomePage";
import { SafetyPage } from "./pages/SafetyPage";
import { SourcesPage } from "./pages/SourcesPage";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [initialPrompt, setInitialPrompt] = useState<string>();
  
  const startChat = (prompt?: string) => { 
    setInitialPrompt(prompt); 
    setPage("chat"); 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* شريط التنقل العلوي */}
      <TopNav page={page} setPage={setPage} />

      {/* محتوى الصفحات مع تأثيرات الحركة Cube-in / Zipper */}
      <div className="flex-1 animate-cube-in">
        {page === "home" && <HomePage startChat={startChat} />}
        {page === "chat" && <ChatPage initialPrompt={initialPrompt} />}
        {page === "sources" && <SourcesPage />}
        {page === "safety" && <SafetyPage />}
      </div>

      {/* الفوتر الاحترافي */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 shadow-sm">
        <div className="container-page flex flex-col justify-between gap-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} CARE360 · Evidence-Grounded Health Intelligence System</p>
          <p className="font-medium text-teal-700">Not a diagnostic service. For medical emergencies, contact local services immediately.</p>
        </div>
      </footer>
    </div>
  );
}