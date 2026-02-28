"use client";

import { useState } from "react";
import Link from "next/link";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1e1e1e]">
      <button className="w-full py-4 flex justify-between items-center text-left" onClick={() => setOpen(!open)}>
        <span className="font-medium">{q}</span>
        <span className="text-xl text-[#888]">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="pb-4 text-[#888] leading-relaxed">{a}</p>}
    </div>
  );
}

export default function SetupGuide() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1e1e1e]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold">EasyClaw</span>
          </Link>
          <Link href="/api/auth/signin" className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Setup Guide</h1>
          <p className="text-xl text-[#888]">Get your AI assistant running in under 5 minutes. No coding required.</p>
        </div>
      </section>

      {/* What is EasyClaw */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-2">💡 What is EasyClaw?</h2>
            <p className="text-[#aaa] leading-relaxed">
              EasyClaw deploys a personal AI assistant that runs 24/7 and chats with you on Telegram, Discord, or WhatsApp — powered by your choice of AI (Claude, GPT, or Gemini).
            </p>
          </div>
        </div>
      </section>

      {/* What You Need */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">📋 What You Need Before Starting</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-bold mb-2">An AI API Key</h3>
              <p className="text-sm text-[#888]">From Anthropic (Claude), OpenAI (GPT), or Google (Gemini). This is how your agent &quot;thinks.&quot;</p>
            </div>
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold mb-2">Telegram App</h3>
              <p className="text-sm text-[#888]">Downloaded on your phone or computer. You&apos;ll create a bot through Telegram.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 1: Create Telegram Bot */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">1</span>
            <h2 className="text-2xl font-bold">Create Your Telegram Bot</h2>
          </div>
          <p className="text-[#888] mb-6">This takes about 2 minutes. You&apos;ll talk to a special Telegram bot called BotFather.</p>
          
          <div className="space-y-4">
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-indigo-400 font-bold text-lg">1</span>
                <div>
                  <h3 className="font-bold mb-1">Open Telegram and search for @BotFather</h3>
                  <p className="text-sm text-[#888]">BotFather is the official Telegram bot for creating bots. It has a blue checkmark. Make sure you&apos;re talking to the real one!</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-indigo-400 font-bold text-lg">2</span>
                <div>
                  <h3 className="font-bold mb-1">Send the command: <code className="bg-black/50 px-2 py-1 rounded text-sm">/newbot</code></h3>
                  <p className="text-sm text-[#888]">Just type /newbot and hit send. BotFather will guide you through the rest.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-indigo-400 font-bold text-lg">3</span>
                <div>
                  <h3 className="font-bold mb-1">Choose a display name</h3>
                  <p className="text-sm text-[#888]">This is what people will see. Example: &quot;My AI Assistant&quot; or &quot;Alex the Helper&quot;</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-indigo-400 font-bold text-lg">4</span>
                <div>
                  <h3 className="font-bold mb-1">Choose a username (must end in &quot;bot&quot;)</h3>
                  <p className="text-sm text-[#888]">This is the @handle. Example: @myai_assistant_bot or @alex_helper_bot. It must be unique and end with &quot;bot&quot;.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-indigo-400 font-bold text-lg">5</span>
                <div>
                  <h3 className="font-bold mb-1">Copy the token BotFather gives you</h3>
                  <p className="text-sm text-[#888]">BotFather will send you a message containing your bot token. It looks like: <code className="bg-black/50 px-2 py-1 rounded text-xs">123456789:ABCdefGHIjklMNOpqrsTUVwxyz</code></p>
                  <p className="text-sm text-yellow-400 mt-2">⚠️ Keep this secret! Anyone with your token can control your bot.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Get AI API Key */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">2</span>
            <h2 className="text-2xl font-bold">Get Your AI API Key</h2>
          </div>
          <p className="text-[#888] mb-6">Your agent needs an AI &quot;brain.&quot; Choose one of these providers:</p>

          <div className="space-y-4">
            {/* Anthropic */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🟠</span>
                <h3 className="font-bold">Anthropic (Claude) — Recommended</h3>
              </div>
              <ol className="text-sm text-[#888] space-y-2 ml-9">
                <li>1. Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener" className="text-indigo-400 hover:underline">console.anthropic.com</a></li>
                <li>2. Create an account or sign in</li>
                <li>3. Go to &quot;API Keys&quot; in the sidebar</li>
                <li>4. Click &quot;Create Key&quot; and give it a name</li>
                <li>5. Copy the key (starts with <code className="bg-black/50 px-1.5 py-0.5 rounded text-xs">sk-ant-</code>)</li>
              </ol>
              <p className="text-xs text-[#666] mt-3 ml-9">Pricing: ~$3 per million input tokens, ~$15 per million output tokens (Claude Sonnet)</p>
            </div>

            {/* OpenAI */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🟢</span>
                <h3 className="font-bold">OpenAI (GPT)</h3>
              </div>
              <ol className="text-sm text-[#888] space-y-2 ml-9">
                <li>1. Go to <a href="https://platform.openai.com" target="_blank" rel="noopener" className="text-indigo-400 hover:underline">platform.openai.com</a></li>
                <li>2. Sign in with your OpenAI account</li>
                <li>3. Go to &quot;API Keys&quot; in settings</li>
                <li>4. Click &quot;Create new secret key&quot;</li>
                <li>5. Copy the key (starts with <code className="bg-black/50 px-1.5 py-0.5 rounded text-xs">sk-</code>)</li>
              </ol>
              <p className="text-xs text-[#666] mt-3 ml-9">Pricing: ~$2.50 per million input tokens, ~$10 per million output tokens (GPT-4.1)</p>
            </div>

            {/* Google */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔵</span>
                <h3 className="font-bold">Google (Gemini) — Budget Option</h3>
              </div>
              <ol className="text-sm text-[#888] space-y-2 ml-9">
                <li>1. Go to <a href="https://aistudio.google.com" target="_blank" rel="noopener" className="text-indigo-400 hover:underline">aistudio.google.com</a></li>
                <li>2. Sign in with your Google account</li>
                <li>3. Click &quot;Get API key&quot; in the sidebar</li>
                <li>4. Create a key for a new or existing project</li>
                <li>5. Copy the key</li>
              </ol>
              <p className="text-xs text-[#666] mt-3 ml-9">Pricing: Free tier available, then ~$0.075 per million tokens (Gemini Flash)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 3: Deploy on EasyClaw */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">3</span>
            <h2 className="text-2xl font-bold">Deploy on EasyClaw</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-green-400 font-bold text-lg">1</span>
                <div>
                  <h3 className="font-bold mb-1">Sign up with Google</h3>
                  <p className="text-sm text-[#888]">Click &quot;Get Started&quot; and sign in with your Google account. Takes 10 seconds.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-green-400 font-bold text-lg">2</span>
                <div>
                  <h3 className="font-bold mb-1">Choose your plan</h3>
                  <p className="text-sm text-[#888]">Starter ($8/mo) is perfect for beginners. You can upgrade anytime.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-green-400 font-bold text-lg">3</span>
                <div>
                  <h3 className="font-bold mb-1">Create your agent</h3>
                  <p className="text-sm text-[#888]">Name your agent, select your AI model, paste your API key, select Telegram, and paste your bot token.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-green-400 font-bold text-lg">4</span>
                <div>
                  <h3 className="font-bold mb-1">Click Deploy!</h3>
                  <p className="text-sm text-[#888]">We spin up your server in under 90 seconds. You&apos;ll see the status change to &quot;Running.&quot;</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
              <div className="flex gap-4">
                <span className="text-green-400 font-bold text-lg">5</span>
                <div>
                  <h3 className="font-bold mb-1">Start chatting!</h3>
                  <p className="text-sm text-[#888]">Open Telegram, find your bot by its username, and send it a message. Your AI assistant is alive! 🎉</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">🚀 What Happens After You Deploy</h2>
          <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
            <p className="text-[#aaa]"><strong className="text-white">Your bot is live 24/7.</strong> It&apos;ll respond whenever you message it, day or night.</p>
            <p className="text-[#aaa]"><strong className="text-white">Customize the personality.</strong> Use the SOUL.md editor in your dashboard to change how your agent talks, what it knows, and how it behaves.</p>
            <p className="text-[#aaa]"><strong className="text-white">Monitor from your dashboard.</strong> See status, restart if needed, view logs, and manage everything in one place.</p>
            <p className="text-[#aaa]"><strong className="text-white">Add more channels.</strong> Upgrade to Pro for Discord, or Business for WhatsApp (coming soon).</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">❓ Frequently Asked Questions</h2>
          <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-6">
            <FAQItem 
              q="What is a bot token?" 
              a="A bot token is like a password for your Telegram bot. It's a unique string that lets EasyClaw control your bot and send/receive messages. You get it from BotFather when you create the bot."
            />
            <FAQItem 
              q="Is my token safe?" 
              a="Yes. Your bot token and API key are encrypted and stored securely. We never share them with anyone. You can revoke your bot token anytime through BotFather (/revoke command)."
            />
            <FAQItem 
              q="Can I change my bot name later?" 
              a="Yes! You can change your bot's display name anytime by talking to @BotFather and using the /setname command. The username (the @handle) can also be changed with /setusername."
            />
            <FAQItem 
              q="How much will the AI cost me?" 
              a="It depends on usage. For casual chatting (50-100 messages/day), expect $1-5/month in AI costs. Heavy usage might be $10-20/month. Budget models like Gemini Flash or Claude Haiku are much cheaper."
            />
            <FAQItem 
              q="What if something breaks?" 
              a="We monitor all instances and auto-restart on crashes. If something's wrong, you can restart from your dashboard. Pro and Business plans include email support."
            />
            <FAQItem 
              q="Can other people talk to my bot?" 
              a="By default, anyone who finds your bot can message it. You can configure privacy settings in your SOUL.md to ignore messages from non-approved users if you want."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/30 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Deploy?</h2>
          <p className="text-[#888] mb-8">You have everything you need. Let&apos;s get your AI assistant running.</p>
          <Link href="/api/auth/signin" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105">Get Started Now — From $8/mo</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e1e] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold">EasyClaw</span>
          </Link>
          <p className="text-sm text-[#888]">© 2026 EasyClaw. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
