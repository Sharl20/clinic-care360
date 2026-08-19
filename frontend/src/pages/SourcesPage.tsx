import { AlertCircle, ArrowUpRight, Database, LoaderCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Source } from "../types/api";

export function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string>();
  useEffect(() => { api.sources().then(setSources).catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load source registry.")).finally(() => setLoading(false)); }, []);
  return (
    <main className="container-page py-12 sm:py-16 animate-cube-in">
      <p className="eyebrow">Transparent retrieval</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Evidence source registry</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">CARE360 exposes its initial official-source registry. The bundled evidence briefs are concise, original summaries linked to the listed public material—not copied pages[cite: 7].</p>
      <div className="mt-8 flex gap-3.5 rounded-3xl border border-teal-100 bg-teal-50/50 p-5 text-sm text-teal-900 shadow-sm"><ShieldCheck className="shrink-0 text-teal-700 mt-0.5" size={22} /><p>Source cards in chat appear only for evidence retrieved for that answer. Check the official link for the complete and most current material[cite: 7].</p></div>
      {loading && <div className="mt-12 flex items-center gap-3 text-slate-600 font-medium"><LoaderCircle className="animate-spin text-teal-600" /> Loading registry…</div>}
      {error && <div className="mt-12 flex gap-3 rounded-2xl bg-red-50 p-4 text-red-800 border border-red-200"><AlertCircle /> {error}</div>}
      {!loading && !error && (
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {sources.map((source) => (
            <article key={source.source_id} className="surface p-6 hover:border-teal-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-teal-700">{source.topic.replace(/_/g, " ")}</p>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">{source.title}</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">{source.organization}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${source.status === "indexed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"}`}>{source.status}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-3.5 text-xs text-slate-500">
                <span>Language: <b className="text-slate-800">{source.language}</b></span>
                <span>Type: <b className="text-slate-800">{source.source_type.replace(/_/g, " ")}</b></span>
                {source.ingestion_timestamp && <span className="col-span-2">Indexed: {new Date(source.ingestion_timestamp).toLocaleDateString()}</span>}
              </div>
              <a href={source.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition">Open official source <ArrowUpRight size={16} /></a>
            </article>
          ))}
        </div>
      )}
      <div className="mt-12 flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 shadow-sm">
        <Database className="mt-1 shrink-0 text-teal-600" size={22} />
        <p>Content hashes are validated before indexing. You can add authorized local files from the chat panel; they are tagged as user-supplied evidence[cite: 7].</p>
      </div>
    </main>
  );
}