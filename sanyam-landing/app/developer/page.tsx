import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer | Sanyam",
  description: "Meet Swaraj Puppalwar, UltronTheAI, founder and CTO building Sanyam and other real-world systems.",
};

const links = [
  ["Portfolio", "https://ultron-the-ai.vercel.app/"],
  ["Lioran Group", "https://lioran.group/"],
  ["GitHub", "https://github.com/UltronTheAI"],
  ["Twitter", "https://twitter.com/PuppalwarSwaraj"],
  ["Instagram", "https://www.instagram.com/pro_epic_programmer/"],
  ["YouTube", "https://www.youtube.com/@proepiccoder"],
];

const projects = [
  "Post-Acle: ~100 monthly active readers across India, USA, China, and more.",
  "Vortexly: private social network with 23 friends, 17 active users, 98 posts, and 16 reels.",
  "Hushar Spreadsheet: AI school data MVP used by 11 teachers and earning early revenue.",
];

const stack = ["React", "Next.js", "React Native", "Nest.js", "TypeScript", "MongoDB", "Redis", "PostgreSQL", "Docker", "Kubernetes", "Rust", "LangGraph"];

export default function DeveloperPage() {
  return (
    <main className="min-h-screen bg-[#050608] px-5 py-8 text-zinc-100 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3">
          <Link href="/" className="font-black">
            ← Sanyam
          </Link>
          <a href="https://github.com/UltronTheAI/Sanyam/" className="rounded-full bg-lime-300 px-4 py-2 font-black text-black">
            Repo
          </a>
        </nav>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 sm:p-10">
          <p className="font-black text-lime-300">👋 Developer page, but make it less LinkedIn zombie</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">
            Swaraj Puppalwar
            <span className="block text-zinc-400">aka UltronTheAI</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Full-stack web developer, Founder & CTO of Lioran Group, and builder of systems that
            hopefully do not collapse like a biscuit in chai. Started tech at 11, now focused on
            backend engineering, architecture, infrastructure, and shipping real products.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Why Sanyam?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Because the CTO also has a phone goblin problem. Too much screen time, too many bad
              habits, too many “just five minutes” lies. Sanyam is the personal guardrail to become
              the person he actually wants to be.
            </p>
          </div>

          <div className="rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-6">
            <Image
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWR5cmwyNGx6Z2k3ZTRtd3czdzRtaXRnN2lvZDR0cXB0eHExN2MzbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7btPCcdNniyf0ArS/giphy.gif"
              alt="Lock in meme"
              width={640}
              height={360}
              unoptimized
              className="h-64 w-full rounded-3xl object-cover"
            />
            <p className="mt-4 font-black text-lime-100">Actual footage of trying to lock in.</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <h2 className="text-3xl font-black">Real stuff he built</h2>
          <div className="mt-5 grid gap-3">
            {projects.map((project) => (
              <p key={project} className="rounded-2xl bg-black/30 p-4 text-zinc-300">
                {project}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <h2 className="text-3xl font-black">Tech backpack 🎒</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Find him on the internet</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="rounded-2xl bg-white/10 p-4 font-bold hover:bg-white/15">
                {label} →
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
