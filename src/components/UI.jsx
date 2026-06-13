import { ChevronRight, Search } from 'lucide-react'

const tones = {
  Online: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20', Active: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  Success: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20', Resolved: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  Offline: 'bg-red-400/10 text-red-400 border-red-400/20', Critical: 'bg-red-400/10 text-red-400 border-red-400/20',
  High: 'bg-orange-400/10 text-orange-400 border-orange-400/20', Medium: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  Low: 'bg-blue-400/10 text-blue-400 border-blue-400/20', Blocked: 'bg-red-400/10 text-red-400 border-red-400/20',
  Quarantined: 'bg-violet-400/10 text-violet-400 border-violet-400/20', Investigating: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  Connected: 'bg-cyan/10 text-cyan border-cyan/20', Removed: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  Invited: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  'In Progress': 'bg-blue-400/10 text-blue-400 border-blue-400/20', Working: 'bg-cyan/10 text-cyan border-cyan/20',
  Escalated: 'bg-red-400/10 text-red-400 border-red-400/20', Maintenance: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  Good: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20', 'Needs Service': 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  'Renewal Due': 'bg-amber-400/10 text-amber-400 border-amber-400/20',
}

export const Badge = ({ children }) => <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${tones[children] || 'border-line bg-slate-800/60 text-slate-400'}`}>{children}</span>

export function PageTitle({ title, subtitle, action }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.22em] text-cyan">Hospital SOC Workspace</p><h1 className="text-2xl font-bold text-white">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>{action}
  </div>
}

export function Panel({ title, subtitle, action, className = '', children }) {
  return <section className={`panel ${className}`}>
    {(title || action) && <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
      <div><h2 className="text-sm font-semibold text-white">{title}</h2>{subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}</div>{action}
    </div>}
    {children}
  </section>
}

export function StatCard({ label, value, note, icon: Icon, tone = 'blue' }) {
  const colors = { blue: 'text-blue-400 bg-blue-400/10', green: 'text-emerald-400 bg-emerald-400/10', red: 'text-red-400 bg-red-400/10', cyan: 'text-cyan bg-cyan/10', amber: 'text-amber-400 bg-amber-400/10' }
  return <div className="panel group animate-floatin p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan/30">
    <div className="mb-4 flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><span className={`rounded-lg p-2 ${colors[tone]}`}><Icon size={17} /></span></div>
    <p className="text-2xl font-bold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p>
  </div>
}

export function FilterBar({ search, setSearch, placeholder = 'Search records...', children }) {
  return <div className="flex flex-wrap gap-3 border-b border-line/60 p-4">
    <label className="relative min-w-52 flex-1"><Search className="absolute left-3 top-2.5 text-slate-500" size={16} /><input className="input w-full pl-9" value={search} onChange={e => setSearch(e.target.value)} placeholder={placeholder} /></label>
    {children}
  </div>
}

export function EmptyState() { return <div className="p-8 text-center text-sm text-slate-500">No matching records found.</div> }
export const Select = ({ children, ...props }) => <select className="input min-w-32" {...props}>{children}</select>
export const ViewButton = ({ onClick }) => <button onClick={onClick} className="text-cyan transition hover:text-white"><ChevronRight size={18} /></button>
