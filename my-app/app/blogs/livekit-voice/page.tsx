"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl md:text-3xl font-bold text-stone-900 mt-16 mb-4 tracking-tight"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </h2>
  );
}

function Callout({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "insight" }) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    insight: "bg-emerald-50 border-emerald-200 text-emerald-900",
  };

  return (
    <div className={`my-6 px-5 py-4 rounded-xl border ${styles[type]} text-sm leading-relaxed`}>
      {children}
    </div>
  );
}

function CodeBlock({ title, language, children }: { title?: string; language: string; children: string }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-stone-200">
      {title && (
        <div className="bg-stone-800 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-mono text-stone-400">{title}</span>
          <span className="text-[10px] font-mono text-stone-500 uppercase">{language}</span>
        </div>
      )}
      <div className="bg-stone-900 p-5 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed text-stone-300">{children}</pre>
      </div>
    </div>
  );
}

export default function LiveKitVoice() {
  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        background: "#fafaf9",
        color: "#1c1917",
      }}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-stone-50/80 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            href="/blogs"
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blogs
          </Link>
          <a
            href="https://www.linkedin.com/in/vikranth-jagdish-b37798126/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            LinkedIn <ExternalLink size={14} />
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 rounded-full">
                Tutorial
              </span>
              <span className="text-xs text-stone-400">10 min read</span>
            </div>
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900 mb-4"
              style={{ fontFamily: "var(--font-mono)", lineHeight: 1.1 }}
            >
              Building Real-time Voice<br />
              <span className="text-stone-500">Applications with LiveKit</span>
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed">
              From telehealth to online education to social experiences &mdash; real-time voice is everywhere.
              Here&apos;s how LiveKit makes it accessible, scalable, and production-ready.
            </p>
          </header>

          {/* ─── Section 1: What is LiveKit ─── */}
          <section>
            <SectionHeading>What is LiveKit?</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              LiveKit is an open-source, end-to-end WebRTC platform. It abstracts away the notoriously
              complex WebRTC stack and gives you clean APIs for building real-time audio and video applications.
              Think of it as the &quot;Stripe of real-time communication&quot; &mdash; it handles the hard
              infrastructure so you can focus on your product.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
              {[
                { label: "Latency", value: "<100ms", desc: "Sub-second real-time" },
                { label: "Scale", value: "1 to 1M+", desc: "Calls to broadcasts" },
                { label: "Platforms", value: "6+", desc: "Web, iOS, Android..." },
                { label: "License", value: "Apache 2.0", desc: "Fully open source" },
              ].map(({ label, value, desc }) => (
                <div key={label} className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-stone-900 font-mono">{value}</div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-1">{label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Section 2: Why LiveKit ─── */}
          <section>
            <SectionHeading>Why Not Just Use WebRTC Directly?</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              You <em>could</em> build on raw WebRTC. But you&apos;d spend months dealing with
              STUN/TURN servers, codec negotiation, bandwidth estimation, connection state machines,
              and the dozens of browser-specific quirks that make WebRTC notoriously hard to ship.
            </p>

            <Callout type="warning">
              <strong>Real talk:</strong> I&apos;ve seen teams spend 6+ months building a &quot;simple&quot;
              voice chat on raw WebRTC, only to abandon it for a managed solution. The edge cases in
              production &mdash; NAT traversal failures, codec mismatches, mobile backgrounding &mdash; are brutal.
            </Callout>

            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              LiveKit gives you production-ready infrastructure out of the box:
            </p>

            <div className="my-6 space-y-3">
              {[
                { label: "SFU Architecture", desc: "Selective Forwarding Unit for efficient multi-party calls. Each participant sends their stream once; the server distributes it to everyone else." },
                { label: "Adaptive Bitrate", desc: "Automatically adjusts audio and video quality based on each participant's network conditions. No manual tuning needed." },
                { label: "Edge Deployment", desc: "Globally distributed servers so participants connect to the nearest node, minimizing latency regardless of geography." },
                { label: "Built-in Recording", desc: "Server-side recording without client-side overhead. Record individual tracks or composite rooms for playback or compliance." },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-4 bg-stone-50 border border-stone-200 rounded-lg p-4">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-sky-100 text-sky-700 rounded mt-0.5 shrink-0">
                    {label}
                  </span>
                  <p className="text-stone-700 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Section 3: Voice Features ─── */}
          <section>
            <SectionHeading>Voice-Specific Superpowers</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              LiveKit isn&apos;t just a generic WebRTC wrapper. It has first-class support for voice
              applications with features that would take months to build yourself.
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              {[
                {
                  title: "Noise Cancellation",
                  desc: "Krisp.ai integration filters out background noise — keyboards, dogs, construction — leaving crystal-clear voice.",
                  color: "bg-violet-50 border-violet-200",
                },
                {
                  title: "Echo Cancellation",
                  desc: "Built-in acoustic echo cancellation prevents that awful feedback loop when someone isn't wearing headphones.",
                  color: "bg-sky-50 border-sky-200",
                },
                {
                  title: "Voice Activity Detection",
                  desc: "Intelligently detects when someone is speaking vs. silent. Essential for UI indicators and bandwidth optimization.",
                  color: "bg-emerald-50 border-emerald-200",
                },
                {
                  title: "Spatial Audio",
                  desc: "3D audio positioning for immersive experiences. Place participants in virtual space so conversations feel natural.",
                  color: "bg-amber-50 border-amber-200",
                },
              ].map(({ title, desc, color }) => (
                <div key={title} className={`${color} border rounded-xl p-5`}>
                  <h4 className="font-bold text-stone-900 mb-2 text-sm">{title}</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Section 4: Code Walkthrough ─── */}
          <section>
            <SectionHeading>Building a Voice Chat Room</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Let&apos;s walk through the key pieces. A voice application has two sides: a backend that
              generates secure tokens, and a frontend that connects to the room and handles audio.
            </p>

            <div className="my-8 bg-stone-100 rounded-xl p-6">
              <pre className="text-sm font-mono text-stone-600 text-center leading-loose">
{`  Client App
      │
      ▼
  LiveKit SDK  ──→  Token Server (your backend)
      │
      ▼
  LiveKit SFU  ──→  Routes audio streams
      │
      ▼
  Other Clients`}
              </pre>
            </div>

            <h3 className="text-lg font-bold text-stone-900 mb-3 mt-8">Step 1: Token Generation (Backend)</h3>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Every participant needs a JWT token to join a room. This is generated server-side so your
              API keys are never exposed to clients.
            </p>

            <CodeBlock title="token-server.ts" language="TypeScript">
{`import { AccessToken } from 'livekit-server-sdk';

function createToken(roomName: string, participantName: string) {
  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,     // Can send audio
    canSubscribe: true,   // Can receive audio
  });

  return token.toJwt();
}`}
            </CodeBlock>

            <h3 className="text-lg font-bold text-stone-900 mb-3 mt-8">Step 2: Room Connection (Frontend)</h3>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              On the client side, create a Room instance, configure audio settings, and connect. LiveKit
              handles all the WebRTC negotiation, ICE candidate gathering, and codec selection behind the scenes.
            </p>

            <CodeBlock title="voice-room.ts" language="TypeScript">
{`import { Room, RoomEvent } from 'livekit-client';

const room = new Room({
  adaptiveStream: true,
  dynacast: true,
  audioCaptureDefaults: {
    autoGainControl: true,
    echoCancellation: true,
    noiseSuppression: true,
  },
});

// Someone joins
room.on(RoomEvent.ParticipantConnected, (participant) => {
  console.log(\`\${participant.identity} joined the room\`);
});

// Receive their audio
room.on(RoomEvent.TrackSubscribed, (track, pub, participant) => {
  if (track.kind === 'audio') {
    const audioElement = track.attach();
    document.body.appendChild(audioElement);
  }
});

// Connect and enable mic
await room.connect(livekitUrl, token);
await room.localParticipant.setMicrophoneEnabled(true);`}
            </CodeBlock>

            <Callout type="insight">
              <strong>That&apos;s it.</strong> About 30 lines of code to build a working multi-party
              voice chat. Compare that to the thousands of lines you&apos;d need with raw WebRTC,
              and you can see why LiveKit has become the go-to choice.
            </Callout>
          </section>

          {/* ─── Section 5: Best Practices ─── */}
          <section>
            <SectionHeading>Production Best Practices</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Getting a demo working is one thing. Shipping to production is another.
              Here are the things that matter when real users are on the line.
            </p>

            <div className="my-6 space-y-4">
              <div className="border-l-4 border-sky-300 pl-5 py-2">
                <h4 className="font-bold text-stone-900 text-sm mb-1">Handle Network Gracefully</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Implement reconnection logic with exponential backoff. Show connection quality indicators
                  so users know if the issue is on their end. Gracefully degrade audio quality rather than
                  dropping the connection entirely.
                </p>
              </div>
              <div className="border-l-4 border-emerald-300 pl-5 py-2">
                <h4 className="font-bold text-stone-900 text-sm mb-1">Optimize Audio Pipeline</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Use Opus codec (LiveKit&apos;s default) for the best quality-to-bandwidth ratio.
                  Configure audio constraints properly. Enable browser-level audio processing for
                  echo cancellation and noise suppression.
                </p>
              </div>
              <div className="border-l-4 border-violet-300 pl-5 py-2">
                <h4 className="font-bold text-stone-900 text-sm mb-1">Get the UX Right</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Show visual indicators when someone is speaking. Add keyboard shortcuts for mute/unmute.
                  Display clear connection status. These small details make the difference between a demo
                  and a product people actually want to use.
                </p>
              </div>
              <div className="border-l-4 border-red-300 pl-5 py-2">
                <h4 className="font-bold text-stone-900 text-sm mb-1">Lock Down Security</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Never expose API keys client-side. Set short token expiration times. Validate all
                  permissions server-side. Use room-level access controls to prevent unauthorized joins.
                </p>
              </div>
            </div>
          </section>

          {/* ─── Section 6: Advanced Use Cases ─── */}
          <section>
            <SectionHeading>Beyond Basic Voice Chat</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Once you have the fundamentals, LiveKit opens the door to some genuinely exciting use cases.
            </p>

            <div className="grid gap-4 my-8">
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-violet-200 text-violet-800 rounded">01</span>
                  <h4 className="font-bold text-violet-900">AI Voice Assistants</h4>
                </div>
                <p className="text-sm text-violet-800 leading-relaxed">
                  Pipe audio through Whisper for real-time transcription, process with an LLM, and respond
                  with text-to-speech. LiveKit&apos;s low latency makes conversational AI feel natural rather
                  than like talking to a voicemail system.
                </p>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-sky-200 text-sky-800 rounded">02</span>
                  <h4 className="font-bold text-sky-900">Podcast Recording Platform</h4>
                </div>
                <p className="text-sm text-sky-800 leading-relaxed">
                  Multi-track server-side recording gives each participant their own audio file for
                  post-production. Stream live to an audience while recording. No client-side CPU overhead
                  means guests on older hardware still sound great.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-200 text-emerald-800 rounded">03</span>
                  <h4 className="font-bold text-emerald-900">Voice-Enabled Gaming</h4>
                </div>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  Proximity-based chat where you hear players near you in the game world. Team channels
                  for coordinated play. Spatial audio that makes the game world feel alive. In-game voice
                  commands powered by speech recognition.
                </p>
              </div>
            </div>
          </section>

          {/* ─── Section 7: Performance ─── */}
          <section>
            <SectionHeading>Performance Numbers That Matter</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              When building voice applications, these are the benchmarks you should be targeting.
              Miss any of them and your users will notice.
            </p>

            <div className="my-8 bg-stone-900 rounded-2xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { metric: "<300ms", label: "End-to-end latency", note: "Above this, conversation feels unnatural" },
                  { metric: "32-64kb/s", label: "Per audio stream", note: "Opus codec sweet spot" },
                  { metric: "<5%", label: "CPU overhead", note: "Monitor client-side processing" },
                  { metric: "99.9%", label: "Connection uptime", note: "With proper reconnection logic" },
                ].map(({ metric, label, note }) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-bold text-amber-400 font-mono">{metric}</div>
                    <div className="text-xs font-bold text-stone-300 mt-1">{label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{note}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Section 8: Deployment ─── */}
          <section>
            <SectionHeading>Deployment Options</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              LiveKit gives you flexibility in how you deploy, each with different tradeoffs.
            </p>

            <div className="my-6 bg-stone-900 rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-900 text-emerald-300 rounded mt-0.5 shrink-0">
                    Self-hosted
                  </span>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Full control over your infrastructure. Deploy on your own servers or cloud instances.
                    Best for compliance-heavy industries or teams with strong DevOps capabilities.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-sky-900 text-sky-300 rounded mt-0.5 shrink-0">
                    LiveKit Cloud
                  </span>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Managed service with pay-as-you-go pricing. Global edge network, automatic scaling,
                    and zero infrastructure management. Best for most teams shipping quickly.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-violet-900 text-violet-300 rounded mt-0.5 shrink-0">
                    Hybrid
                  </span>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Self-host your primary infrastructure with LiveKit Cloud as failover.
                    Best of both worlds for teams that need control but also want reliability guarantees.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Closing ─── */}
          <section>
            <div className="my-12 p-8 bg-stone-900 rounded-2xl text-center">
              <p className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mb-4">
                Real-time voice is no longer<br />
                <span className="text-sky-400">a hard engineering problem.</span>
              </p>
              <p className="text-stone-400 text-sm max-w-md mx-auto">
                LiveKit has turned what used to be months of WebRTC wrestling into a weekend project.
                The infrastructure is solved &mdash; now it&apos;s about what you build on top of it.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-stone-200">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to all blogs
            </Link>
          </footer>
        </motion.article>
      </main>
    </div>
  );
}
