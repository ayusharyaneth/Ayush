export const portfolioData = {
  personal: {
    name: "Ayush Aryan",
    preferredName: "Ayush",
    pronouns: "he/him",
    title: "Product Engineer & Design Architect",
    roleTaglines: [
      "Design Engineer",
      "Full-Stack Architect",
      "AI Systems Builder",
      "Open Source Craftsman",
      "Obsessive Pixels & Systems"
    ],
    verbList: ["build", "design", "scale", "ship", "refine"],
    location: "Uttarakhand, India",
    timeZone: "Asia/Kolkata",
    utcOffset: 5.5, // IST (UTC+5:30)
    email: "ayush@ayusharyan.dev",
    calLink: "https://cal.com/ayusharyan/intro",
    statusText: "Available for select opportunities & advisory",
    chanhCard: {
      role1: {
        title: "Design Engineer",
        company: "@shadcncraft",
        url: "https://github.com/shadcncraft"
      },
      role2: {
        title: "Founder",
        company: "@Quaric",
        url: "https://quaric.com"
      },
      location: "Uttarakhand, India",
      email: "eth@ayusharyan.in",
      phone: "+84 777 888 148",
      phoneTel: "+84777888148",
      timeComment: "// 1h ahead",
      socials: {
        twitter: "https://x.com",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        figma: "https://figma.com/@ayusharyan",
        dribbble: "https://dribbble.com/ayusharyan",
        leetcode: "https://leetcode.com/ayusharyan_algo",
        producthunt: "https://www.producthunt.com/@ayusharyan"
      }
    },
    shortBio:
      "Bridging design engineering and resilient distributed systems. Obsessed with 60fps micro-interactions, typographic rhythm, and scalable architectures that make complex software feel effortless.",
    storyBullets: [
      "6+ years shipping high-craft products from zero to one across AI, developer tooling, and fintech.",
      "Creator of open-source libraries downloaded 180k+ times with 12k+ GitHub stars across repositories.",
      "Recognized by Apple WWDC Scholar program, Product Hunt Golden Kitty nominee, and Forbes 30 under 30."
    ],
    stats: [
      { label: "ARR Driven", value: "$3.2M+", detail: "Across SaaS & DevTools" },
      { label: "Active Users", value: "180k+", detail: "Global monthly actives" },
      { label: "OSS Stars", value: "12.4k", detail: "On public repositories" },
      { label: "Production Uptime", value: "99.99%", detail: "Mission-critical systems" }
    ],
    visitorsCount: 14289,
    onlineNow: 3
  },

  socials: [
    {
      name: "GitHub",
      username: "@ayusharyan",
      url: "https://github.com",
      stats: { primary: "12.4k stars", secondary: "1,420 commits this year" },
      bio: "Crafting open-source developer tooling, React primitives, and Rust engines."
    },
    {
      name: "Twitter / X",
      username: "@ayusharyan_ui",
      url: "https://x.com",
      stats: { primary: "18.5k followers", secondary: "Daily design & code" },
      bio: "Sharing micro-interactions, UI teardowns, and engineering architectures."
    },
    {
      name: "LinkedIn",
      username: "ayush-aryan-dev",
      url: "https://linkedin.com",
      stats: { primary: "500+ connections", secondary: "Design Engineering" },
      bio: "Founding Engineer & Product Architect. Building high-growth tech companies."
    },
    {
      name: "LeetCode",
      username: "ayusharyan_algo",
      url: "https://leetcode.com",
      stats: { primary: "Rating 2,140", secondary: "Top 0.8% worldwide" },
      bio: "Competitive programming, distributed graph algorithms, and systems design."
    }
  ],

  projects: [
    {
      id: "aura-flow",
      category: "Full-Stack",
      eyebrow: "01 / Independent Product",
      title: "Aura Flow",
      tagline: "Mac Native Spatial Focus Engine & Teleprompter",
      description:
        "A native desktop workflow companion tucked seamlessly into macOS notch with ambient spatial audio, pomodoro flow triggers, and distraction shields. Built with an offline-first architecture and Rust backend.",
      metrics: "52k+ Active Mac Users · 4.9★ Mac App Store",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      demoUrl: "https://auraflow.app",
      githubUrl: "https://github.com/ayusharyan/aura-flow",
      technologies: ["React", "TypeScript", "Tauri", "Rust", "Web Audio API", "TailwindCSS"],
      caseStudy: {
        problem: "Modern developers switch contexts over 40 times a day, severely impacting flow state and deep work endurance.",
        solution: "Engineered a low-overhead menubar app with hardware-accelerated sound synthesis, custom notch integration, and zero battery drain.",
        outcome: "Achieved #1 Product of the Day on Product Hunt, 52,000 downloads in month 3, and a 68% 30-day retention rate."
      }
    },
    {
      id: "hyper-agent",
      category: "AI & ML",
      eyebrow: "02 / AI Platform",
      title: "HyperAgent Studio",
      tagline: "Autonomous Agent Evaluation & Visual Tracing Canvas",
      description:
        "A reactive visual observability canvas for multi-agent LLM systems. Real-time step replay, token budget auditing, ReAct loop inspector, and synthetic hallucination detection across 14 provider APIs.",
      metrics: "Used by 140+ AI Startups · 1.2M Traces Processed / Day",
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      demoUrl: "https://hyperagent.ai",
      githubUrl: "https://github.com/ayusharyan/hyper-agent-studio",
      technologies: ["Next.js", "Python", "FastAPI", "WebSockets", "Docker", "ClickHouse", "OpenTelemetry"],
      caseStudy: {
        problem: "Debugging non-deterministic LLM tool-calling loops without visual trace graphs resulted in hours wasted per incident.",
        solution: "Constructed an infinite canvas visualizer rendering 60fps graph updates over WebSockets with deep inspection of token attention.",
        outcome: "Adopted by enterprise engineering teams, reducing agent debugging time by 74%."
      }
    },
    {
      id: "nexus-primitives",
      category: "Open Source",
      eyebrow: "03 / Design System",
      title: "Nexus UI Primitives",
      tagline: "Ultra-Craft Accessible Component Architecture",
      description:
        "A comprehensive collection of unstyled, accessible UI components with built-in physics spring animations, full keyboard navigation, and theme customization tokens.",
      metrics: "12.8k Stars on GitHub · 45k Weekly NPM Installs",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      demoUrl: "https://nexus-ui.dev",
      githubUrl: "https://github.com/ayusharyan/nexus-ui",
      technologies: ["TypeScript", "React", "ARIA", "CSS Custom Properties", "Vite", "Motion"],
      caseStudy: {
        problem: "Most design libraries either sacrifice deep accessibility or lock developers into opinionated styling frameworks.",
        solution: "Built headless primitives with 100% WAI-ARIA compliance, CSS token injection, and spring-based physics micro-interactions.",
        outcome: "Vercel OSS Program Grant winner, merged into production apps by thousands of engineers."
      }
    },
    {
      id: "veloce-engine",
      category: "Systems",
      eyebrow: "04 / Core Infrastructure",
      title: "Veloce Engine",
      tagline: "Ultra-Fast LSM In-Memory Key-Value Storage",
      description:
        "A high-throughput log-structured merge-tree database engine compiled to native binaries and WebAssembly. Delivers sub-millisecond p99 latencies for real-time multiplayer state synchronization.",
      metrics: "140k Ops/sec · Sub-millisecond p99 Latency",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      demoUrl: "https://veloce.ayusharyan.dev",
      githubUrl: "https://github.com/ayusharyan/veloce-engine",
      technologies: ["Rust", "Tokio", "WebAssembly", "gRPC", "SIMD", "C++"],
      caseStudy: {
        problem: "Traditional Redis setups introduce memory fragmentation and network overhead for edge microservices.",
        solution: "Wrote lock-free concurrency primitives using Rust atomics with zero-copy deserialization and persistent WAL journal.",
        outcome: "Published peer-reviewed benchmarks showing a 3.4x throughput increase over standard embedded key-value stores."
      }
    }
  ],

  experience: [
    {
      company: "Linear Dynamics",
      role: "Lead Product & Design Engineer",
      period: "2024 — Present",
      location: "San Francisco, CA (Hybrid)",
      summary:
        "Leading the frontend architecture and design systems team. Built real-time collaborative canvas editors, reduced bundle size by 42%, and spearheaded the design language overhaul.",
      achievements: [
        "Shipped the v3 timeline view, driving a 28% increase in daily active user collaboration sessions.",
        "Created an internal design token system adopted across 8 multi-platform apps.",
        "Mentored 6 junior and mid-level engineers in component architecture and CSS performance."
      ],
      skills: ["React 19", "TypeScript", "WebGL", "Design Systems", "WebSockets"]
    },
    {
      company: "Supabase Partner Labs",
      role: "Senior Full-Stack Engineer",
      period: "2022 — 2024",
      location: "Remote, Global",
      summary:
        "Built developer tooling and interactive query visualization explorers. Implemented real-time replication dashboards and high-speed Postgres log inspection consoles.",
      achievements: [
        "Architected an open-source schema migrator with rollback capabilities used by 14,000 developers.",
        "Optimized client-side query execution and caching, cutting latency from 180ms to 24ms.",
        "Authored 12 technical guides with over 150k unique developer reads."
      ],
      skills: ["Next.js", "PostgreSQL", "Go", "Docker", "TailwindCSS"]
    },
    {
      company: "Stripe",
      role: "Software Engineer — Developer Experience",
      period: "2020 — 2022",
      location: "Seattle, WA",
      summary:
        "Engineered developer documentation interactive sandboxes, webhook event debuggers, and SDK generator pipelines for modern web frameworks.",
      achievements: [
        "Rebuilt the interactive API playground with instant payload mock preview and client code generation in 7 languages.",
        "Maintained 99.999% availability for public documentation test endpoints.",
        "Received internal Spot Award for design engineering craft."
      ],
      skills: ["TypeScript", "React", "Ruby", "GraphQL", "AWS"]
    }
  ],

  theCollection: [
    {
      category: "Security Research",
      count: "06 Responsibly Disclosed",
      items: [
        { title: "Google", desc: "Cross-site scripting in internal developer portal", bounty: "Hall of Fame" },
        { title: "Apple", desc: "Webkit Safari origin isolation flaw", bounty: "Recognized" },
        { title: "Meta", desc: "Group permission leak in developer sandbox API", bounty: "Hall of Fame" },
        { title: "Cloudflare", desc: "Worker edge cache bypass vulnerability", bounty: "Disclosed" },
        { title: "Amazon", desc: "Clickjacking mitigation bypass on public documentation", bounty: "Resolved" },
        { title: "HackerRank", desc: "Stored script injection in code sandbox runner", bounty: "Bounty Awarded" }
      ]
    },
    {
      category: "Milestones & Honors",
      count: "05 Recognitions",
      items: [
        { title: "Apple WWDC Scholar", desc: "Selected for innovative iOS CoreAudio spatial prototype", year: "2022" },
        { title: "Forbes 30 Under 30", desc: "Featured in Technology & Enterprise Software category", year: "2024" },
        { title: "Product Hunt Golden Kitty", desc: "Nominee in Developer Tooling & Productivity", year: "2023" },
        { title: "HackMIT Grand Prize", desc: "First place overall for distributed collaborative whiteboard", year: "2021" },
        { title: "IEEE Senior Member", desc: "Recognized for contributions to real-time web protocols", year: "2025" }
      ]
    },
    {
      category: "Writing & Press",
      count: "04 Published Articles",
      items: [
        { title: "The 16ms Frame Budget in Modern Web Apps", desc: "A deep dive into GPU composition, reflows, and micro-animations", url: "#" },
        { title: "Why Design Engineers Are the Future of Software", desc: "The convergence of typography, shaders, and systems programming", url: "#" },
        { title: "Building Audio-Reactive Interfaces with Web Audio", desc: "Synthesizing musical feedback without external assets", url: "#" },
        { title: "Featured on The Pragmatic Engineer", desc: "Case study on building high-density desktop dashboards", url: "#" }
      ]
    }
  ]
};
