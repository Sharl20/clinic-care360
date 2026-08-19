import { Activity, Apple, ArrowRight, BedDouble, Brain, Dumbbell, HeartPulse, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const topics = [
  [HeartPulse, "Heart health", "Learn about warning signs and cardiovascular wellbeing."],
  [Activity, "Blood pressure", "Evidence-led information on hypertension and monitoring."],
  [Apple, "Diabetes", "General education from trusted global health sources."],
  [Dumbbell, "Pain & posture", "Back, neck, ergonomics, and movement wellbeing."],
  [BedDouble, "Sleep & wellness", "Healthy routines that support daily wellbeing."],
  [Brain, "Digestive health", "Educational information on IBS and common topics."],
] as const;

export function HomePage({ startChat }: { startChat: (prompt?: string) => void }) {
  return (
    <main className="animate-cube-in">
      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
          <p className="eyebrow">Evidence before answers</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
            Your Evidence-Grounded <span className="text-teal-600">Health Assistant</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Get clear health information grounded in trusted medical sources. CARE360 makes its evidence visible, so you can explore everyday health questions with context—not guesswork.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="button-primary text-base" onClick={() => startChat()}>Start a conversation <ArrowRight size={19} /></button>
            <button className="button-secondary text-base" onClick={() => document.getElementById("topics")?.scrollIntoView({ behavior: "smooth" })}>Explore topics</button>
          </div>
          <p className="mt-6 max-w-xl text-xs leading-5 text-slate-400">CARE360 provides educational information only. It does not diagnose, prescribe personal doses, or replace a clinician or emergency services.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .5, delay: .1 }} className="surface overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-white to-teal-50/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Care signal</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">Helpful, transparent, careful.</h2>
            </div>
            <span className="rounded-2xl bg-teal-100/80 p-3 text-teal-700"><ShieldCheck size={32} /></span>
          </div>
          <div className="mt-7 space-y-4">
            <div className="rounded-2xl border border-teal-100/80 bg-white p-4 shadow-sm">
              <div className="flex gap-3.5">
                <Sparkles className="shrink-0 text-teal-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-slate-800">Grounded answers</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">Retrieved evidence informs every answer. If the evidence is not enough, CARE360 says so.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-teal-100/80 bg-white p-4 shadow-sm">
              <div className="flex gap-3.5">
                <Stethoscope className="shrink-0 text-teal-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-slate-800">Emergency-aware by design</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">Potential emergency signals receive a prominent, immediate safety message.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="topics" className="border-y border-teal-100 bg-white py-16">
        <div className="container-page">
          <p className="eyebrow">Start somewhere familiar</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Everyday health topics</h2>
            <button onClick={() => startChat()} className="text-sm font-bold text-teal-700 hover:text-teal-800 transition">Ask your own question →</button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map(([Icon, title, description]) => (
              <button key={title} onClick={() => startChat(`Tell me about ${title.toLowerCase()}.`)} className="surface group p-6 text-left transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                <span className="mt-5 inline-block text-sm font-bold text-teal-700 group-hover:translate-x-1 transition-transform">Explore →</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}