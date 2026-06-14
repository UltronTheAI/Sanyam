import Image from "next/image";
import Link from "next/link";

const githubUrl = "https://github.com/UltronTheAI/Sanyam/";

const features = [
  ["💧", "Water every hour", "Hydrate like a responsible houseplant."],
  ["😴", "Sleep mode", "No 2 AM doom-scroll boss fight."],
  ["📵", "Break timer", "20 min screen → tiny grass-touching ceremony."],
  ["🚫", "Adult-site blocker", "Because future-you asked for backup."],
];

const tags = ["Android-only", "Expo SDK 56", "React Native", "Digital Wellbeing", "Tiny rectangle goblin"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.24),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.2),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(250,204,21,0.16),transparent_34%)]" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 py-8 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <Link href="/" className="text-lg font-black tracking-tight">
            🧘 Sanyam
          </Link>
          <div className="flex items-center gap-3 text-sm font-bold">
            <Link href="/developer" className="text-zinc-300 hover:text-white">
              Developer
            </Link>
            <a href={githubUrl} className="rounded-full bg-white px-4 py-2 text-black hover:bg-lime-200">
              GitHub
            </a>
          </div>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-2 text-sm font-bold text-lime-200">
              For people fighting the tiny rectangle goblin
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
                Sanyam tells your phone:
                <span className="block text-lime-300">“bro, behave.”</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                A simple Android self-discipline app for breaks, sleep blocking, water reminders,
                and safer browsing. Built because screen time was getting goofy.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={githubUrl}
                className="rounded-2xl bg-lime-300 px-6 py-4 text-center font-black text-black shadow-[0_0_40px_rgba(190,242,100,0.25)] hover:bg-lime-200"
              >
                Download APK
              </a>
              <a
                href={githubUrl}
                className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-center font-black text-white hover:bg-white/15"
              >
                View GitHub Repo
              </a>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
            <Image
              src="/smp.png"
              alt="Sanyam app preview"
              width={1200}
              height={630}
              priority
              className="rounded-[1.5rem] border border-white/10 object-cover"
            />
            <p className="mt-4 text-center text-sm font-bold text-zinc-400">
              Preview image looking dramatic, app trying not to spill chai.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          {features.map(([emoji, title, text]) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
              <div className="text-4xl">{emoji}</div>
              <h2 className="mt-5 text-xl font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Why this exists?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              The founder wanted to become the person he dreams about. But the phone was like:
              “one more reel?” So Sanyam became the calm bouncer for bad habits.
            </p>
            <ul className="mt-5 space-y-3 text-zinc-300">
              <li>✅ drink water every hour, except sleep time because please shut up app</li>
              <li>✅ reduce huge screen time without turning life into jail</li>
              <li>✅ reduce adult-content rabbit holes forever-ish</li>
              <li>✅ build your own because noisy blocker apps were doing notification warfare</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-6">
            <Image
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXdpNWxyNzVjOWV4ZnhmbGtibDhlNGJkaXNwYzRlcDhqbTh1bXI4dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JIX9t2j0ZTN9S/giphy.gif"
              alt="Typing cat meme"
              width={640}
              height={360}
              unoptimized
              className="h-64 w-full rounded-3xl object-cover"
            />
            <p className="mt-4 text-lg font-black text-yellow-100">
              Me building Sanyam after losing another hour to nonsense.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 text-center">
          <h2 className="text-3xl font-black">Tiny safety note 🛟</h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-300">
            Sanyam includes an emergency unlock because discipline should not become a horror movie.
            Default code: <span className="font-black text-lime-300">1441</span>.
          </p>
        </section>
      </section>
    </main>
  );
}
