import { useEffect, useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, Download, Network, Pause, Play, Radio, Search,
  ShieldCheck, X,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const protocols = ['All', 'TCP', 'TLS', 'DNS', 'HTTP', 'UDP', 'ICMP']
const sources = ['10.24.1.18', '10.24.2.44', '10.24.3.64', '10.24.4.91', '10.24.5.22', '10.24.6.31']
const destinations = ['10.24.0.1', '10.24.8.15', '142.250.183.14', '13.107.42.14', '104.18.32.47', '8.8.8.8']
const packetTypes = [
  ['TCP', '443 -> 52148', 'ACK Application data', false],
  ['TLS', '52148 -> 443', 'TLSv1.3 encrypted payload', false],
  ['DNS', '53 -> 61294', 'Standard query response', false],
  ['HTTP', '49822 -> 80', 'GET /clinical-portal/status', false],
  ['UDP', '137 -> 137', 'NetBIOS name service', false],
  ['ICMP', 'Echo request', 'Network reachability probe', false],
  ['TCP', '49818 -> 445', 'Repeated SMB connection attempt', true],
  ['DNS', '53 -> 64218', 'Unusual domain resolution pattern', true],
]

const seedPackets = Array.from({ length: 12 }, (_, index) => makePacket(120 - index))

export function LiveTrafficModal({ open, onClose }) {
  const [running, setRunning] = useState(true)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [packets, setPackets] = useState(seedPackets)
  const [chart, setChart] = useState([
    { time: '00:00', inbound: 34, outbound: 18 }, { time: '00:01', inbound: 51, outbound: 24 },
    { time: '00:02', inbound: 44, outbound: 31 }, { time: '00:03', inbound: 62, outbound: 29 },
  ])

  useEffect(() => {
    if (!open || !running) return undefined
    const timer = setInterval(() => {
      setPackets(current => [makePacket(current[0]?.id + 1 || 1), ...current].slice(0, 80))
      setChart(current => [...current, {
        time: new Date().toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit' }),
        inbound: 32 + Math.round(Math.random() * 72),
        outbound: 12 + Math.round(Math.random() * 46),
      }].slice(-18))
    }, 750)
    return () => clearInterval(timer)
  }, [open, running])

  const visiblePackets = useMemo(() => packets.filter(packet =>
    (filter === 'All' || packet.protocol === filter) &&
    JSON.stringify(packet).toLowerCase().includes(query.toLowerCase())
  ), [packets, filter, query])
  const suspicious = packets.filter(packet => packet.suspicious).length
  const totalBytes = packets.reduce((sum, packet) => sum + packet.bytes, 0)

  if (!open) return null
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 p-3 backdrop-blur-md sm:p-5">
    <section className="mx-auto min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-3xl border border-cyan/20 bg-[#061522]/98 shadow-[0_0_90px_rgba(39,211,242,.12)]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line/80 bg-slate-950/25 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-cyan/10 text-cyan"><Radio /><span className={`absolute right-1 top-1 h-2 w-2 rounded-full ${running ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'}`} /></span>
          <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-cyan">Hospital Network Sensor</p><h2 className="mt-1 text-lg font-bold text-white">Live Traffic Analyzer</h2></div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sm:flex ${running ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400' : 'border-amber-400/20 bg-amber-400/10 text-amber-400'}`}><span className={`h-2 w-2 rounded-full ${running ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'}`} />{running ? 'Capture active' : 'Capture paused'}</span>
          <button className="btn-secondary" onClick={() => setRunning(value => !value)}>{running ? <Pause size={15} /> : <Play size={15} />}{running ? 'Pause' : 'Resume'}</button>
          <button className="rounded-lg border border-line p-2 text-slate-500 transition hover:border-red-400/30 hover:text-red-300" onClick={onClose} aria-label="Close live traffic analyzer"><X size={18} /></button>
        </div>
      </header>

      <div className="grid gap-3 border-b border-line/70 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Activity} label="Packets captured" value={(12480 + packets.length).toLocaleString()} note={`${running ? 'Live stream active' : 'Capture paused'}`} tone="cyan" />
        <Metric icon={Download} label="Traffic volume" value={`${(18.4 + totalBytes / 100000).toFixed(1)} MB`} note="Current inspection window" tone="blue" />
        <Metric icon={Network} label="Active flows" value="186" note="Across 19 network segments" tone="green" />
        <Metric icon={AlertTriangle} label="Flagged packets" value={suspicious} note="Requires analyst review" tone="red" />
      </div>

      <div className="grid gap-4 p-4 xl:grid-cols-[1.65fr_.8fr]">
        <section className="overflow-hidden rounded-2xl border border-line/70 bg-slate-950/20">
          <div className="flex flex-wrap items-center gap-2 border-b border-line/70 p-3">
            <label className="relative min-w-52 flex-1"><Search className="absolute left-3 top-2.5 text-slate-500" size={15} /><input className="input w-full pl-9" placeholder="Filter IP address, protocol, or details..." value={query} onChange={event => setQuery(event.target.value)} /></label>
            <div className="flex flex-wrap gap-1">{protocols.map(protocol => <button key={protocol} onClick={() => setFilter(protocol)} className={`rounded-md border px-2.5 py-2 text-[10px] font-bold transition ${filter === protocol ? 'border-cyan/35 bg-cyan/10 text-cyan' : 'border-line text-slate-500 hover:text-slate-300'}`}>{protocol}</button>)}</div>
          </div>
          <div className="h-[550px] overflow-auto">
            <table className="data-table min-w-[920px]"><thead className="sticky top-0 z-10 bg-[#081827]"><tr>{['No.','Time','Source','Destination','Protocol','Length','Information'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>
              {visiblePackets.map(packet => <tr key={packet.id} className={packet.suspicious ? '!bg-red-400/[.055]' : ''}><td className="text-slate-600">{packet.id}</td><td className="font-mono text-[11px]">{packet.time}</td><td className="font-mono text-[11px] !text-blue-300">{packet.source}</td><td className="font-mono text-[11px] !text-cyan">{packet.destination}</td><td><ProtocolBadge protocol={packet.protocol} suspicious={packet.suspicious} /></td><td>{packet.bytes} B</td><td className={packet.suspicious ? '!text-red-300' : ''}>{packet.info}</td></tr>)}
            </tbody></table>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-line/70 bg-slate-950/20">
            <div className="border-b border-line/60 px-4 py-3"><p className="text-xs font-semibold text-white">Live bandwidth</p><p className="mt-1 text-[11px] text-slate-500">Inbound and outbound traffic stream</p></div>
            <div className="h-56 p-3"><ResponsiveContainer><AreaChart data={chart}><defs><linearGradient id="liveInbound" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#3b82f6" stopOpacity=".45" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0" /></linearGradient></defs><XAxis dataKey="time" hide /><YAxis hide /><Tooltip contentStyle={{ background: '#0b1b2d', border: '1px solid #1b354d', borderRadius: 8, fontSize: 11 }} /><Area type="monotone" dataKey="inbound" stroke="#3b82f6" fill="url(#liveInbound)" strokeWidth={2} /><Area type="monotone" dataKey="outbound" stroke="#27d3f2" fill="transparent" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
            <div className="flex gap-4 px-4 pb-4 text-[11px] text-slate-500"><span><b className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />Inbound</span><span><b className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan" />Outbound</span></div>
          </section>
          <section className="rounded-2xl border border-line/70 bg-slate-950/20">
            <div className="border-b border-line/60 px-4 py-3"><p className="text-xs font-semibold text-white">Capture status</p></div>
            <div className="space-y-3 p-4 text-xs"><Status label="Interface" value="Hospital LAN Sensor 01" /><Status label="Inspection mode" value="Demo packet telemetry" /><Status label="Packet buffer" value={`${packets.length} / 80 rows`} /><Status label="Auto-scroll" value="Latest packets first" /></div>
          </section>
          <div className="flex items-start gap-3 rounded-xl border border-cyan/15 bg-cyan/5 p-4"><ShieldCheck className="mt-0.5 shrink-0 text-cyan" size={17} /><p className="text-xs leading-5 text-slate-400"><b className="text-slate-200">Safe demonstration mode.</b> Traffic rows are simulated. No real network packets are captured or stored.</p></div>
        </aside>
      </div>
    </section>
  </div>
}

function makePacket(id) {
  const type = packetTypes[Math.floor(Math.random() * packetTypes.length)]
  return { id, time: new Date().toLocaleTimeString('en-US', { hour12: false }), source: pick(sources), destination: pick(destinations), protocol: type[0], bytes: 64 + Math.round(Math.random() * 1380), info: `${type[1]}  ${type[2]}`, suspicious: type[3] }
}
function pick(items) { return items[Math.floor(Math.random() * items.length)] }
function Metric({ icon: Icon, label, value, note, tone }) {
  const colors = { cyan: 'bg-cyan/10 text-cyan', blue: 'bg-blue-400/10 text-blue-400', green: 'bg-emerald-400/10 text-emerald-400', red: 'bg-red-400/10 text-red-400' }
  return <div className="rounded-xl border border-line/70 bg-slate-950/20 p-4"><div className="flex items-center gap-3"><span className={`rounded-lg p-2 ${colors[tone]}`}><Icon size={16} /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-white">{value}</p><p className="mt-1 text-[10px] text-slate-600">{note}</p></div></div></div>
}
function Status({ label, value }) { return <div className="flex justify-between gap-3"><span className="text-slate-500">{label}</span><b className="text-right text-slate-300">{value}</b></div> }
function ProtocolBadge({ protocol, suspicious }) {
  const colors = { TCP: 'text-blue-300 bg-blue-400/10', TLS: 'text-cyan bg-cyan/10', DNS: 'text-violet-300 bg-violet-400/10', HTTP: 'text-amber-300 bg-amber-400/10', UDP: 'text-emerald-300 bg-emerald-400/10', ICMP: 'text-slate-300 bg-slate-400/10' }
  return <span className={`rounded px-2 py-1 text-[10px] font-bold ${suspicious ? 'bg-red-400/10 text-red-300' : colors[protocol]}`}>{protocol}</span>
}
