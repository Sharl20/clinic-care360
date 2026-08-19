import { AlertTriangle, BookOpenCheck, ShieldAlert, Stethoscope } from "lucide-react";
import { EmergencyCard } from "../components/EmergencyCard";

export function SafetyPage() {
  return (
    <main className="container-page py-12 sm:py-16 animate-cube-in">
      <p className="eyebrow">Safety, scope, and transparency</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Useful health information needs clear boundaries.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">CARE360 is a health-information assistant designed to help people understand trusted source material, not to replace professional judgement, emergency services, diagnosis, or individual treatment planning.</p>
      <div className="mt-10"><EmergencyCard /></div>
      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="surface p-7 hover:border-teal-300"><Stethoscope className="text-teal-600" size={28} /><h2 className="mt-4 text-lg font-bold text-slate-900">Not a doctor</h2><p className="mt-2 text-sm leading-6 text-slate-600">CARE360 cannot diagnose conditions, examine you, or prescribe individualized medication doses.</p></article>
        <article className="surface p-7 hover:border-teal-300"><BookOpenCheck className="text-teal-600" size={28} /><h2 className="mt-4 text-lg font-bold text-slate-900">Evidence shown</h2><p className="mt-2 text-sm leading-6 text-slate-600">Answers are intended to be grounded in retrieved source material, and their official links are displayed.</p></article>
        <article className="surface p-7 hover:border-teal-300"><ShieldAlert className="text-teal-600" size={28} /><h2 className="mt-4 text-lg font-bold text-slate-900">Emergency escalation</h2><p className="mt-2 text-sm leading-6 text-slate-600">Potential emergency patterns trigger a prominent deterministic warning before any LLM response.</p></article>
      </section>
      <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50/70 p-7 shadow-sm">
        <div className="flex gap-4">
          <AlertTriangle className="shrink-0 text-amber-600 mt-0.5" size={24} />
          <div>
            <h2 className="font-bold text-amber-950 text-lg">When to use professional care</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-amber-900/90">Seek urgent professional advice for severe, sudden, persistent, worsening, or worrying symptoms. If someone may be having a heart attack, stroke, severe bleeding, seizure, fainting episode, or serious breathing difficulty, contact local emergency services immediately.</p>
          </div>
        </div>
      </section>
    </main>
  );
}