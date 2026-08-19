import { HeartPulse } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-ocean-600 text-white"><HeartPulse size={20} /></span>{!compact && <span className="text-lg font-extrabold tracking-tight text-ink">CARE<span className="text-ocean-600">360</span></span>}</div>;
}

