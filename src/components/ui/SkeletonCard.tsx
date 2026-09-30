// components/ui/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-200 rounded-full" />
          <div className="space-y-2">
            <div className="w-36 h-4 bg-slate-200 rounded" />
            <div className="w-24 h-3 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-16 h-6 bg-blue-100 rounded-full" />
      </div>
      <div className="w-48 h-3.5 bg-slate-200 rounded" />
      <div className="flex gap-2">
        <div className="w-16 h-5 bg-slate-100 rounded-md" />
        <div className="w-20 h-5 bg-slate-100 rounded-md" />
        <div className="w-14 h-5 bg-slate-100 rounded-md" />
      </div>
      <div className="pt-3 border-t border-slate-100 space-y-1.5">
        <div className="w-full h-3 bg-slate-100 rounded" />
        <div className="w-3/4 h-3 bg-slate-100 rounded" />
      </div>
    </div>
  );
}
