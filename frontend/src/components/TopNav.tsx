import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "./BrandMark";

export type Page = "home" | "chat" | "sources" | "safety";

export function TopNav({ page, setPage }: { page: Page; setPage: (page: Page) => void }) {
  const [open, setOpen] = useState(false);
  const links: { id: Page; label: string }[] = [{ id: "home", label: "Home" }, { id: "sources", label: "Sources" }, { id: "safety", label: "Safety" }];
  const go = (destination: Page) => { setPage(destination); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur"><div className="container-page flex h-16 items-center justify-between"><button aria-label="CARE360 home" onClick={() => go("home")}><BrandMark /></button><nav className="hidden items-center gap-1 md:flex">{links.map((link) => <button key={link.id} onClick={() => go(link.id)} className={`rounded-lg px-3 py-2 text-sm font-medium ${page === link.id ? "bg-ocean-50 text-ocean-700" : "text-slate-600 hover:bg-slate-50"}`}>{link.label}</button>)}<button onClick={() => go("chat")} className="button-primary ml-3 py-2.5">Start chat</button></nav><button className="rounded-lg p-2 text-slate-700 md:hidden" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>{open && <nav className="border-t border-slate-100 bg-white px-5 py-3 md:hidden">{[...links, { id: "chat" as Page, label: "Start chat" }].map((link) => <button key={link.id} onClick={() => go(link.id)} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-ocean-50">{link.label}</button>)}</nav>}</header>;
}
