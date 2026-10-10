export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-navy/20 border-t-bleu-fonce" />
        <p className="mt-4 text-sm text-navy/50">Chargement…</p>
      </div>
    </div>
  );
}
