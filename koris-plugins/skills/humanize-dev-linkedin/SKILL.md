---
name: humanize-dev-linkedin
description: |
  Rewrite and humanize LinkedIn posts about personal dev projects, open-source tools,
  and engineering experiments. Strips out AI tells, corporate PR fluff, motivational
  broetry, emoji-bullet clutter, generic lessons, and fake engagement bait. Replaces
  them with high-signal technical specifics, honest trade-offs, and an authentic developer voice.
read_when:
  - user wants to write, polish, or humanize a LinkedIn post about a dev project or tool
  - asked to report or showcase personal coding projects on LinkedIn
  - drafting a post-mortem, benchmark result, or release announcement for LinkedIn
license: MIT
metadata:
  version: "1.0.0"
---

# Humanize Dev LinkedIn: Technical Project Reporting Without AI Cringe

Rewrite AI-generated or rough drafts of developer project updates into authentic, high-signal LinkedIn posts that engineers actually read and respect. Keep the technical facts, ditch the hype, and speak developer-to-developer.

---

## Why AI LinkedIn Posts Sound Unbearable to Developers

When a language model is asked to draft a LinkedIn post about a personal software project, it blends three synthetic archetypes:
1. **Corporate PR press release:** Inflated claims, buzzwords, and breathless self-congratulation (*"Thrilled to announce", "game-changing solution"*).
2. **Influencer "broetry":** One-sentence paragraphs, fake dramatic suspense, and motivational platitudes (*"Consistency is key", "I failed 100 times before it clicked"*).
3. **Algorithmic engagement farming:** Manufactured questions, emoji bullet laundry lists, and hashtag spam (*"What's your biggest tech challenge? Drop a comment below! 👇 #TechTrends #100DaysOfCode"*).

Software engineers scroll past this instantly. Real peer respect comes from **signal density**, **concrete technical mechanisms**, and **intellectual honesty** (what broke, why you made a specific trade-off, and what the tool *cannot* do yet).

---

## Core Rules

1. **Signal over spectacle.** One concrete latency number, an unexpected compiler quirk, or a 4-line architectural diff is worth a dozen adjectives like *"cutting-edge"* or *"seamless"*.
2. **Never invent technical facts.** If a draft says *"boosted performance"*, ask the user by how much (e.g., from 350ms to 40ms) or state the mechanism without inventing numbers. Never invent benchmarks, architecture components, or production traffic.
3. **Flaws and trade-offs build credibility.** Real software has limitations (e.g., *"single-threaded for now"*, *"high memory usage under heavy load"*, *"no Windows support yet"*). Mentioning constraints makes a post 10x more believable than claiming perfection.
4. **Write for a peer on a coffee break.** Talk like you're showing a cool project to a fellow engineer at a tech meetup or in a team Slack channel—curious, pragmatic, candid, and direct.

---

## How to Work

1. **Mark and strip the tells.** Audit the draft against the catalog below. Cut opening announcements, emoji bullet lists, broetry line breaks, generic aphorisms, and engagement bait.
2. **Extract the 4 Technical Anchors:**
   - **The Trigger:** What specific annoyance, curiosity, or bottleneck started this? (*"Got tired of waiting 3 minutes for Docker builds in CI."*)
   - **The Mechanism:** What is the actual technical solution? (*"Wrote a small CLI in Go that hashes dependencies and caches build layers in S3."*)
   - **The Roadblock / Trade-off:** What was the hardest bug, weird edge case, or deliberate compromise? (*"Ran into race conditions when multiple workers write to the cache simultaneously; solved it with optimistic concurrency using S3 ETags."*)
   - **The Artifact & Status:** What is the current state, where is the code, and what specific feedback or test case are you looking for?
3. **Draft the rewrite.** Format into natural, readable paragraphs (1–3 sentences each). Use clean dashes (`-`) if listing specs. Eliminate emojis unless 1 or 2 are natural context markers (e.g., a terminal symbol).
4. **Run the Anti-Pattern Checklist.** Verify that none of the 14 tells survived the rewrite.

---

## Catalog of Tells & Anti-Patterns

### A. Openers & Staged Emotion

#### 1. The Synthetic Announcement Opening
- **Watch for:** *"Excited to share"*, *"Thrilled to announce"*, *"Proud to unveil"*, *"Humbled and honored"*, *"Big news!"*, *"Today marks an exciting milestone"*, *"I'm ecstatic to present"*.
- **Problem:** Reads like a corporate marketing department or an automated bot. In LinkedIn's feed, only the first 2–3 lines appear before the "see more" cutoff. Wasting them on synthetic excitement guarantees readers scroll past.
- **Before:**
  > 🚀 Excited to share that I just published my latest open-source project! After weeks of hard work, I'm thrilled to introduce QueryPulse, a lightweight database monitor for PostgreSQL.
- **After:**
  > I got tired of slow query logs filling up our disks, so I built QueryPulse—a single-binary CLI that samples `pg_stat_statements` every 10 seconds and renders query percentiles in your terminal.

#### 2. The Motivational Broetry Hook
- **Watch for:** *"Most developers get this wrong."*, *"Coding is not just about writing syntax."*, *"I locked myself in a room for 3 months."*, *"They said building an engine from scratch was impossible."*, *"Failure is the greatest teacher."*
- **Problem:** Manufactured melodrama. It treats an engineering project like a hero's journey instead of a technical accomplishment.
- **Before:**
  > Most developers think state management is solved.
  >
  > They are wrong.
  >
  > I spent the last 4 weekends fighting Redux boilerplate until I couldn't take it anymore.
- **After:**
  > Most state management libraries trade bundle size for developer ergonomics. I wanted to see if I could build a reactive store in under 1KB with TypeScript type inference intact.

#### 3. The Grand Global Preamble
- **Watch for:** *"In today's fast-paced tech landscape..."*, *"With AI reshaping how we build software..."*, *"As developers, we are constantly striving for efficiency..."*
- **Problem:** Empty throat-clearing that has nothing to do with the specific project. Jump straight into the problem.
- **Before:**
  > In today's rapidly evolving cloud landscape, managing infrastructure complexity has become more challenging than ever. That's why I created KubeSnap.
- **After:**
  > KubeSnap is a tiny TUI to diff Kubernetes manifests against live cluster state without running `kubectl diff` three times in a row.

---

### B. Formatting & Algorithmic Noise

#### 4. Broetry Spacing (One Sentence Per Line)
- **Watch for:** Every single sentence followed by a double line break, or short dramatic sentence fragments (*"And then." / "Boom." / "It broke."*).
- **Problem:** An algorithm-gaming layout trick from 2021 that screams LinkedIn influencer. It interrupts reading flow and makes technical explanations impossible to follow.
- **Before:**
  > I hit a wall.
  >
  > The database crashed.
  >
  > 10,000 requests per second was too much.
  >
  > I needed a solution.
  >
  > Fast.
- **After:**
  > At 10,000 requests/sec, the connection pool was exhausting PostgreSQL's max client limit. I added a lightweight PgBouncer proxy with transaction pooling, which dropped connection overhead by 85%.

#### 5. Emoji Bullet Laundry Lists
- **Watch for:** Bullet points prefixed with: 🚀 💡 🛠️ ⚡ 🔍 📈 🧠 📌 🎯 🔥 💻.
- **Problem:** The signature mark of a generic ChatGPT prompt response (*"summarize with bullet points and emojis"*). It dilutes technical credibility.
- **Before:**
  > 🛠️ Tech Stack: Rust, Tokio, Axum
  > ⚡ Performance: Sub-millisecond latency
  > 💡 Key Feature: Zero-copy deserialization
  > 🎯 Goal: Simplify high-throughput streaming
- **After:**
  > The server is written in Rust using Axum and Tokio. By switching to zero-copy deserialization with `rkyv`, round-trip latency dropped from 1.8ms to ~320µs on local benchmarks.

#### 6. Hashtag Vomit
- **Watch for:** A block of 8–15 generic hashtags at the bottom (*#SoftwareEngineering #WebDevelopment #Programming #Tech #Innovation #100DaysOfCode #Coding #DeveloperLife #CareerGrowth #OpenSource*).
- **Problem:** Clutters the post and signals spam. LinkedIn's algorithm no longer rewards keyword stuffing. Use zero hashtags, or at most 2–3 specific technical tags (e.g., `#rust #postgres`).
- **Before:**
  > #Coding #Developer #Tech #WebDev #JavaScript #TypeScript #React #SoftwareEngineering #OpenSource #FullStack #BuildInPublic #Innovation
- **After:**
  > (Omit hashtags, or use only: `#typescript #react`)

#### 7. Fake Engagement Bait Closers
- **Watch for:** *"What are your thoughts? Drop them in the comments below! 👇"*, *"Agree or disagree?"*, *"How do you handle X in your stack?"*, *"Let me know your favorite tool!"*, *"Drop a 🔥 if you want a tutorial!"*
- **Problem:** Insults the reader's intelligence with transparent engagement farming. Instead, invite authentic technical critique, bug reports, or link to the repo.
- **Before:**
  > What is your biggest challenge when debugging distributed systems? Let me know in the comments below! Don't forget to like and share! 👇
- **After:**
  > The repo is up at github.com/username/project. If you run distributed tracing on Nomad or bare metal, I'd appreciate feedback on the OTLP exporter implementation.

---

### C. Jargon, Hyperbole & Pseudo-Philosophy

#### 8. Corporate Adjectives and Buzzwords
- **Watch for:** *seamless, robust, cutting-edge, game-changer, revolutionary, elevate, unlock, powerhouse, supercharge, state-of-the-art, hassle-free, bespoke, next-level*.
- **Problem:** Advertorial fluff that hides what the code actually does. Replace adjectives with metrics or mechanical descriptions.
- **Before:**
  > Built a cutting-edge, robust solution that seamlessly elevates the developer experience and supercharges workflow productivity.
- **After:**
  > Built a file watcher daemon that rebuilds Go binaries and restarts the server in ~180ms, replacing our slow nodemon/air workflow.

#### 9. Not X but Y & Pseudo-Philosophical Aphorisms
- **Watch for:** *"It's not just a tool; it's a paradigm shift."*, *"It wasn't about the code; it was about the architecture."*, *"At its core, software engineering is about empathy."*
- **Problem:** Staged profundity that avoids making a verifiable claim. State the technical point directly.
- **Before:**
  > Building this wasn't just about parsing ASTs; it was about reimagining how developers interact with their codebases on a fundamental level.
- **After:**
  > I used Babel's AST parser to automatically identify unused exported functions across monorepo packages.

#### 10. Stock Motivational "Key Takeaways"
- **Watch for:** *"3 lessons I learned: 1. Consistency is key 2. Don't be afraid to fail 3. Community is everything"*.
- **Problem:** Generic fortune-cookie filler that could apply to fitness, sales, or baking. Technical takeaways should talk about code, concurrency, memory, API design, or deployment reality.
- **Before:**
  > Key Takeaways from this project:
  > 1. Always keep learning 🧠
  > 2. Hard work pays off 💪
  > 3. Embrace the bugs 🐛
- **After:**
  > Two things I learned the hard way:
  > - SQLite WAL mode requires all readers and writers to share the same filesystem; running it across NFS or Docker network volumes corrupts headers.
  > - `JSON.parse` is significantly faster than custom recursive regex parsers for nested payloads under 50KB.

#### 11. Vague Architectural Claims
- **Watch for:** *"Leveraging microservices for maximum scalability"*, *"Implemented an intelligent caching strategy"*, *"Designed with security and performance in mind"*.
- **Problem:** Sounds like an MBA deck. Specify the exact library, protocol, or data structure.
- **Before:**
  > Implemented an intelligent caching mechanism to optimize data retrieval speeds.
- **After:**
  > Added an in-memory LRU cache with a 5-minute TTL to store resolved DNS records, preventing redundant UDP lookups.

#### 12. Em-Dash Addiction (—)
- **Watch for:** Two or three em-dashes per post connecting fragmented thoughts.
- **Problem:** LLMs use em-dashes to avoid committing to sentence structure. Replace with commas, colons, or clean periods.
- **Before:**
  > The tool parses the schema — validating every field in parallel — and outputs the migration script — saving hours of manual work.
- **After:**
  > The tool parses the schema, validates every field in parallel, and outputs the migration script.

---

### D. Technical Authenticity & Polish

#### 13. Erasing Rough Edges (The "It's Flawless" Lie)
- **Watch for:** Claims that the project is completely done, production-ready, or categorically better than mature tools with hundreds of contributors.
- **Problem:** Destroys technical credibility. Senior engineers immediately look for trade-offs. Stating what is missing or broken proves engineering maturity.
- **Before:**
  > The ultimate replacement for Docker Compose. Zero bugs, blazing fast, and 100% production ready!
- **After:**
  > It handles simple multi-container web apps much faster than Compose, but it doesn't support bridge networks or swarm mode yet. Good for local testing, not for production deployments.

#### 14. Missing Links or Proof
- **Watch for:** Describing an open-source tool without linking to the repository, or claiming a speedup without showing how to reproduce it or attaching a screenshot/demo.
- **Problem:** If there's no code or visual proof, developers assume it's vaporware or conceptual AI slop.
- **Rule:** Always end with a clean link to GitHub / npm / demo, or specify that a video/screenshot is attached.

---

## Post Archetypes & Templates

### Archetype 1: The "Scratch My Own Itch" Tool
Use when building a CLI, library, or small app to solve a problem you personally experienced.

```markdown
[Specific friction or annoying problem in daily dev work].

I built [Project Name] to handle this: [1-sentence mechanical description of what it does].

How it works under the hood:
- [Key architectural choice 1]
- [Key architectural choice 2]

[1 honest trade-off or current limitation].

Code is open source on GitHub: [link]
```

### Archetype 2: The "Deep Dive Bug & Fix"
Use when a weird bug, performance regression, or tricky edge case taught you something non-obvious.

```markdown
Spent [time] debugging [weird symptom or error].

Initial hunch was [plausible failed hypothesis], but [evidence why it was wrong].

Root cause: [concrete technical explanation of the real mechanism].

Fixed it by [solution].

[1-sentence rule of thumb or tip for anyone running the same stack].
```

### Archetype 3: The "Benchmark & Performance Optimization"
Use when you profiled and sped up an existing project or rewrote a subsystem.

```markdown
[Original state and baseline metric: e.g., "Our indexing job was taking 45 minutes on 2M records"].

Flamegraph profiling showed [surprising bottleneck].

What I changed:
1. [Specific architectural or code change]
2. [Data structure or concurrency adjustment]

Result: [New metric: e.g., "Down to 4.2 minutes (10x faster), with CPU usage dropped by half"].

[Trade-off: e.g., "Memory consumption increased by ~150MB due to pre-allocated buffers"].

Detailed writeup and benchmark scripts: [link]
```

---

## Output Formats

### Direct Rewrite (Default)
When given a draft:
1. **The Humanized Post:** Ready to copy-paste directly to LinkedIn.
2. **Key Edits Made:** 2–3 bullet points highlighting what fluff was removed and what technical signal was sharpened.
3. **Missing Context Check:** Note if any concrete numbers, versions, or links should be filled in before publishing.
