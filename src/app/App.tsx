import { AlertTriangle, HeartHandshake, Rocket, Star } from "lucide-react";
import { ErrorBoundary } from "../shared/ui/ErrorBoundary";
import { SimulatorPage } from "../features/simulator/SimulatorPage";
import { buildInfo } from "../shared/config/buildInfo";
import { usePublishedCommit } from "../shared/config/usePublishedCommit";

export function App() {
  const publishedCommit = usePublishedCommit();
  const displayCommit = publishedCommit.data ?? buildInfo.commit;

  return (
    <ErrorBoundary
      fallback={
        <main className="min-h-screen bg-coal p-6 text-white">
          <section className="mx-auto max-w-3xl rounded-lg border border-ember/50 bg-panel p-6">
            <div className="flex items-center gap-3 text-ember">
              <AlertTriangle aria-hidden="true" />
              <h1 className="text-xl font-semibold">Simulator halted</h1>
            </div>
            <p className="mt-3 text-sm text-white/72">
              Refresh the page and try another stellar mass.
            </p>
          </section>
        </main>
      }
    >
      <div className="min-h-screen bg-coal text-white">
        <header className="border-b border-line bg-coal/95">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <a
              href={buildInfo.pagesUrl}
              className="flex min-w-0 items-center gap-3"
              aria-label="Stellar Evolution Simulator home"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-cyan/40 bg-ink text-corona">
                <Rocket size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold leading-tight">
                  Stellar Evolution Simulator
                </span>
                <span className="block text-sm text-white/58">
                  v{buildInfo.version} · {displayCommit}
                </span>
              </span>
            </a>
            <nav
              aria-label="Project links"
              className="flex flex-wrap items-center gap-2"
            >
              <a
                className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-white transition hover:border-cyan/70 hover:text-cyan focus:outline-none focus:ring-2 focus:ring-cyan"
                href={buildInfo.repoUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Star size={17} aria-hidden="true" />
                Star repo
              </a>
              <a
                className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-white transition hover:border-plasma/70 hover:text-plasma focus:outline-none focus:ring-2 focus:ring-plasma"
                href={buildInfo.paypalUrl}
                target="_blank"
                rel="noreferrer"
              >
                <HeartHandshake size={17} aria-hidden="true" />
                Support
              </a>
            </nav>
          </div>
        </header>
        <SimulatorPage />
        <footer className="border-t border-line bg-coal px-4 py-5 text-sm text-white/58 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>
              MESA-inspired educational model. Not publication-grade astrophysics.
            </span>
            <span>
              Version {buildInfo.version} · Commit {displayCommit}
            </span>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
