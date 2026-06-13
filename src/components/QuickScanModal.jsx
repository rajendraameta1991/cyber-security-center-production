import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle, CheckCircle2, Cpu, FileSearch, HardDrive, Loader2, RotateCcw,
  ShieldAlert, ShieldCheck, Timer, X, Zap,
} from 'lucide-react'
import { Badge } from './UI'

const SCAN_SECONDS = 60
const phases = [
  [0, 'Initializing secure scan engine', 'Loading threat signatures and endpoint policies'],
  [8, 'Scanning active processes', 'Analyzing memory, startup items, and running services'],
  [20, 'Inspecting system files', 'Checking protected directories and executable signatures'],
  [35, 'Analyzing application data', 'Reviewing installed software and temporary locations'],
  [48, 'Validating threat intelligence', 'Comparing suspicious items against security policies'],
  [57, 'Compiling scan report', 'Finalizing detections and remediation recommendations'],
]

const liveEvents = [
  ['00:04', 'Scan engine initialized', 'Security definitions loaded successfully', 'success'],
  ['00:12', 'Memory inspection complete', '184 active processes analyzed', 'success'],
  ['00:23', 'Suspicious executable detected', 'invoice_reader.exe flagged on MSC-RAD-WS-07', 'alert'],
  ['00:34', 'System directories checked', 'Protected operating system files verified', 'success'],
  ['00:43', 'Potentially unwanted app found', 'Toolbar bundle identified on MSC-ADMIN-09', 'warning'],
  ['00:52', 'Threat intelligence match', 'Trojan.Win32.Generic isolated on MSC-LAB-PC-12', 'alert'],
  ['00:59', 'Remediation policy applied', 'Detected items moved to quarantine', 'success'],
]

const results = [
  ['Trojan.Win32.Generic', 'Critical', 'MSC-LAB-PC-12', 'Quarantined'],
  ['invoice_reader.exe', 'High', 'MSC-RAD-WS-07', 'Quarantined'],
  ['PUA.Toolbar.Bundle', 'Medium', 'MSC-ADMIN-09', 'Blocked'],
]

export function QuickScanModal({ open, onClose }) {
  const [elapsed, setElapsed] = useState(0)
  const complete = elapsed >= SCAN_SECONDS
  const progress = Math.min(100, Math.round((elapsed / SCAN_SECONDS) * 100))
  const phase = useMemo(() => [...phases].reverse().find(([second]) => elapsed >= second), [elapsed])
  const visibleEvents = liveEvents.filter(([time]) => elapsed >= Number(time.slice(3)))

  useEffect(() => {
    if (!open || complete) return undefined
    const timer = setInterval(() => setElapsed(value => Math.min(SCAN_SECONDS, value + 1)), 1000)
    return () => clearInterval(timer)
  }, [open, complete])

  useEffect(() => {
    if (!open) setElapsed(0)
  }, [open])

  if (!open) return null
  const files = Math.round(1840 + elapsed * 728.4)
  const processes = Math.min(184, Math.round(18 + elapsed * 3.2))
  const endpoints = Math.min(248, Math.round(12 + elapsed * 4.4))
  const detections = elapsed < 23 ? 0 : elapsed < 43 ? 1 : elapsed < 52 ? 2 : 3

  return <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 p-3 backdrop-blur-md sm:p-6">
    <div className="mx-auto min-h-full max-w-6xl py-3">
      <section className="overflow-hidden rounded-3xl border border-cyan/20 bg-[#071725]/95 shadow-[0_0_90px_rgba(39,211,242,.13)]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line/80 bg-slate-950/20 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${complete ? 'bg-emerald-400/10 text-emerald-400' : 'bg-cyan/10 text-cyan'}`}>{complete ? <ShieldCheck /> : <ShieldAlert />}</span>
            <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-cyan">Hospital Endpoint Protection</p><h2 className="mt-1 text-lg font-bold text-white">{complete ? 'Quick scan completed' : 'Quick scan in progress'}</h2></div>
          </div>
          <button className="rounded-lg border border-line p-2 text-slate-500 transition hover:border-red-400/30 hover:text-red-300" onClick={onClose} aria-label="Close scan dashboard"><X size={18} /></button>
        </header>

        <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-[.9fr_1.45fr]">
          <section className="rounded-2xl border border-line/70 bg-slate-950/20 p-5">
            <div className="relative mx-auto grid h-56 w-56 place-items-center">
              <div className="absolute inset-0 rounded-full bg-cyan/5 blur-2xl" />
              <svg className="relative h-52 w-52 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#122b40" strokeWidth="7" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={complete ? '#34d399' : '#27d3f2'} strokeLinecap="round" strokeWidth="7" strokeDasharray="314.16" strokeDashoffset={314.16 - (314.16 * progress / 100)} className="transition-all duration-700" />
              </svg>
              <div className="absolute text-center"><p className={`text-4xl font-bold ${complete ? 'text-emerald-400' : 'text-white'}`}>{progress}%</p><p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{complete ? 'Protected' : 'Scanning'}</p></div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-white">{complete ? 'Threat scan finalized successfully' : phase[1]}</p>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">{complete ? 'Demo scan report is ready for review.' : phase[2]}</p>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full transition-all duration-700 ${complete ? 'bg-emerald-400' : 'bg-gradient-to-r from-blue-500 to-cyan'}`} style={{ width: `${progress}%` }} /></div>
            <div className="mt-4 flex justify-between text-[11px] text-slate-500"><span className="flex items-center gap-1.5"><Timer size={13} /> 00:{String(elapsed).padStart(2, '0')} elapsed</span><span>{complete ? 'Completed' : `00:${String(SCAN_SECONDS - elapsed).padStart(2, '0')} remaining`}</span></div>
          </section>

          <section>
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric icon={FileSearch} label="Files analyzed" value={files.toLocaleString()} tone="blue" />
              <Metric icon={Cpu} label="Processes checked" value={processes} tone="cyan" />
              <Metric icon={HardDrive} label="Endpoints scanned" value={`${endpoints} / 248`} tone="green" />
              <Metric icon={AlertTriangle} label="Detections found" value={detections} tone={detections ? 'red' : 'green'} />
            </div>
            <div className="mt-4 rounded-2xl border border-line/70 bg-slate-950/20">
              <div className="flex items-center justify-between border-b border-line/60 px-4 py-3"><div><p className="text-xs font-semibold text-white">Live scan activity</p><p className="mt-1 text-[11px] text-slate-500">Streaming demo telemetry from managed endpoints</p></div>{!complete && <Loader2 className="animate-spin text-cyan" size={17} />}</div>
              <div className="h-56 space-y-1 overflow-y-auto p-3">
                {visibleEvents.map(([time, title, detail, tone]) => <div key={time} className="flex gap-3 rounded-lg px-2 py-2 transition hover:bg-white/[.025]"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${tone === 'success' ? 'bg-emerald-400' : tone === 'warning' ? 'bg-amber-400' : 'bg-red-400'}`} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-xs font-semibold text-slate-200">{title}</p><time className="text-[10px] text-slate-600">{time}</time></div><p className="mt-1 truncate text-[11px] text-slate-500">{detail}</p></div></div>)}
                {!visibleEvents.length && <p className="p-4 text-center text-xs text-slate-600">Waiting for telemetry...</p>}
              </div>
            </div>
          </section>
        </div>

        {complete && <section className="border-t border-line/80 bg-emerald-400/[.025] p-5 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="flex items-center gap-2 text-sm font-bold text-white"><CheckCircle2 className="text-emerald-400" size={18} /> Demo scan report</p><p className="mt-1 text-xs text-slate-500">Scan ID: CSC-QS-2026-0531 · Completed in 60 seconds</p></div><button className="btn-secondary" onClick={() => setElapsed(0)}><RotateCcw size={15} /> Run again</button></div>
          <div className="overflow-x-auto rounded-xl border border-line/70 bg-slate-950/20"><table className="data-table min-w-[680px]"><thead><tr>{['Detection','Severity','Computer','Action taken'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{results.map(([name, severity, computer, action]) => <tr key={name}><td className="font-semibold !text-white">{name}</td><td><Badge>{severity}</Badge></td><td>{computer}</td><td><Badge>{action}</Badge></td></tr>)}</tbody></table></div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-4"><Zap className="mt-0.5 shrink-0 text-emerald-400" size={17} /><p className="text-xs leading-5 text-slate-300"><b className="text-white">Demo remediation complete.</b> Three simulated items were contained. No real endpoint actions were performed during this demonstration scan.</p></div>
        </section>}
      </section>
    </div>
  </div>
}

function Metric({ icon: Icon, label, value, tone }) {
  const colors = { blue: 'bg-blue-400/10 text-blue-400', cyan: 'bg-cyan/10 text-cyan', green: 'bg-emerald-400/10 text-emerald-400', red: 'bg-red-400/10 text-red-400' }
  return <div className="rounded-xl border border-line/70 bg-slate-950/20 p-4"><div className="flex items-center gap-3"><span className={`rounded-lg p-2 ${colors[tone]}`}><Icon size={16} /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-white">{value}</p></div></div></div>
}
