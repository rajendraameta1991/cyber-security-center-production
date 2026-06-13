import { Cross, ShieldCheck } from 'lucide-react'

export function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan/25 bg-gradient-to-br from-blue-600/30 to-cyan/10 shadow-[0_0_22px_rgba(39,211,242,.14)]">
        <ShieldCheck className="h-7 w-7 text-cyan" strokeWidth={1.7} />
        <Cross className="absolute h-3.5 w-3.5 text-white" strokeWidth={3} />
      </div>
      {!compact && <div>
        <p className="text-[15px] font-bold tracking-wide text-white">Cyber <span className="text-cyan">Security</span> Center</p>
        <p className="text-[10px] font-medium uppercase tracking-[.16em] text-slate-500">Hospital Security Monitoring</p>
      </div>}
    </div>
  )
}
