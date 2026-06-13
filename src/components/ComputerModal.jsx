import { Cpu, HardDrive, MapPin, MemoryStick, Monitor, ShieldCheck, X } from 'lucide-react'
import { useSecurity } from '../context/SecurityContext'
import { Badge } from './UI'

export function ComputerModal() {
  const { selectedComputer: c, setSelectedComputer } = useSecurity()
  if (!c) return null
  const details = [[Cpu, 'Processor', c.processor], [MemoryStick, 'Memory usage', `${c.ram}% of 16 GB`], [HardDrive, 'Storage', c.storage], [MapPin, 'Department', c.dept]]
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" onMouseDown={() => setSelectedComputer(null)}>
    <div className="panel w-full max-w-2xl animate-floatin overflow-hidden" onMouseDown={e => e.stopPropagation()}>
      <div className="flex items-start justify-between border-b border-line p-5">
        <div className="flex gap-3"><span className="rounded-xl bg-blue-500/10 p-3 text-cyan"><Monitor /></span><div><h2 className="font-bold text-white">{c.name}</h2><p className="text-xs text-slate-500">{c.ip} · {c.os}</p></div></div>
        <button className="text-slate-500 hover:text-white" onClick={() => setSelectedComputer(null)}><X /></button>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2">{details.map(([Icon, label, value]) => <div key={label} className="rounded-xl border border-line/60 bg-slate-950/20 p-4"><Icon className="mb-3 text-cyan" size={18} /><p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-white">{value}</p></div>)}</div>
      <div className="grid gap-4 border-t border-line px-5 py-4 text-xs sm:grid-cols-3"><div><p className="text-slate-500">Assigned user</p><p className="mt-1 font-semibold text-white">{c.user}</p></div><div><p className="text-slate-500">Endpoint status</p><p className="mt-1"><Badge>{c.status}</Badge></p></div><div><p className="text-slate-500">Security risk</p><p className="mt-1"><Badge>{c.risk}</Badge></p></div></div>
      <div className="flex items-center gap-2 border-t border-line bg-emerald-500/5 px-5 py-3 text-xs text-emerald-400"><ShieldCheck size={16} /> Hospital endpoint agent is installed and reporting</div>
    </div>
  </div>
}
