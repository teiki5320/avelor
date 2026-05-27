export default function FicheLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="animate-pulse space-y-6">
        <div className="glass card-top-line h-32 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-soft h-28 rounded-2xl" />
          <div className="glass-soft h-28 rounded-2xl" />
          <div className="glass-soft h-28 rounded-2xl" />
          <div className="glass-soft h-28 rounded-2xl" />
        </div>
        <div className="glass h-48 rounded-2xl" />
        <div className="glass h-48 rounded-2xl" />
      </div>
    </div>
  );
}
