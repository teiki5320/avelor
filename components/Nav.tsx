import Link from 'next/link';

export default function Nav() {
  return (
    <header className="fixed top-4 left-1/2 z-40 -translate-x-1/2">
      <nav className="pill-nav flex items-center gap-6 px-5 py-2.5 sm:px-7 sm:py-3">
        <Link
          href="/"
          className="font-display text-lg sm:text-xl tracking-wide text-navy"
        >
          AVELOR
        </Link>
        <span className="hidden text-sm text-navy/60 sm:inline">
          Aide discrète aux dirigeants
        </span>
      </nav>
    </header>
  );
}
