import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle, BarChart3, Camera, CheckCircle2, ClipboardList, Clock, Download,
  FileText, Filter, Fingerprint, Laptop, Loader2, Plus, Printer, ShieldCheck, Ticket, X,
  Users, Wrench,
} from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, EmptyState, FilterBar, PageTitle, Panel, Select, StatCard, ViewButton } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { amcContracts, helpDeskTickets, itAdmins, itAssets, maintenanceHistory } from '../data/mockData'

const assetIcon = { PC: Laptop, Printer, Camera, Biometric: Fingerprint }

function useRows(rows) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => rows.filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [rows, search])
  return { search, setSearch, filtered }
}

export function ITAssets() {
  const { search, setSearch, filtered } = useRows(itAssets)
  const [type, setType] = useState('All')
  const rows = filtered.filter(asset => type === 'All' || asset.type === type)
  const counts = ['PC', 'Printer', 'Camera', 'Biometric'].map(name => ({ name, count: itAssets.filter(asset => asset.type === name).length }))
  return <>
    <PageTitle title="Hospital IT Asset Management" subtitle="Track PCs, printers, cameras, biometric devices, ownership, warranty, and AMC status" action={<button className="btn-primary"><Plus size={15} /> Register asset</button>} />
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total assets" value={itAssets.length} note="Tracked IT devices" icon={Laptop} />
      <StatCard label="Active devices" value={itAssets.filter(a => a.status === 'Active').length} note="Operational assets" icon={CheckCircle2} tone="green" />
      <StatCard label="Maintenance" value={itAssets.filter(a => a.status === 'Maintenance').length} note="Under service" icon={Wrench} tone="amber" />
      <StatCard label="Offline/Critical" value={itAssets.filter(a => a.status === 'Offline' || a.health === 'Critical').length} note="Needs action" icon={AlertCircle} tone="red" />
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
      <Panel title="Asset inventory" subtitle="Device lifecycle and assignment details">
        <FilterBar search={search} setSearch={setSearch} placeholder="Search asset ID, device, location, vendor...">
          <Select value={type} onChange={e => setType(e.target.value)}><option>All</option><option>PC</option><option>Printer</option><option>Camera</option><option>Biometric</option></Select>
          <button className="btn-secondary"><Download size={15} /> Export</button>
        </FilterBar>
        <div className="table-wrap"><table className="data-table min-w-[1050px]"><thead><tr>{['Asset ID','Type','Device','Department','Location','Assigned to','Status','Health','AMC','Vendor',''].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>
          {rows.map(asset => { const Icon = assetIcon[asset.type]; return <tr key={asset.id}><td className="font-semibold !text-white">{asset.id}</td><td><span className="inline-flex items-center gap-2"><Icon size={14} className="text-cyan" />{asset.type}</span></td><td>{asset.name}</td><td>{asset.department}</td><td>{asset.location}</td><td>{asset.assignedTo}</td><td><Badge>{asset.status}</Badge></td><td><Badge>{asset.health}</Badge></td><td><Badge>{asset.amc}</Badge></td><td>{asset.vendor}</td><td><ViewButton /></td></tr> })}
        </tbody></table>{!rows.length && <EmptyState />}</div>
      </Panel>
      <Panel title="Asset mix" subtitle="Tracked devices by category"><div className="h-72 p-4"><ResponsiveContainer><BarChart data={counts}><XAxis dataKey="name" stroke="#516476" tick={{ fontSize: 10 }} /><YAxis stroke="#516476" tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ background: '#0b1b2d', border: '1px solid #1b354d', borderRadius: 8 }} /><Bar dataKey="count" fill="#27d3f2" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
    </div>
  </>
}

export function HelpDesk() {
  const { apiRequest, user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState('')
  const [ticketOpen, setTicketOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const filtered = useMemo(() => tickets.filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [tickets, search])

  async function loadTickets() {
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/api/helpdesk/tickets')
      setTickets(data.tickets)
    } catch (requestError) {
      setError(requestError.message)
      setTickets(helpDeskTickets)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTickets() }, [])

  async function createTicket(values) {
    const data = await apiRequest('/api/helpdesk/tickets', { method: 'POST', body: JSON.stringify(values) })
    setTickets(current => [data.ticket, ...current])
    setTicketOpen(false)
  }

  async function updateTicket(ticketId, values) {
    const data = await apiRequest(`/api/helpdesk/tickets/${ticketId}`, { method: 'PATCH', body: JSON.stringify(values) })
    setTickets(current => current.map(ticket => ticket.id === ticketId ? data.ticket : ticket))
  }

  const openTickets = tickets.filter(t => t.status !== 'Resolved').length
  const criticalTickets = tickets.filter(t => t.priority === 'Critical').length
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length
  return <>
    <PageTitle title="Hospital IT Help Desk" subtitle="Staff complaints, SLA tracking, technician assignment, and ticket logs" action={<button className="btn-primary" onClick={() => setTicketOpen(true)}><Ticket size={15} /> New ticket</button>} />
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Open tickets" value={openTickets} note="Awaiting closure" icon={Ticket} tone="amber" />
      <StatCard label="Critical" value={criticalTickets} note="SLA risk" icon={AlertCircle} tone="red" />
      <StatCard label="Resolved" value={resolvedTickets} note="Database records" icon={CheckCircle2} tone="green" />
      <StatCard label="Avg response" value="18m" note="Across help desk" icon={Clock} tone="cyan" />
    </div>
    <Panel title="Ticket log system" subtitle="Complaints and support queue">
      {error && <div className="border-b border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">{error}</div>}
      <FilterBar search={search} setSearch={setSearch} placeholder="Search requester, issue, device type...">
        <Select><option>All priority</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></Select>
        <button className="btn-secondary" onClick={loadTickets}>{loading ? <Loader2 className="animate-spin" size={15} /> : <Filter size={15} />} Refresh</button>
      </FilterBar>
      <div className="table-wrap"><table className="data-table min-w-[1120px]"><thead><tr>{['Ticket','Requester','Department','Complaint','Category','Priority','Status','Assigned to','SLA','Actions'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>
        {filtered.map(ticket => <tr key={ticket.id}><td className="font-semibold !text-white">{ticket.id}</td><td>{ticket.requester}</td><td>{ticket.department}</td><td><div><p className="font-semibold text-white">{ticket.subject}</p>{ticket.description && <p className="mt-1 line-clamp-1 text-[11px] text-slate-500">{ticket.description}</p>}</div></td><td>{ticket.category}</td><td><Badge>{ticket.priority}</Badge></td><td><StatusSelect value={ticket.status} onChange={status => updateTicket(ticket.id, { status })} /></td><td><AssignSelect value={ticket.assignedTo} onChange={assignedTo => updateTicket(ticket.id, { assignedTo })} /></td><td>{ticket.sla}</td><td><div className="flex gap-2"><button className="btn-secondary !px-2 !py-1 text-[11px]" onClick={() => updateTicket(ticket.id, { status: 'In Progress' })}>Working</button><button className="btn-secondary !px-2 !py-1 text-[11px]" onClick={() => updateTicket(ticket.id, { status: 'Resolved' })}>Resolve</button></div></td></tr>)}
      </tbody></table>{!loading && !filtered.length && <EmptyState />}</div>
      {loading && <div className="flex items-center justify-center gap-2 p-6 text-sm text-slate-500"><Loader2 className="animate-spin" size={16} /> Loading tickets from database...</div>}
    </Panel>
    <TicketModal open={ticketOpen} onClose={() => setTicketOpen(false)} onCreate={createTicket} defaultRequester={user?.displayName || ''} />
  </>
}

function StatusSelect({ value, onChange }) {
  return <select className="input min-w-32 py-1 text-xs" value={value} onChange={e => onChange(e.target.value)}>
    <option>Open</option><option>In Progress</option><option>Working</option><option>Escalated</option><option>Resolved</option>
  </select>
}

function AssignSelect({ value, onChange }) {
  return <select className="input min-w-36 py-1 text-xs" value={value} onChange={e => onChange(e.target.value)}>
    {['Unassigned', 'Riya Malhotra', 'Kabir Verma', 'Priya Nair', 'Aarav Sharma', 'Vendor Support'].map(name => <option key={name}>{name}</option>)}
  </select>
}

function TicketModal({ open, onClose, onCreate, defaultRequester }) {
  const [form, setForm] = useState({ requester: defaultRequester, department: '', subject: '', description: '', category: 'PC', priority: 'Medium', assignedTo: 'Unassigned' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) setForm(current => ({ ...current, requester: current.requester || defaultRequester }))
  }, [open, defaultRequester])

  if (!open) return null

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onCreate(form)
      setForm({ requester: defaultRequester, department: '', subject: '', description: '', category: 'PC', priority: 'Medium', assignedTo: 'Unassigned' })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const set = field => event => setForm({ ...form, [field]: event.target.value })
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
    <form className="panel w-full max-w-3xl animate-floatin overflow-hidden" onSubmit={submit}>
      <div className="flex items-start justify-between border-b border-line p-5">
        <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan">Hospital IT Help Desk</p><h2 className="mt-1 text-lg font-bold text-white">Create new staff complaint</h2><p className="mt-1 text-xs text-slate-500">Ticket will be saved in PostgreSQL and added to the support queue.</p></div>
        <button type="button" className="text-slate-500 hover:text-white" onClick={onClose}><X /></button>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Requester / Staff name" value={form.requester} onChange={set('requester')} />
        <Field label="Department" value={form.department} onChange={set('department')} placeholder="Example: ICU, Billing, OPD" />
        <label><span className="mb-2 block text-xs font-semibold text-slate-400">Category</span><select className="input w-full" value={form.category} onChange={set('category')}><option>PC</option><option>Printer</option><option>Camera</option><option>Biometric</option><option>Network</option><option>Software</option><option>Other</option></select></label>
        <label><span className="mb-2 block text-xs font-semibold text-slate-400">Priority</span><select className="input w-full" value={form.priority} onChange={set('priority')}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label>
        <label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-slate-400">Complaint subject</span><input required className="input w-full" value={form.subject} onChange={set('subject')} placeholder="Short issue title" /></label>
        <label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-slate-400">Details</span><textarea className="input min-h-28 w-full resize-none" value={form.description} onChange={set('description')} placeholder="Describe device issue, location, error message, or staff impact..." /></label>
        <label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-slate-400">Assign to</span><select className="input w-full" value={form.assignedTo} onChange={set('assignedTo')}><option>Unassigned</option><option>Riya Malhotra</option><option>Kabir Verma</option><option>Priya Nair</option><option>Aarav Sharma</option><option>Vendor Support</option></select></label>
      </div>
      {error && <p className="mx-5 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">{error}</p>}
      <div className="flex justify-end gap-2 border-t border-line p-5"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={busy}>{busy ? <Loader2 className="animate-spin" size={15} /> : <Ticket size={15} />} Create ticket</button></div>
    </form>
  </div>
}

export function AMCTracking() {
  const { search, setSearch, filtered } = useRows(amcContracts)
  return <>
    <PageTitle title="AMC Tracking" subtitle="Vendor contracts, renewal dates, covered assets, and review status" action={<button className="btn-primary"><FileText size={15} /> Add contract</button>} />
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="AMC vendors" value={amcContracts.length} note="Active partners" icon={Users} />
      <StatCard label="Covered assets" value={amcContracts.reduce((sum, c) => sum + c.assets, 0)} note="Under contracts" icon={ShieldCheck} tone="green" />
      <StatCard label="Renewal due" value={amcContracts.filter(c => c.status === 'Renewal Due').length} note="Needs review" icon={Clock} tone="amber" />
      <StatCard label="Contract value" value="₹19.2L" note="Annual AMC value" icon={BarChart3} tone="cyan" />
    </div>
    <Panel title="AMC contracts" subtitle="Renewals, values, and vendor scope">
      <FilterBar search={search} setSearch={setSearch} placeholder="Search vendor, scope, status..."><button className="btn-secondary"><Download size={15} /> Export</button></FilterBar>
      <div className="table-wrap"><table className="data-table min-w-[920px]"><thead><tr>{['Vendor','Scope','Assets','Start','End','Status','Value','Next review'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>
        {filtered.map(contract => <tr key={contract.vendor}><td className="font-semibold !text-white">{contract.vendor}</td><td>{contract.scope}</td><td>{contract.assets}</td><td>{contract.start}</td><td>{contract.end}</td><td><Badge>{contract.status}</Badge></td><td>{contract.value}</td><td>{contract.nextReview}</td></tr>)}
      </tbody></table></div>
    </Panel>
  </>
}

export function MaintenanceHistory() {
  const { search, setSearch, filtered } = useRows(maintenanceHistory)
  return <>
    <PageTitle title="Device Maintenance History" subtitle="Preventive and corrective maintenance records for hospital IT devices" action={<button className="btn-primary"><Wrench size={15} /> Log maintenance</button>} />
    <Panel title="Maintenance log" subtitle="Device service timeline and downtime records">
      <FilterBar search={search} setSearch={setSearch} placeholder="Search asset, technician, issue...">
        <Select><option>All maintenance types</option><option>Corrective</option><option>Preventive</option><option>Inspection</option></Select>
      </FilterBar>
      <div className="table-wrap"><table className="data-table min-w-[940px]"><thead><tr>{['Log ID','Asset','Device','Type','Technician','Date','Issue / Work done','Downtime','Result'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>
        {filtered.map(record => <tr key={record.id}><td className="font-semibold !text-white">{record.id}</td><td>{record.asset}</td><td>{record.device}</td><td>{record.type}</td><td>{record.technician}</td><td>{record.date}</td><td>{record.issue}</td><td>{record.downtime}</td><td><Badge>{record.result}</Badge></td></tr>)}
      </tbody></table></div>
    </Panel>
  </>
}

export function ITAdminPanel() {
  return <>
    <PageTitle title="IT Department Admin Panel" subtitle="Command view for asset operations, help desk queues, SLA health, and vendor follow-ups" action={<button className="btn-primary"><ClipboardList size={15} /> Generate IT report</button>} />
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Panel title="IT team workload" subtitle="Queue assignment and daily closure">
        <div className="divide-y divide-line/50">{itAdmins.map(admin => <div key={admin.name} className="flex items-center justify-between gap-4 p-4"><div><p className="font-semibold text-white">{admin.name}</p><p className="mt-1 text-xs text-slate-500">{admin.role} · {admin.queue}</p></div><div className="text-right"><Badge>{admin.status}</Badge><p className="mt-2 text-[11px] text-slate-500">{admin.openTickets} open · {admin.resolvedToday} resolved</p></div></div>)}</div>
      </Panel>
      <Panel title="Operations summary" subtitle="Today’s IT department command metrics">
        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <Summary label="Tickets open" value="25" tone="text-amber-400" />
          <Summary label="SLA at risk" value="3" tone="text-red-400" />
          <Summary label="Assets critical" value="2" tone="text-red-400" />
          <Summary label="AMC renewals" value="1" tone="text-cyan" />
          <Summary label="Maintenance logs" value="5" tone="text-emerald-400" />
          <Summary label="Resolved today" value="14" tone="text-emerald-400" />
        </div>
      </Panel>
    </div>
    <Panel className="mt-4" title="Admin action queue" subtitle="Recommended next actions for IT department">
      <div className="grid gap-3 p-5 md:grid-cols-3">
        {['Assign critical camera ticket to SecureVision', 'Renew SecureVision AMC before due date', 'Schedule billing printer replacement review'].map(action => <div key={action} className="rounded-xl border border-line/70 bg-slate-950/20 p-4"><p className="text-sm font-semibold text-white">{action}</p><p className="mt-2 text-xs leading-5 text-slate-500">Suggested by demo IT operations workflow.</p></div>)}
      </div>
    </Panel>
  </>
}

function Summary({ label, value, tone }) {
  return <div className="rounded-xl border border-line/70 bg-slate-950/20 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p></div>
}

function Field({ label, ...props }) {
  return <label><span className="mb-2 block text-xs font-semibold text-slate-400">{label}</span><input required className="input w-full" {...props} /></label>
}
