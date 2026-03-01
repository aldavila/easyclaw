"use client";

import { useState } from "react";
import Link from "next/link";

function track(label: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "signup_click", page: label }),
  }).catch(() => {});
}

const STEPS = [
  { step: "1", title: "Sign Up", desc: "Create your account with Google or email. Takes 10 seconds.", icon: "🔑" },
  { step: "2", title: "Configure", desc: "Pick your AI model, paste your API key, connect Telegram.", icon: "⚙️" },
  { step: "3", title: "Deploy", desc: "We provision your server and start OpenClaw. Under 90 seconds.", icon: "🚀" },
  { step: "4", title: "Chat", desc: "Your AI assistant is live. Message it on Telegram 24/7.", icon: "💬" },
];

const FEATURES = [
  { icon: "🧠", title: "Custom Personality", desc: "Define your agent's personality, tone, and behavior with SOUL.md. Visual editor included." },
  { icon: "💬", title: "Telegram Integration", desc: "Your AI lives in Telegram. Chat with it like a friend, get reminders, automate tasks." },
  { icon: "🔧", title: "Skills & Plugins", desc: "Install pre-built skills for YouTube, GitHub, marketing, and more. Or build your own." },
  { icon: "⏰", title: "Cron & Automation", desc: "Schedule recurring tasks, reminders, and automated workflows. Your agent works while you sleep." },
  { icon: "📊", title: "Dashboard", desc: "Monitor your instance, view logs, restart, and manage everything from one clean interface." },
  { icon: "🔐", title: "Fully Isolated", desc: "Each user gets their own server. No shared resources, no data mixing. Your data stays yours." },
];

const FAQS = [
  { q: "What is OpenClaw?", a: "OpenClaw is the most popular open-source AI agent platform with 100K+ GitHub stars. It lets you run a personal AI assistant that connects to your messaging apps and works 24/7." },
  { q: "Do I need my own API key?", a: "Yes. EasyClaw uses BYOK (Bring Your Own Key). You provide an API key from Anthropic (Claude), OpenAI (GPT), or Google (Gemini). This keeps prices low and gives you full control over your AI spend." },
  { q: "Which messaging apps are supported?", a: "Telegram is fully supported today. Discord, WhatsApp, and more channels are on the roadmap and coming soon." },
  { q: "Can I use Claude, GPT, or Gemini?", a: "Yes. OpenClaw supports all major AI models. Pick your model and provide your own API key. Switch models anytime from your dashboard." },
  { q: "What happens if my instance goes down?", a: "We monitor every instance and auto-restart on crashes. We target 99.5% uptime." },
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
          </div>
          <Link href="/api/auth/signin" onClick={() => track("Nav — Get Started")} className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">Get Started</Link>
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
            One-click OpenClaw deployment. No servers, no SSH, no CLI. Get a personal AI assistant running 24/7 on Telegram.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api/auth/signin" onClick={() => track("Hero — Deploy Now")} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 text-center">Deploy Now — $24/mo</Link>
            <a href="#features" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold transition text-center">See How It Works</a>
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
            ["24/7", "Always On"],
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Live on Telegram</h2>
          <p className="text-[var(--muted)] mb-12 max-w-xl mx-auto">Your AI assistant lives in Telegram. Chat with it like a friend. More channels coming soon.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Telegram", icon: "💬", live: true },
              { name: "Discord", icon: "🎮", live: false },
              { name: "WhatsApp", icon: "📱", live: false },
              { name: "Signal", icon: "🔒", live: false },
              { name: "Slack", icon: "💼", live: false },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-6 py-4 min-w-[180px]">
                <span className="text-2xl">{c.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{c.name}</div>
                  <div className={`text-xs ${c.live ? "text-green-400" : "text-[var(--muted)]"}`}>{c.live ? "✓ Available" : "Coming Soon"}</div>
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
            {FEATURES.map((f) => (
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
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-[var(--muted)] mb-12">No tiers. No hidden fees. One plan, everything included.</p>
          <div className="bg-gradient-to-b from-indigo-500/10 to-cyan-500/10 border-2 border-indigo-500/50 rounded-2xl p-10">
            <h3 className="text-2xl font-bold mb-2">EasyClaw</h3>
            <div className="mb-8"><span className="text-5xl font-bold">$24</span><span className="text-[var(--muted)]">/month</span></div>
            <ul className="space-y-4 mb-10 text-left max-w-xs mx-auto">
              {[
                "Telegram channel",
                "Any AI model (BYOK)",
                "Your own isolated server",
                "Custom personality (SOUL.md editor)",
                "Skills & plugins",
                "Cron jobs & automation",
                "Full dashboard",
                "Auto-recovery & monitoring",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/api/auth/signin" onClick={() => track("Pricing — Get Started")} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-105 text-center block text-lg">Get Started</Link>
            <p className="text-xs text-[var(--muted)] mt-4">LLM API costs are separate (you use your own key). Cancel anytime.</p>
          </div>
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
                  ["Telegram", "✅", "✅", "✅ (manual)"],
                  ["Agent Templates", "✅", "❌", "❌"],
                  ["Visual Config Editor", "✅", "❌", "❌"],
                  ["Skills/Plugins", "✅", "❌", "✅ (manual)"],
                  ["Auto-Recovery", "✅", "❓", "❌ (DIY)"],
                  ["Dashboard", "✅", "Basic", "❌"],
                  ["Price", "$24/mo", "~$20/mo", "$4/mo + time"],
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
          <Link href="/api/auth/signin" onClick={() => track("Bottom CTA — Get Started")} className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105">Get Started — $24/mo</Link>
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
