import { useMemo, useState } from 'react'
import {
  Activity, AlertOctagon, BarChart3, Bell, Globe, CheckCircle2, CloudUpload, Download,
  FileSpreadsheet, FileText, Filter, HardDrive, KeyRound, Laptop, Mail, Network, Plus,
  Save, Settings as SettingsIcon, Shield, ShieldAlert, Upload, Usb, Users as UsersIcon, Zap,
} from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ComputerTable } from '../components/ComputerTable'
import { QuickScanModal } from '../components/QuickScanModal'
import { LiveTrafficModal } from '../components/LiveTrafficModal'
import { Badge, EmptyState, FilterBar, PageTitle, Panel, Select, StatCard, ViewButton } from '../components/UI'
import { useSecurity } from '../context/SecurityContext'
import { auditLogs, emailLogs, networkTraffic, software, usbLogs, users } from '../data/mockData'

const useFilter = (rows) => {
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => rows.filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [rows, search])
  return [search, setSearch, filtered]
}

export function Computers() {
  const { computers } = useSecurity()
  return <><PageTitle title="Computer Inventory" subtitle="Monitor every managed endpoint across the hospital network" action={<button className="btn-primary"><Plus size={16} /> Add computer</button>} />
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Managed endpoints" value="248" note="Across 14 departments" icon={Laptop} /><StatCard label="Protected" value="244" note="98.4% coverage" icon={Shield} tone="green" /><StatCard label="Need attention" value="7" note="Review health issues" icon={AlertOctagon} tone="amber" /><StatCard label="Offline" value="17" note="6 offline > 24 hours" icon={Activity} tone="red" /></div>
    <Panel title="All computers" subtitle={`${computers.length} sample endpoint records shown`}><ComputerTable /></Panel></>
}

const activityIcons = { 'Gmail Accessed': Mail, 'Outlook Opened': Mail, 'File Upload Detected': Upload, 'USB Connected': Usb, 'Unknown EXE Executed': Zap, 'Browser Activity': Globe, 'Software Opened': Laptop }
export function ActivityMonitor() {
  const { activities } = useSecurity()
  const [search, setSearch, filtered] = useFilter(activities)
  return <><PageTitle title="Activity Monitor" subtitle="Continuous application, browser, file, and device telemetry" /><Panel title="Live event timeline" subtitle="Streaming endpoint telemetry">
    <FilterBar search={search} setSearch={setSearch}><Select><option>All activities</option><option>Email access</option><option>USB devices</option><option>File uploads</option></Select><button className="btn-secondary"><Filter size={15} /> Filters</button></FilterBar>
    <div className="p-5">{filtered.map((a, i) => { const Icon = activityIcons[a.type]; return <div key={`${a.type}-${i}`} className="relative flex gap-4 pb-6 last:pb-0"><div className="absolute left-4 top-9 h-[calc(100%-25px)] w-px bg-line last:hidden" /><span className="z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-blue-400/20 bg-blue-500/10 text-cyan"><Icon size={16} /></span><div className="flex-1 rounded-xl border border-line/70 bg-slate-950/15 p-4 transition hover:border-cyan/25 hover:bg-blue-500/[.025]"><div className="flex flex-wrap justify-between gap-2"><p className="text-sm font-semibold text-white">{a.type}</p><time className="text-[11px] text-slate-500">{a.time}</time></div><p className="mt-1 text-xs text-slate-400">{a.detail}</p><p className="mt-2 text-[11px] text-slate-500">{a.user} · <span className="text-cyan">{a.computer}</span></p></div></div>})}</div>
  </Panel></>
}

export function EmailLogs() {
  const [search, setSearch, rows] = useFilter(emailLogs)
  return <><PageTitle title="Email & Upload Logs" subtitle="Review email access and outbound file movement" action={<button className="btn-secondary"><Download size={15} /> Export logs</button>} /><Panel title="File upload activity" subtitle="Monitored email services and uploaded files"><FilterBar search={search} setSearch={setSearch}><Select><option>All services</option><option>Gmail</option><option>Outlook</option></Select><Select><option>Today</option><option>Last 7 days</option></Select></FilterBar><DataTable heads={['User','Computer','Email service','Uploaded file','Size','Time']} rows={rows.map(r => [r.user,r.computer,r.service,r.file,r.size,r.time])} /></Panel></>
}

export function MalwareAlerts() {
  const { threats } = useSecurity()
  const [search, setSearch, rows] = useFilter(threats)
  const [scanOpen, setScanOpen] = useState(false)
  return <><PageTitle title="Malware Alerts" subtitle="Triage threat detections and endpoint risk signals" action={<button className="btn-primary" onClick={() => setScanOpen(true)}><ShieldAlert size={15} /> Run quick scan</button>} />
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Active alerts" value="4" note="Across 4 endpoints" icon={AlertOctagon} tone="red" /><StatCard label="Critical threats" value="1" note="Immediate action needed" icon={Zap} tone="red" /><StatCard label="Quarantined" value="18" note="This month" icon={Shield} tone="green" /><StatCard label="Resolved" value="42" note="+16% this month" icon={CheckCircle2} tone="cyan" /></div>
    <Panel title="Threat management queue" subtitle="Latest security detections"><FilterBar search={search} setSearch={setSearch}><Select><option>All severity levels</option><option>Critical</option><option>High</option></Select><Select><option>All statuses</option><option>Investigating</option><option>Blocked</option></Select></FilterBar><div className="table-wrap"><table className="data-table min-w-[760px]"><thead><tr>{['Threat name','Severity','Computer','Status','Time',''].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.name}><td><p className="font-semibold text-white">{r.name}</p><p className="mt-1 text-[11px] text-slate-500">{r.message}</p></td><td><Badge>{r.severity}</Badge></td><td>{r.computer}</td><td><Badge>{r.status}</Badge></td><td>{r.time}</td><td><ViewButton /></td></tr>)}</tbody></table></div></Panel><QuickScanModal open={scanOpen} onClose={() => setScanOpen(false)} /></>
}

export function UsbLogs() {
  const [search, setSearch, rows] = useFilter(usbLogs)
  return <><PageTitle title="USB Device Logs" subtitle="Track removable media connections across managed computers" action={<button className="btn-secondary"><Download size={15} /> Export logs</button>} /><Panel title="Removable media activity" subtitle="Connected and removed storage devices"><FilterBar search={search} setSearch={setSearch}><Select><option>All devices</option><option>Connected</option><option>Removed</option></Select></FilterBar><div className="table-wrap"><table className="data-table min-w-[760px]"><thead><tr>{['Device name','User','Computer','Time connected','Time removed','Status'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={`${r.device}-${r.connected}`}><td className="font-semibold !text-white">{r.device}</td><td>{r.user}</td><td>{r.computer}</td><td>{r.connected}</td><td>{r.removed}</td><td><Badge>{r.status}</Badge></td></tr>)}</tbody></table></div></Panel></>
}

export function SoftwareInventory() {
  const [search, setSearch, rows] = useFilter(software)
  return <><PageTitle title="Software Inventory" subtitle="Installed application visibility across managed endpoints" /><Panel title="Installed software" subtitle="Application versions and deployment coverage"><FilterBar search={search} setSearch={setSearch}><Select><option>All categories</option><option>Security</option><option>Clinical</option><option>Browser</option></Select></FilterBar><DataTable heads={['Software name','Version','Publisher','Install date','Systems','Category']} rows={rows.map(r => [r.name,r.version,r.publisher,r.installDate,r.systems,r.category])} /></Panel></>
}

export function NetworkMonitor() {
  const [trafficOpen, setTrafficOpen] = useState(false)
  return <><PageTitle title="Network Monitor" subtitle="Hospital network performance, traffic, and connected systems" action={<div className="flex items-center gap-3"><span className="hidden items-center gap-2 text-xs font-semibold text-emerald-400 sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Network healthy</span><button className="btn-primary" onClick={() => setTrafficOpen(true)}><Activity size={15} /> Live traffic</button></div>} />
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Active devices" value="312" note="+8 since yesterday" icon={Network} tone="green" /><StatCard label="Inbound traffic" value="92 Mbps" note="Current throughput" icon={BarChart3} /><StatCard label="Outbound traffic" value="49 Mbps" note="Current throughput" icon={CloudUpload} tone="cyan" /><StatCard label="Connected systems" value="19" note="Network segments" icon={HardDrive} tone="amber" /></div>
    <div className="grid gap-4 xl:grid-cols-[1.65fr_1fr]"><Panel title="Network traffic" subtitle="Bandwidth usage over the last 8 hours"><div className="h-80 p-5"><ResponsiveContainer><AreaChart data={networkTraffic}><defs><linearGradient id="inbound" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#3b82f6" stopOpacity=".35" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0" /></linearGradient></defs><CartesianGrid stroke="#1b354d" strokeDasharray="4 4" /><XAxis dataKey="time" stroke="#516476" tick={{fontSize:10}} /><YAxis stroke="#516476" tick={{fontSize:10}} /><Tooltip contentStyle={{background:'#0b1b2d',border:'1px solid #1b354d',borderRadius:8}} /><Area type="monotone" dataKey="inbound" stroke="#3b82f6" fill="url(#inbound)" strokeWidth={2} /><Area type="monotone" dataKey="outbound" stroke="#27d3f2" fill="transparent" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></Panel><Panel title="Network segments" subtitle="Bandwidth by zone"><div className="space-y-4 p-5">{[['Clinical network','42%',42],['Administration','26%',26],['Guest Wi-Fi','18%',18],['Medical devices','14%',14]].map(([n,v,w]) => <div key={n}><div className="mb-2 flex justify-between text-xs"><span className="text-slate-400">{n}</span><b className="text-white">{v}</b></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan" style={{width:`${w}%`}} /></div></div>)}</div></Panel></div>
    <LiveTrafficModal open={trafficOpen} onClose={() => setTrafficOpen(false)} />
  </>
}

const reports = [['Daily Security Report','Endpoint health, alerts, and activities from the last 24 hours','Daily'],['Weekly Security Summary','Security posture and event trends across the last 7 days','Weekly'],['Monthly Executive Report','Compliance, threat, and performance review for leadership','Monthly']]
export function Reports() {
  return <><PageTitle title="Security Reports" subtitle="Generate operational and executive security summaries" /><div className="grid gap-4 lg:grid-cols-3">{reports.map(([title,desc,type]) => <Panel key={title} className="overflow-hidden"><div className="p-5"><span className="mb-5 inline-flex rounded-xl bg-blue-500/10 p-3 text-cyan"><FileText /></span><h2 className="text-base font-bold text-white">{title}</h2><p className="mt-2 min-h-12 text-xs leading-5 text-slate-500">{desc}</p><p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-cyan">{type} reporting</p></div><div className="flex gap-2 border-t border-line p-4"><button className="btn-secondary flex-1"><FileText size={14} /> PDF</button><button className="btn-secondary flex-1"><FileSpreadsheet size={14} /> Excel</button></div></Panel>)}</div></>
}

export function Users() {
  const [search, setSearch, rows] = useFilter(users)
  return <><PageTitle title="Users & Access" subtitle="Manage administrative roles and security center permissions" action={<button className="btn-primary"><Plus size={15} /> Invite user</button>} /><Panel title="Authorized users" subtitle="Admins, IT staff, and security team members"><FilterBar search={search} setSearch={setSearch}><Select><option>All teams</option><option>Security Team</option><option>IT Staff</option></Select></FilterBar><div className="table-wrap"><table className="data-table min-w-[760px]"><thead><tr>{['User','Role','Team','Status','Last active',''].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.email}><td><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-blue-500/15 text-[10px] font-bold text-cyan">{r.initials}</span><div><p className="font-semibold text-white">{r.name}</p><p className="text-[11px] text-slate-500">{r.email}</p></div></div></td><td>{r.role}</td><td>{r.team}</td><td><Badge>{r.status}</Badge></td><td>{r.lastActive}</td><td><ViewButton /></td></tr>)}</tbody></table></div></Panel></>
}

export function AuditLogs() {
  const [search, setSearch, rows] = useFilter(auditLogs)
  return <><PageTitle title="Audit Logs" subtitle="Review actions performed inside Cyber Security Center" action={<button className="btn-secondary"><Download size={15} /> Export audit trail</button>} /><Panel title="Administrative activity" subtitle="Immutable system action history"><FilterBar search={search} setSearch={setSearch}><Select><option>All actions</option><option>Success</option><option>Blocked</option></Select></FilterBar><div className="table-wrap"><table className="data-table min-w-[760px]"><thead><tr>{['Action','Performed by','Role','Resource','Time','Result'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i) => <tr key={i}><td className="font-semibold !text-white">{r.action}</td><td>{r.user}</td><td>{r.role}</td><td>{r.resource}</td><td>{r.time}</td><td><Badge>{r.result}</Badge></td></tr>)}</tbody></table></div></Panel></>
}

export function Settings() {
  const sections = [[SettingsIcon,'Hospital information','Organization name, primary location, and contact information'],[Upload,'Logo settings','Update the Hospital brand mark used throughout CSC'],[KeyRound,'Security settings','Endpoint policies, sessions, and access requirements'],[Bell,'Notification settings','Alert escalation and email notification preferences']]
  return <><PageTitle title="Settings" subtitle="Configure security center preferences and organization details" action={<button className="btn-primary"><Save size={15} /> Save changes</button>} /><div className="grid gap-4 xl:grid-cols-[.7fr_1.5fr]"><Panel title="Configuration" subtitle="System settings"><div className="divide-y divide-line/50">{sections.map(([Icon,title,desc],i) => <button key={title} className={`flex w-full items-start gap-3 p-4 text-left transition hover:bg-white/[.025] ${i===0?'bg-blue-500/5':''}`}><Icon className="mt-0.5 text-cyan" size={17} /><span><b className="block text-xs text-white">{title}</b><span className="mt-1 block text-[11px] leading-4 text-slate-500">{desc}</span></span></button>)}</div></Panel><Panel title="Hospital information" subtitle="Details displayed across Cyber Security Center"><div className="grid gap-4 p-5 sm:grid-cols-2"><Field label="Organization name" value="Hospital" /><Field label="System name" value="Cyber Security Center" /><Field label="Primary location" value="Hospital Main Campus" /><Field label="Security contact" value="security@hospital.in" /><Field label="Time zone" value="Asia/Kolkata (IST)" /><Field label="Retention period" value="365 days" /></div><div className="border-t border-line p-5"><p className="text-xs font-semibold text-white">Security center profile</p><p className="mt-1 text-xs leading-5 text-slate-500">These values identify the organization in reports, audit exports, and administrative notifications.</p></div></Panel></div></>
}

function Field({ label, value }) { return <label><span className="mb-2 block text-xs font-semibold text-slate-400">{label}</span><input className="input w-full" defaultValue={value} /></label> }
function DataTable({ heads, rows }) { return <div className="table-wrap"><table className="data-table min-w-[760px]"><thead><tr>{heads.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i) => <tr key={i}>{r.map((c,j) => <td key={j} className={j===0?'font-semibold !text-white':''}>{c}</td>)}</tr>)}</tbody></table>{!rows.length && <EmptyState />}</div> }
