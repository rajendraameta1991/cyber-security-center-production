import { Activity, AlertTriangle, CloudUpload, HardDriveUpload, Mail, Monitor, MonitorCheck, MonitorX, ShieldAlert, Usb, Zap } from 'lucide-react'
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSecurity } from '../context/SecurityContext'
import { hourlyActivity } from '../data/mockData'
import { ComputerTable } from '../components/ComputerTable'
import { Badge, PageTitle, Panel, StatCard } from '../components/UI'

const activityIcon = { 'Gmail Accessed': Mail, 'Outlook Opened': Mail, 'File Upload Detected': CloudUpload, 'USB Connected': Usb, 'Unknown EXE Executed': Zap, 'Browser Activity': Activity, 'Software Opened': Activity }
const tones = { blue: 'text-blue-400 bg-blue-400/10', cyan: 'text-cyan bg-cyan/10', amber: 'text-amber-400 bg-amber-400/10', violet: 'text-violet-400 bg-violet-400/10', red: 'text-red-400 bg-red-400/10' }

export function Dashboard() {
  const { stats, activities, threats } = useSecurity()
  const pieData = [{ name: 'Online', value: stats.online }, { name: 'Offline', value: stats.offline }]
  return <>
    <PageTitle title="Security Operations Dashboard" subtitle="Real-time posture and endpoint activity across the Hospital" action={<span className="flex items-center gap-2 text-xs font-semibold text-emerald-400"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Live monitoring enabled</span>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Total computers" value={stats.total} note="All registered endpoints" icon={Monitor} />
      <StatCard label="Online computers" value={stats.online} note="93.1% availability" icon={MonitorCheck} tone="green" />
      <StatCard label="Offline computers" value={stats.offline} note="3 require attention" icon={MonitorX} tone="red" />
      <StatCard label="Malware alerts" value={stats.malware} note="1 critical detection" icon={ShieldAlert} tone="amber" />
      <StatCard label="Uploads today" value={stats.uploads} note="+12% vs yesterday" icon={HardDriveUpload} tone="cyan" />
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[.78fr_1.3fr_1.1fr]">
      <Panel title="Computer status" subtitle="Hospital endpoint coverage"><div className="relative h-56">
        <ResponsiveContainer><PieChart><Pie data={pieData} innerRadius={66} outerRadius={84} dataKey="value" paddingAngle={4} stroke="none">{['#22c55e', '#ef4444'].map(color => <Cell key={color} fill={color} />)}</Pie><Tooltip contentStyle={{ background: '#0b1b2d', border: '1px solid #1b354d', borderRadius: 8 }} /></PieChart></ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center"><p className="text-3xl font-bold text-white">{stats.total}</p><p className="text-[10px] uppercase tracking-widest text-slate-500">Total systems</p></div>
      </div><div className="flex justify-center gap-5 pb-4 text-xs text-slate-400"><span><b className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />{stats.online} Online</span><span><b className="mr-2 inline-block h-2 w-2 rounded-full bg-red-400" />{stats.offline} Offline</span></div></Panel>
      <Panel title="Recent activity" subtitle="Latest monitored events"><div className="divide-y divide-line/40">{activities.slice(0, 5).map(a => { const Icon = activityIcon[a.type]; return <div key={`${a.type}-${a.user}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/[.025]"><span className={`rounded-lg p-2 ${tones[a.tone]}`}><Icon size={15} /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">{a.type}</p><p className="truncate text-[11px] text-slate-500">{a.user} · {a.computer}</p></div><time className="text-[10px] text-slate-500">{a.time}</time></div> })}</div></Panel>
      <Panel title="Malware alerts" subtitle="Active threat detections"><div className="divide-y divide-line/40">{threats.map(t => <div key={t.name} className="px-4 py-3 transition hover:bg-white/[.025]"><div className="mb-1 flex items-center justify-between gap-2"><p className="truncate text-xs font-semibold text-white">{t.computer}</p><Badge>{t.severity}</Badge></div><p className="truncate text-[11px] text-slate-400">{t.message}</p><p className="mt-1 text-[10px] text-slate-600">{t.time}</p></div>)}</div></Panel>
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.65fr_1fr]">
      <Panel title="Activity summary" subtitle="Security events across the last 24 hours"><div className="h-72 p-4"><ResponsiveContainer><LineChart data={hourlyActivity}><XAxis dataKey="time" stroke="#516476" tick={{ fontSize: 10 }} /><YAxis stroke="#516476" tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ background: '#0b1b2d', border: '1px solid #1b354d', borderRadius: 8 }} /><Line type="monotone" dataKey="email" stroke="#3b82f6" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="uploads" stroke="#27d3f2" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="usb" stroke="#a78bfa" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div><div className="flex flex-wrap gap-4 px-5 pb-4 text-[11px] text-slate-400">{[['Email access','#3b82f6'],['File uploads','#27d3f2'],['USB connections','#a78bfa'],['Malware alerts','#ef4444']].map(([n,c]) => <span key={n}><b className="mr-2 inline-block h-2 w-2 rounded-full" style={{background:c}} />{n}</span>)}</div></Panel>
      <Panel title="Security posture" subtitle="Protection overview"><div className="space-y-4 p-5">{[['Endpoint coverage','98%',98],['Patch compliance','92%',92],['Agent health','96%',96],['Policy compliance','89%',89]].map(([label,value,width]) => <div key={label}><div className="mb-2 flex justify-between text-xs"><span className="text-slate-400">{label}</span><b className="text-white">{value}</b></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan" style={{width:`${width}%`}} /></div></div>)}</div><div className="mx-5 mb-5 flex items-center gap-3 rounded-xl border border-cyan/15 bg-cyan/5 p-3"><AlertTriangle className="text-cyan" size={18} /><p className="text-xs text-slate-300"><b className="text-white">11 updates</b> scheduled tonight at 02:00 AM.</p></div></Panel>
    </div>
    <Panel className="mt-4" title="Computer status" subtitle="Live endpoint health and utilization"><ComputerTable limit={6} /></Panel>
  </>
}
