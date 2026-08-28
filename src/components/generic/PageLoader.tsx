export default function PageLoader({ fullScreen }: { fullScreen?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 w-full ${
        fullScreen ? "min-h-screen bg-white dark:bg-gray-950" : "min-h-[60vh]"
      }`}
    >
      <div
        className="w-12 h-12 rounded-full animate-spin"
        style={{
          background:
            "conic-gradient(from 0deg, #D19E00, #2563EB, transparent)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
        }}
      />
      <p className="text-sm text-brand-gray-light tracking-wide">Loading...</p>
    </div>
  );
}
