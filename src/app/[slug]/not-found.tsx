export default function ProfileNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center text-white">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-white/70">
        This link page does not exist yet.
      </p>
      <a
        href="/"
        className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-900"
      >
        Create your own page
      </a>
    </div>
  );
}
