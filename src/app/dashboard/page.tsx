"use client";

import { useEffect, useState, useCallback } from "react";

interface Instance {
  id: string;
  name: string;
  status: string;
  model: string;
  serverIp: string | null;
  healthStatus: string;
  channels: Array<{ type: string; config: Record<string, string> }>;
  soulMd: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    running: "bg-green-500/20 text-green-400 border-green-500/30",
    provisioning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    stopped: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.stopped}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "running" ? "bg-green-400 animate-pulse" : status === "provisioning" ? "bg-yellow-400 animate-pulse" : status === "error" ? "bg-red-400" : "bg-gray-400"}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function InstanceCard({ instance, onRestart, onDelete }: { instance: Instance; onRestart: () => void; onDelete: () => void }) {
  const [showSoul, setShowSoul] = useState(false);
  const [soulMd, setSoulMd] = useState(instance.soulMd || "");
  const [saving, setSaving] = useState(false);

  async function saveSoul() {
    setSaving(true);
    await fetch(`/api/instances/${instance.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ soulMd }) });
    setSaving(false);
    setShowSoul(false);
  }

  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div><h3 className="text-lg font-bold">{instance.name}</h3><p className="text-sm text-[#888]">{instance.model}</p></div>
        <StatusBadge status={instance.status} />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div><span className="text-[#888]">Server IP</span><p className="font-mono">{instance.serverIp || "Provisioning..."}</p></div>
        <div><span className="text-[#888]">Health</span><p className={instance.healthStatus === "healthy" ? "text-green-400" : "text-yellow-400"}>{instance.healthStatus}</p></div>
        <div><span className="text-[#888]">Channels</span><p>{instance.channels?.map(c => c.type).join(", ") || "None"}</p></div>
        <div><span className="text-[#888]">Created</span><p>{new Date(instance.createdAt).toLocaleDateString()}</p></div>
      </div>
      <div className="flex gap-3 mb-4">
        <button onClick={onRestart} disabled={instance.status === "provisioning"} className="flex-1 py-2 px-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition disabled:opacity-50">🔄 Restart</button>
        <button onClick={() => setShowSoul(!showSoul)} className="flex-1 py-2 px-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition">🧠 Edit SOUL.md</button>
        <button onClick={onDelete} className="py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition">🗑️</button>
      </div>
      {showSoul && (
        <div className="mt-4">
          <textarea value={soulMd} onChange={e => setSoulMd(e.target.value)} className="w-full h-48 bg-black/50 border border-[#1e1e1e] rounded-lg p-4 text-sm font-mono text-white resize-y focus:outline-none focus:border-indigo-500" placeholder="# My Agent&#10;&#10;Define personality here..." />
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setShowSoul(false)} className="px-4 py-2 text-sm text-[#888] hover:text-white transition">Cancel</button>
            <button onClick={saveSoul} disabled={saving} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg font-medium transition disabled:opacity-50">{saving ? "Saving..." : "Save & Restart"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewInstanceForm({ onCreated }: { onCreated: () => void }) {
  const [step, setStep] = useState(1);
  const [model, setModel] = useState("anthropic/claude-sonnet-4-20250514");
  const [apiKey, setApiKey] = useState("");
  const [channelType, setChannelType] = useState("telegram");
  const [botToken, setBotToken] = useState("");
  const [name, setName] = useState("My Agent");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);

  async function handleCreate() {
    setCreating(true); setError("");
    try {
      const res = await fetch("/api/instances", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, model, apiKey, channels: [{ type: channelType, config: { botToken } }] }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      onCreated();
    } catch (err) { setError(err instanceof Error ? err.message : "Unknown error"); }
    setCreating(false);
  }

  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Deploy New Agent</h2>
      <div className="flex gap-2 mb-8">{[1,2,3].map(s => <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-indigo-500" : "bg-[#1e1e1e]"}`} />)}</div>

      {step === 1 && (
        <div className="space-y-4">
          <div><label className="block text-sm text-[#888] mb-2">Agent Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/50 border border-[#1e1e1e] rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" /></div>
          <div><label className="block text-sm text-[#888] mb-2">AI Model</label>
            <select value={model} onChange={e => setModel(e.target.value)} className="w-full bg-black/50 border border-[#1e1e1e] rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500">
              <option value="anthropic/claude-sonnet-4-20250514">Claude Sonnet 4 (Recommended)</option>
              <option value="anthropic/claude-opus-4-6">Claude Opus 4.6</option>
              <option value="anthropic/claude-haiku-3">Claude Haiku 3 (Budget)</option>
              <option value="openai/gpt-4.1">GPT-4.1</option>
              <option value="openai/gpt-4.1-mini">GPT-4.1 Mini (Budget)</option>
              <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (Budget)</option>
            </select>
          </div>
          <button onClick={() => setStep(2)} className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition">Next: API Key →</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div><label className="block text-sm text-[#888] mb-2">API Key ({model.startsWith("anthropic") ? "Anthropic" : model.startsWith("openai") ? "OpenAI" : "Google"})</label>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full bg-black/50 border border-[#1e1e1e] rounded-lg p-3 text-white font-mono focus:outline-none focus:border-indigo-500" placeholder={model.startsWith("anthropic") ? "sk-ant-..." : "sk-..."} />
            <p className="text-xs text-[#888] mt-2">Your key is encrypted and stored securely. We never share it.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition">← Back</button>
            <button onClick={() => setStep(3)} disabled={!apiKey} className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition disabled:opacity-50">Next: Channel →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div><label className="block text-sm text-[#888] mb-2">Channel</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: "telegram", icon: "💬", label: "Telegram", desc: "Recommended" },
                { type: "discord", icon: "🎮", label: "Discord", desc: "Pro plan" }
              ].map(ch => (
                <button key={ch.type} onClick={() => { setChannelType(ch.type); setShowInstructions(true); }} className={`p-4 rounded-lg border text-left transition ${channelType === ch.type ? "border-indigo-500 bg-indigo-500/10" : "border-[#1e1e1e] bg-black/30 hover:border-white/20"}`}>
                  <span className="text-2xl">{ch.icon}</span>
                  <div className="mt-1 font-medium text-sm">{ch.label}</div>
                  <div className="text-xs text-[#666]">{ch.desc}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Collapsible Instructions */}
          <div className="bg-black/30 border border-[#1e1e1e] rounded-lg overflow-hidden">
            <button 
              onClick={() => setShowInstructions(!showInstructions)} 
              className="w-full p-3 flex items-center justify-between text-left hover:bg-white/5 transition"
            >
              <span className="text-sm font-medium text-indigo-400">
                {channelType === "telegram" ? "📖 How to get your Telegram bot token (2 min)" : "📖 How to get your Discord bot token (5 min)"}
              </span>
              <span className="text-[#888]">{showInstructions ? "▼" : "▶"}</span>
            </button>
            {showInstructions && (
              <div className="px-4 pb-4 text-sm text-[#aaa] space-y-2">
                {channelType === "telegram" ? (
                  <>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">1.</span><span>Open Telegram and search for <strong className="text-white">@BotFather</strong></span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">2.</span><span>Send <code className="bg-black/50 px-1.5 py-0.5 rounded text-xs">/newbot</code></span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">3.</span><span>Choose a name for your bot (e.g., &quot;My AI Assistant&quot;)</span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">4.</span><span>Choose a username ending in &quot;bot&quot; (e.g., &quot;myai_assistant_bot&quot;)</span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">5.</span><span>BotFather gives you a token — <strong className="text-white">paste it below</strong></span></div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">1.</span><span>Go to <strong className="text-white">discord.com/developers/applications</strong></span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">2.</span><span>Click &quot;New Application&quot; → name it → Create</span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">3.</span><span>Go to &quot;Bot&quot; in sidebar → click &quot;Reset Token&quot; → Copy it</span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">4.</span><span>Enable &quot;Message Content Intent&quot; under Privileged Gateway Intents</span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">5.</span><span>Go to OAuth2 → URL Generator → select &quot;bot&quot; scope</span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">6.</span><span>Select &quot;Send Messages&quot; + &quot;Read Message History&quot; permissions</span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">7.</span><span>Copy the generated URL → open it to invite bot to your server</span></div>
                    <div className="flex gap-2"><span className="text-indigo-400 font-bold">8.</span><span><strong className="text-white">Paste the bot token below</strong></span></div>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#888] mb-2">{channelType === "telegram" ? "Telegram Bot Token" : "Discord Bot Token"}</label>
            <input type="password" value={botToken} onChange={e => setBotToken(e.target.value)} className="w-full bg-black/50 border border-[#1e1e1e] rounded-lg p-3 text-white font-mono focus:outline-none focus:border-indigo-500" placeholder={channelType === "telegram" ? "123456:ABC-DEF..." : "MTIz..."} />
          </div>
          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition">← Back</button>
            <button onClick={handleCreate} disabled={!botToken || creating} className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition disabled:opacity-50">{creating ? "🚀 Deploying..." : "🚀 Deploy Agent"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [instanceList, setInstanceList] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const loadInstances = useCallback(async () => {
    try {
      const res = await fetch("/api/instances");
      if (res.ok) { const d = await res.json(); setInstanceList(d.instances); }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { loadInstances(); const i = setInterval(loadInstances, 10000); return () => clearInterval(i); }, [loadInstances]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2"><span className="text-2xl">⚡</span><span className="text-xl font-bold">EasyClaw</span><span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full ml-2">Dashboard</span></div>
          <button onClick={() => setShowNew(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">+ New Agent</button>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {showNew ? <NewInstanceForm onCreated={() => { setShowNew(false); loadInstances(); }} /> :
         loading ? <div className="text-center py-20"><div className="text-4xl mb-4 animate-spin">⚡</div><p className="text-[#888]">Loading...</p></div> :
         instanceList.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🤖</div><h2 className="text-2xl font-bold mb-2">No Agents Yet</h2><p className="text-[#888] mb-8">Deploy your first AI assistant in under 90 seconds.</p>
            <button onClick={() => setShowNew(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition">Deploy Your First Agent</button>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Your Agents</h1><span className="text-sm text-[#888]">{instanceList.length} instance{instanceList.length !== 1 ? "s" : ""}</span></div>
            {instanceList.map(inst => <InstanceCard key={inst.id} instance={inst} onRestart={async () => { await fetch(`/api/instances/${inst.id}/restart`, { method: "POST" }); loadInstances(); }} onDelete={async () => { if (!confirm("Delete this instance? This cannot be undone.")) return; await fetch(`/api/instances/${inst.id}`, { method: "DELETE" }); loadInstances(); }} />)}
          </div>
        )}
      </div>
    </div>
  );
}
