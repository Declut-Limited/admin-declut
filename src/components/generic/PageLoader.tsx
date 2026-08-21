export default function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-950">
      <div
        className="w-12 h-12 rounded-full animate-spin"
        style={{
          background: "conic-gradient(from 0deg, #D19E00, #2563EB, transparent)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
        }}
      />
      <p className="text-sm text-brand-gray-light tracking-wide">Loading...</p>
    </div>
  );
}