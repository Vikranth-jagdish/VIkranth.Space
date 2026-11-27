"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ChatSimulator from "@/components/ui/blog/chat-simulator";
import BlackBoxVisualizer from "@/components/ui/blog/black-box-visualizer";
import GrowingContext from "@/components/ui/blog/growing-context";

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

export default function HowAIActuallyWorks() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const original = meta?.getAttribute("content") || "";
    if (meta) {
      meta.setAttribute("content", "width=1200");
    }
    return () => {
      if (meta) {
        meta.setAttribute("content", original);
      }
    };
  }, []);

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
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full">
                Interactive
              </span>
              <span className="text-xs text-stone-400">5 min read</span>
            </div>
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900 mb-4"
              style={{ fontFamily: "var(--font-mono)", lineHeight: 1.1 }}
            >
              How AI Actually Works:<br />
              <span className="text-stone-500">Why It Has No Memory</span>
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed">
              You&apos;ve chatted with ChatGPT, Claude, or Gemini. It feels like they remember
              your conversation. But what if I told you they have absolutely no memory?
            </p>
          </header>

          {/* ─── Section 1: The Illusion ─── */}
          <section>
            <SectionHeading>The Illusion of Memory</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Open ChatGPT. Ask it something. Ask a follow-up. It responds perfectly,
              referencing what you said earlier. It <em>feels</em> like a conversation with
              someone who remembers everything.
            </p>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              But here&apos;s the thing: <strong>it doesn&apos;t remember anything.</strong> Not a
              single word. Every time you hit send, the AI starts completely from scratch. It has no
              idea what you said 5 seconds ago unless something very clever is happening behind the scenes.
            </p>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Let me show you exactly what that &quot;something clever&quot; is.
            </p>
          </section>

          {/* ─── Section 2: The Black Box ─── */}
          <section>
            <SectionHeading>The AI is a Stateless Black Box</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              At its core, a large language model (LLM) like GPT-4 or Claude does one thing:
              it takes in text and predicts the next word (technically, the next <em>token</em>).
              That&apos;s it. No thinking. No understanding. No memory. Just pattern matching at
              an incredible scale.
            </p>

            <Callout type="insight">
              <strong>Stateless</strong> means the model doesn&apos;t retain any information between
              requests. Each API call is completely independent. The model has no idea what happened
              in the previous call.
            </Callout>

            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Watch this: text goes in, the model processes it, and tokens come out one at a time.
              The model receives the <strong>entire input</strong> at once, then generates one token,
              adds it to the output, and repeats.
            </p>

            <BlackBoxVisualizer />
          </section>

          {/* ─── Section 3: The Secret ─── */}
          <section>
            <SectionHeading>So How Does It &quot;Remember&quot;?</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Here&apos;s the trick: every time you send a message, the application (ChatGPT, Claude, etc.)
              doesn&apos;t just send your latest message. It sends <strong>the entire conversation history</strong> as
              a JSON array. Every. Single. Time.
            </p>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              The conversation is stored as an array of message objects, each with a <code className="bg-stone-100 px-1.5 py-0.5 rounded text-sm font-mono text-stone-800">role</code> and
              a <code className="bg-stone-100 px-1.5 py-0.5 rounded text-sm font-mono text-stone-800">content</code> field:
            </p>

            <div className="my-6 bg-stone-900 rounded-xl p-5 overflow-x-auto">
              <pre className="text-sm font-mono leading-relaxed">
                <span className="text-stone-500">{"{"}</span>{"\n"}
                <span className="text-stone-500">{"  "}</span>
                <span className="text-amber-400">&quot;messages&quot;</span>
                <span className="text-stone-500">: [</span>{"\n"}
                <span className="text-stone-500">{"    {"} </span>
                <span className="text-amber-400">&quot;role&quot;</span>
                <span className="text-stone-500">: </span>
                <span className="text-purple-400">&quot;system&quot;</span>
                <span className="text-stone-500">, </span>
                <span className="text-amber-400">&quot;content&quot;</span>
                <span className="text-stone-500">: </span>
                <span className="text-stone-300">&quot;You are a helpful assistant.&quot;</span>
                <span className="text-stone-500">{" }"}</span>
                <span className="text-stone-500">,</span>{"\n"}
                <span className="text-stone-500">{"    {"} </span>
                <span className="text-amber-400">&quot;role&quot;</span>
                <span className="text-stone-500">: </span>
                <span className="text-blue-400">&quot;user&quot;</span>
                <span className="text-stone-500">, </span>
                <span className="text-amber-400">&quot;content&quot;</span>
                <span className="text-stone-500">: </span>
                <span className="text-stone-300">&quot;What is the capital of France?&quot;</span>
                <span className="text-stone-500">{" }"}</span>
                <span className="text-stone-500">,</span>{"\n"}
                <span className="text-stone-500">{"    {"} </span>
                <span className="text-amber-400">&quot;role&quot;</span>
                <span className="text-stone-500">: </span>
                <span className="text-emerald-400">&quot;assistant&quot;</span>
                <span className="text-stone-500">, </span>
                <span className="text-amber-400">&quot;content&quot;</span>
                <span className="text-stone-500">: </span>
                <span className="text-stone-300">&quot;The capital of France is Paris!&quot;</span>
                <span className="text-stone-500">{" }"}</span>
                <span className="text-stone-500">,</span>{"\n"}
                <span className="text-stone-500">{"    {"} </span>
                <span className="text-amber-400">&quot;role&quot;</span>
                <span className="text-stone-500">: </span>
                <span className="text-blue-400">&quot;user&quot;</span>
                <span className="text-stone-500">, </span>
                <span className="text-amber-400">&quot;content&quot;</span>
                <span className="text-stone-500">: </span>
                <span className="text-stone-300">&quot;What about Germany?&quot;</span>
                <span className="text-stone-500">{" }"}</span>{"\n"}
                <span className="text-stone-500">{"  ]"}</span>{"\n"}
                <span className="text-stone-500">{"}"}</span>
              </pre>
            </div>

            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              There are three roles:
            </p>
            <ul className="space-y-2 mb-6 ml-1">
              <li className="flex items-start gap-3 text-stone-700" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-purple-100 text-purple-700 rounded mt-1 shrink-0">system</span>
                <span>
                  The <strong>system prompt</strong> — a hidden instruction written by the developer that
                  you never see. It defines the AI&apos;s personality, rules, and behavior. For example,
                  ChatGPT&apos;s system prompt tells it to be helpful and harmless. A customer support bot
                  might have a system prompt like &quot;You are a support agent for Acme Corp. Only answer
                  questions about our products. Be polite.&quot; This is the developer&apos;s secret control
                  layer, and it&apos;s always the very first message in the array.
                </span>
              </li>
              <li className="flex items-start gap-3 text-stone-700" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-100 text-blue-700 rounded mt-1 shrink-0">user</span>
                <span>Your messages. What you type in the chat box.</span>
              </li>
              <li className="flex items-start gap-3 text-stone-700" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-100 text-emerald-700 rounded mt-1 shrink-0">assistant</span>
                <span>The AI&apos;s responses. What it generated previously.</span>
              </li>
            </ul>
          </section>

          {/* ─── Section 4: Try It Yourself ─── */}
          <section>
            <SectionHeading>Try It Yourself</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Here&apos;s a simulated chat interface. On the left is what you see — a normal chat.
              On the right is what&apos;s <em>actually</em> happening — the raw JSON array being sent to the API.
              Click &quot;Send next message&quot; and watch the array grow with every exchange.
            </p>

            <ChatSimulator />

            <Callout type="warning">
              Notice on the third exchange: the user asks &quot;Which one has more people?&quot; The AI
              knows they mean France and Germany only because the <strong>entire previous conversation</strong> was
              sent again. Without that context, &quot;which one&quot; would be meaningless.
            </Callout>
          </section>

          {/* ─── Section 5: The Growing Cost ─── */}
          <section>
            <SectionHeading>The Payload Keeps Growing</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Here&apos;s where it gets really interesting. Step through these API calls and watch
              the payload grow. Each call includes <strong>everything from all previous calls</strong>,
              plus the new messages.
            </p>

            <GrowingContext />

            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              This is why:
            </p>
            <ul className="space-y-2 mb-6 text-stone-700 list-disc pl-5" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              <li>
                <strong>Long conversations get slower</strong> &mdash; the model has to process more input every time
              </li>
              <li>
                <strong>Long conversations cost more</strong> &mdash; you&apos;re paying per token, and the token count keeps growing
              </li>
              <li>
                <strong>There&apos;s a limit</strong> &mdash; every model has a &quot;context window&quot; (e.g., 128K tokens for GPT-4). When you hit it, older messages get dropped
              </li>
              <li>
                <strong>Starting a &quot;new chat&quot; resets everything</strong> &mdash; the AI genuinely forgets because nothing is being passed anymore
              </li>
            </ul>
          </section>

          {/* ─── Section 6: The Aha Moment ─── */}
          <section>
            <SectionHeading>The Aha Moment</SectionHeading>
            <div className="my-8 p-8 bg-stone-900 rounded-2xl text-center">
              <p className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mb-4">
                Every single time you send a message,<br />
                <span className="text-amber-400">the ENTIRE conversation</span><br />
                is sent again from scratch.
              </p>
              <p className="text-stone-400 text-sm max-w-md mx-auto">
                The AI has no memory. No state. No continuity. The application creates the
                illusion of a conversation by replaying the full history every time.
              </p>
            </div>

            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              This is the fundamental architecture of every AI chatbot you use today. ChatGPT,
              Claude, Gemini &mdash; they all work this way. The model itself is a stateless function:
            </p>

            <div className="my-6 bg-stone-100 rounded-xl p-5 text-center">
              <code className="text-sm font-mono text-stone-700">
                f(messages[]) → next_token
              </code>
            </div>

            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              That&apos;s it. A function that takes an array of messages and predicts the next token.
              The magic is in the scale of the pattern matching, the quality of the training data,
              and the clever engineering of the applications that wrap around it.
            </p>
          </section>

          {/* ─── Section 7: Context Windows & RAG ─── */}
          <section>
            <SectionHeading>Why Context is &quot;Engineered&quot;</SectionHeading>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              Since the entire conversation is passed to the model every single time, the payload
              keeps growing. Eventually, the AI hits its <strong>context window</strong> — the maximum
              number of tokens (words/pieces of words) it can process in a single request. Once you
              hit that limit, no more input messages can be passed. The conversation is effectively over.
            </p>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              This is exactly why context is <strong>&quot;engineered&quot;</strong>. Developers don&apos;t
              just blindly dump everything into the messages array — they carefully choose what to include
              and what to leave out, so the model gets the most relevant information within its token budget.
            </p>
            <p className="text-stone-700 leading-relaxed mb-4" style={{ fontSize: "1.125rem", lineHeight: 1.85 }}>
              This is also why <strong>RAG (Retrieval-Augmented Generation)</strong> architectures exist.
              Instead of stuffing the entire history or an entire knowledge base into the prompt, RAG
              systems <em>retrieve</em> only the most relevant pieces of information and inject them into
              the messages array right before sending. The model gets exactly what it needs — nothing more,
              nothing less.
            </p>

            <Callout type="info">
              The context window is a hard ceiling. Every AI application has to decide what to pass
              to the model and what to drop. That decision — what context to include — is where the
              real engineering happens.
            </Callout>
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
