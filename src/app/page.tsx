"use client";

import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    name: "Starter", price: 8, popular: false, cta: "Get Started",
    features: ["Telegram channel", "Any AI model (BYOK)", "Basic dashboard", "SOUL.md editor", "3 cron jobs", "Community support"],
  },
  {
    name: "Pro", price: 18, popular: true, cta: "Go Pro",
    features: ["Telegram + Discord", "All AI models (BYOK)", "Full SOUL.md + AGENTS.md editor", "All agent templates", "10 cron jobs", "5 skills/plugins", "Email support (48h)"],
  },
  {
    name: "Business", price: 38, popular: false, cta: "Go Business",
    features: ["Telegram + Discord + WhatsApp", "All AI models (BYOK)", "Full config editor", "All templates + custom", "Unlimited cron jobs", "Unlimited skills", "3 instances", "Custom domain", "Priority support (24h)"],
  },
];

const STEPS = [
  { step: "1", title: "Sign Up", desc: "Create your account with Google. Takes 10 seconds.", icon: "🔑" },
  { step: "2", title: "Configure", desc: "Pick your AI model, paste your API key, connect a channel.", icon: "⚙️" },
  { step: "3", title: "Deploy", desc: "We provision your server and start OpenClaw. Under 90 seconds.", icon: "🚀" },
  { step: "4", title: "Chat", desc: "Your AI assistant is live. Message it on Telegram, Discord, or WhatsApp.", icon: "💬" },
];

const FAQS = [
  { q: "What is OpenClaw?", a: "OpenClaw is the most popular open-source AI agent platform with 100K+ GitHub stars. It lets you run a personal AI assistant that connects to your messaging apps and works 24/7." },
  { q: "Do I need my own API key?", a: "Yes. EasyClaw uses BYOK (Bring Your Own Key). You provide an API key from Anthropic (Claude), OpenAI (GPT), or Google (Gemini). This keeps prices low and gives you full control." },
  { q: "How is this different from SimpleClaw?", a: "SimpleClaw only supports Telegram. EasyClaw launches with Telegram AND Discord from day 1, with WhatsApp coming soon. We also offer agent templates, a visual config editor, and skill plugins." },
  { q: "Can I use Claude, GPT, or Gemini?", a: "Yes. OpenClaw supports all major AI models. Pick your model and provide your own API key. Switch models anytime from your dashboard." },
  { q: "What happens if my instance goes down?", a: "We monitor every instance and auto-restart on crashes. Pro and Business plans include email/priority support. We target 99.5% uptime." },
  { q: "Can I customize my AI's personality?", a: "Absolutely. OpenClaw uses a SOUL.md file to define your agent's personality, tone, and behavior. Our dashboard includes a visual editor." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no commitments. Cancel from your dashboard and your instance runs until the end of your billing period." },
];

function FAQItem({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--card-border)]">
      <button className="w-full py-5 flex justify-between items-center text-left" onClick={() => setOpen(!open)}>
        <span className="font-medium text-lg">{item.q}</span>
        <span className="text-2xl text-[var(--muted)]">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="pb-5 text-[var(--muted)] leading-relaxed">{item.a}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--card-border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold">EasyClaw</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--muted)]">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
            <Link href="/setup-guide" className="hover:text-white transition">Setup Guide</Link>
          </div>
          <Link href="/api/auth/signin" className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Powered by OpenClaw — 100K+ GitHub Stars
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Deploy Your AI Assistant<br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">in 60 Seconds</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            One-click OpenClaw deployment. No servers, no SSH, no CLI. Get a personal AI assistant running 24/7 on Telegram, Discord, and WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api/auth/signin" className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 text-center">Deploy Now — From $8/mo</Link>
            <Link href="/setup-guide" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold transition text-center">See How Easy It Is</Link>
          </div>
          <p className="text-sm text-[var(--muted)] mt-4">BYOK — bring your own API key. You control the model and spend.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-12 text-center">
          {[
            ["100K+", "OpenClaw GitHub Stars"],
            ["<90s", "Deploy Time"],
            ["3+", "Chat Channels"],
            ["99.5%", "Uptime"],
          ].map(([val, label]) => (
            <div key={label}>
              <span className="text-3xl font-bold text-white">{val}</span>
              <p className="text-sm text-[var(--muted)]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6" id="features">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-[var(--muted)] text-center mb-16 max-w-xl mx-auto">From signup to chatting with your AI — in four simple steps.</p>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl mx-auto mb-4">{s.icon}</div>
                <div className="text-xs text-indigo-400 font-bold mb-2">STEP {s.step}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-indigo-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect Your Favorite Channels</h2>
          <p className="text-[var(--muted)] mb-12 max-w-xl mx-auto">Start with Telegram in minutes. Add more channels as you grow.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Telegram", icon: "💬", status: "✓ All Plans", highlight: true },
              { name: "Discord", icon: "🎮", status: "Pro & Business", highlight: false },
              { name: "WhatsApp", icon: "📱", status: "Business (Coming Soon)", highlight: false },
              { name: "Signal", icon: "🔒", status: "Coming Soon", highlight: false },
              { name: "Slack", icon: "💼", status: "Coming Soon", highlight: false },
            ].map((c) => (
              <div key={c.name} className={`flex items-center gap-3 bg-[var(--card-bg)] border rounded-xl px-6 py-4 min-w-[180px] ${c.highlight ? "border-indigo-500/50 bg-indigo-500/5" : "border-[var(--card-border)]"}`}>
                <span className="text-2xl">{c.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{c.name}</div>
                  <div className={`text-xs ${c.highlight ? "text-green-400" : "text-[var(--muted)]"}`}>{c.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🧠", title: "Custom Personality", desc: "Define your agent's personality, tone, and behavior with SOUL.md. Visual editor included." },
              { icon: "🔧", title: "Skills & Plugins", desc: "Install pre-built skills for YouTube, GitHub, marketing, and more. Or build your own." },
              { icon: "⏰", title: "Cron & Automation", desc: "Schedule recurring tasks, reminders, and automated workflows. Your agent works while you sleep." },
              { icon: "📊", title: "Dashboard", desc: "Monitor your instance, view logs, restart, and manage everything from one clean interface." },
              { icon: "🔐", title: "Fully Isolated", desc: "Each user gets their own server. No shared resources, no data mixing. Your data stays yours." },
              { icon: "🔄", title: "Auto-Recovery", desc: "We monitor every instance and auto-restart on crashes. 99.5% uptime target." },
            ].map((f) => (
              <div key={f.title} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-[var(--muted)] text-center mb-16 max-w-xl mx-auto">No hidden fees. No per-message charges. You bring your AI model key, we handle everything else.</p>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((p) => (
              <div key={p.name} className={`relative rounded-2xl p-8 flex flex-col ${p.popular ? "bg-gradient-to-b from-indigo-500/10 to-cyan-500/10 border-2 border-indigo-500/50 scale-105" : "bg-[var(--card-bg)] border border-[var(--card-border)]"}`}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</span>}
                <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                <div className="mb-6"><span className="text-4xl font-bold">${p.price}</span><span className="text-[var(--muted)]">/month</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><span className="text-green-400 mt-0.5">✓</span><span>{f}</span></li>)}
                </ul>
                <Link href="/api/auth/signin" className={`w-full py-3 rounded-xl font-semibold transition-all text-center block ${p.popular ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}>{p.cta}</Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[var(--muted)] mt-8">All plans include your own isolated server. LLM API costs are separate (you use your own key).</p>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-indigo-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">EasyClaw vs. Alternatives</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="py-4 pr-4 text-[var(--muted)] font-normal">Feature</th>
                  <th className="py-4 px-4 text-indigo-400 font-bold">EasyClaw</th>
                  <th className="py-4 px-4 text-[var(--muted)]">SimpleClaw</th>
                  <th className="py-4 px-4 text-[var(--muted)]">DIY (VPS)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Setup Time", "< 90 seconds", "< 60 seconds", "~60 minutes"],
                  ["Telegram", "✅ All plans", "✅", "✅ (manual)"],
                  ["Discord", "✅ Pro+", "❌", "✅ (manual)"],
                  ["WhatsApp", "🔜 Business", "❌", "✅ (manual)"],
                  ["Agent Templates", "✅", "❌", "❌"],
                  ["Visual Config Editor", "✅", "❌", "❌"],
                  ["Skills/Plugins", "✅", "❌", "✅ (manual)"],
                  ["Auto-Recovery", "✅", "❓", "❌ (DIY)"],
                  ["Dashboard", "✅", "Basic", "❌"],
                  ["Starting Price", "$8/mo", "~$20/mo", "$4/mo + time"],
                ].map(([feature, easy, simple, diy]) => (
                  <tr key={feature} className="border-b border-[var(--card-border)]/50">
                    <td className="py-3 pr-4 font-medium">{feature}</td>
                    <td className="py-3 px-4 text-green-400">{easy}</td>
                    <td className="py-3 px-4 text-[var(--muted)]">{simple}</td>
                    <td className="py-3 px-4 text-[var(--muted)]">{diy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          {FAQS.map((f) => <FAQItem key={f.q} item={f} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/30 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Deploy Your AI Assistant?</h2>
          <p className="text-[var(--muted)] mb-8 max-w-lg mx-auto">Join the OpenClaw revolution. Deploy in 60 seconds. No technical knowledge required.</p>
          <Link href="/api/auth/signin" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105">Get Started Now — From $8/mo</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2"><span className="text-xl">⚡</span><span className="font-bold">EasyClaw</span></div>
          <div className="flex gap-6 text-sm text-[var(--muted)]">
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Contact</a>
            <a href="https://github.com/openclaw/openclaw" className="hover:text-white transition">OpenClaw</a>
          </div>
          <p className="text-sm text-[var(--muted)]">© 2026 EasyClaw. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
