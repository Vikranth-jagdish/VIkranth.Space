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

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-stone-700 leading-relaxed mb-4"
      style={{ fontSize: "1.125rem", lineHeight: 1.85 }}
    >
      {children}
    </p>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 px-5 py-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-900 text-sm leading-relaxed">
      {children}
    </div>
  );
}

export default function ShippingAnNpmPackage() {
  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        background: "#fafaf9",
        color: "#1c1917",
      }}
    >
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
            href="https://www.npmjs.com/package/@vikranth2005/vtop-mcp"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            The package <ExternalLink size={14} />
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 rounded-full">
                Story
              </span>
              <span className="text-xs text-stone-400">10 min read</span>
            </div>
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900 mb-4"
              style={{ fontFamily: "var(--font-mono)", lineHeight: 1.1 }}
            >
              Shipping a tiny tool was
              <br />
              <span className="text-stone-500">harder than building it</span>
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed">
              I built a small thing in an afternoon and then spent two days
              trying to get it online. Most of that time had nothing to do with
              the code. Here is what actually happened, in plain words.
            </p>
          </header>

          <section>
            <SectionHeading>What I built</SectionHeading>
            <P>
              My college has a portal called VTOP. Attendance, marks,
              timetable, exam seats, all of it lives there behind a few clicks.
              I wanted to just ask for that stuff in normal language instead of
              navigating pages, so I wrote a small program that logs into VTOP
              and reads those pages for you. It plugs into AI assistants like
              Claude and Cursor as a tool they can call.
            </P>
            <P>
              Writing it was the quick part. The slow part was publishing it so
              anyone at my college could install it with one command. That is
              the part worth writing about.
            </P>
          </section>

          <section>
            <SectionHeading>It felt like working with a person</SectionHeading>
            <P>
              I did the whole thing with an AI assistant. The part that stayed
              with me was not that it wrote code. It was how much it acted like
              a slightly overconfident colleague.
            </P>
            <P>
              It would guess why something was broken, fix that guess, ship it,
              and the bug would still be there. Then it had to stop and admit
              the guess was wrong and look again. That happened more than once.
              When the login needed a captcha solved, it showed me the wobbly
              image and read the letters itself instead of making me type them.
              When login needed a password it did not have, it did not fall
              over. It just asked me in the chat, the way a person would.
            </P>
            <P>
              That is the real difference between a tool and a teammate. A tool
              stops when it hits something it did not expect. A teammate keeps
              going and tells you what it is unsure about. Watching it keep
              going was the interesting part.
            </P>
          </section>

          <section>
            <SectionHeading>What publishing even means</SectionHeading>
            <P>
              When you install something with a command like{" "}
              <code className="font-mono text-sm bg-stone-200 px-1.5 py-0.5 rounded">
                npm i something
              </code>
              , your computer downloads a small zipped parcel from a public
              warehouse. That warehouse is npm, basically an app store for
              code. The parcel is called a tarball.
            </P>
            <P>
              A tarball is exactly what it sounds like once you ignore the name.
              It is a folder squashed into one file so it can travel as a single
              thing, like vacuum sealing a packed bag. Publishing is sealing the
              bag and mailing it to the warehouse. Installing is someone getting
              the bag and unpacking it. That is the whole idea.
            </P>
            <P>
              The catch is that the bag remembers more than the clothes in it.
              It also remembers a small label on each item. One of those labels
              is where everything broke.
            </P>
          </section>

          <section>
            <SectionHeading>My computer could not ship it</SectionHeading>
            <P>
              The tool worked fine on my machine. I published it. People on Mac
              and Linux could use it. Anyone on Windows got a flat error saying
              the command was not recognised. It would not even start for them.
            </P>
            <P>
              The code was fine. The problem was one invisible label on one
              file inside the bag. The label says whether a file is just data
              or whether you are allowed to run it as a program.
            </P>
            <P>
              On Mac and Linux every file carries that little flag. A program
              needs the run me flag set. My tool was going out without it. So a
              Windows machine would unpack the bag, try to run the file, and
              find something that, going by the label, was not a program at
              all.
            </P>
            <Note>
              The annoying part: Windows has no idea this flag exists. So when
              you publish from Windows, your computer cannot set the run me flag
              even if you ask. It does not believe in the flag. Every time I
              published from my laptop the tool went out unflagged and broke
              for everyone else, no matter what I changed in the code.
            </Note>
            <P>
              That took a while to accept. The reason I could not ship a
              working tool had nothing to do with the tool. It was a property
              of the machine I was mailing it from.
            </P>
          </section>

          <section>
            <SectionHeading>The wrong turn</SectionHeading>
            <P>
              Before we found the real cause we chased a fake one. The tool had
              a name and the command to run it had a name and they did not
              quite match. That looked like a believable culprit, so we renamed
              things, shipped again, and it was still broken.
            </P>
            <P>
              We had pattern matched. We saw something that looked like a known
              kind of problem and fixed it without checking it was the problem.
              The real fix only showed up when we stopped guessing, installed
              the published parcel ourselves, and looked at the actual label on
              the actual file. The missing flag was sitting right there.
            </P>
            <P>
              The most useful thing I did all week was boring. Reproduce the
              failure exactly, then look at what is really there instead of
              what I assumed was there. Every hour I lost was an hour spent
              fixing a theory I never bothered to check.
            </P>
          </section>

          <section>
            <SectionHeading>Letting a clean machine mail it</SectionHeading>
            <P>
              If my Windows laptop cannot set the run me flag, the answer is to
              not mail the bag from my laptop. Instead, every time I want to
              release, a fresh Linux machine starts up in the cloud, builds the
              tool, sets the flag properly, checks that it starts, and mails it.
              Then it shuts down.
            </P>
            <P>
              That is all CI really is. A clean machine that does the release
              the same careful way every time, so a messy laptop is never part
              of it. I push a version tag and the machine does the rest.
            </P>
            <P>
              There was a smaller question hiding here. How does the warehouse
              know the machine is me and not someone pretending to be me. The
              old way was a long password you paste into the machine. The newer
              way, which I used, is more like a trusted handshake. The warehouse
              and the place the code lives vouch for each other directly, so
              there is no secret to leak or to forget to renew.
            </P>
          </section>

          <section>
            <SectionHeading>A receipt nobody can fake</SectionHeading>
            <P>
              The machine also attaches a receipt. It states, publicly and with
              cryptography, that this exact parcel was built from this exact
              code by this exact machine. The name for that is provenance. If
              someone ever took over my account and shipped a poisoned version,
              they could not produce a matching receipt.
            </P>
            <P>
              The receipt only works if the code is public too, so I made the
              repository public. That sounds risky until you remember the built
              tool was already downloadable by anyone the moment it was
              published. Open source just lets people check it instead of
              trusting me. We did scan the whole history first to be sure no
              password was ever committed. It was clean.
            </P>
            <Note>
              Public also does not mean strangers can change your code. Reading
              and writing are different doors. Anyone can read it and suggest
              changes. Only I can merge and release.
            </Note>
          </section>

          <section>
            <SectionHeading>The small human stuff</SectionHeading>
            <P>
              Once the shipping was solved, the rest of the work was about how
              it feels to use. When the tool did not have your login saved, an
              early version replied with a wall of options, a guide to setting
              environment variables, and a question about which campus you were
              at. All correct. Completely tiring to read.
            </P>
            <P>
              The fix was not code. It was tone. We told the assistant to ask
              one short question, what is your username and password, and stop
              there. The tool got friendlier without getting any smarter, and
              that was the right trade.
            </P>
          </section>

          <section>
            <SectionHeading>What I would tell myself before starting</SectionHeading>
            <div className="my-6 space-y-4">
              <div className="border-l-4 border-amber-300 pl-5 py-2">
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  The code is rarely the hard part
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Building the thing took an afternoon. Shipping it correctly
                  for everyone took days. Packaging and distribution are real
                  work, not an afterthought.
                </p>
              </div>
              <div className="border-l-4 border-blue-300 pl-5 py-2">
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  Reproduce before you theorise
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Most of the time was lost fixing confident guesses. The dull
                  loop of reproduce, then look, is what actually closed it.
                </p>
              </div>
              <div className="border-l-4 border-emerald-300 pl-5 py-2">
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  Take yourself out of the release
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Works on my machine is a warning, not a win. A clean
                  automated release removes a whole class of bugs that come
                  from the machine and not the code.
                </p>
              </div>
              <div className="border-l-4 border-violet-300 pl-5 py-2">
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  Working with AI is managing a teammate
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  It is fast and sometimes confidently wrong, same as anyone.
                  The value is not blind trust. It is a partner that keeps
                  pulling the thread while you keep it honest.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="my-12 p-8 bg-stone-900 rounded-2xl text-center">
              <p className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mb-4">
                The tool was a few hundred lines.
                <br />
                <span className="text-amber-400">
                  Everything around it was the lesson.
                </span>
              </p>
              <p className="text-stone-400 text-sm max-w-md mx-auto">
                You can try the actual thing,{" "}
                <a
                  href="https://www.vikranth.space/labs/vtop-mcp"
                  className="text-amber-400 underline"
                >
                  vtop-mcp
                </a>
                , or read the code. The bug is fixed. The story was the point.
              </p>
            </div>
          </section>

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
