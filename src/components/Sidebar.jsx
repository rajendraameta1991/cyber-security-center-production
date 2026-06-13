import {
  Activity, BriefcaseBusiness, ClipboardList, FileClock, FileText, HardDrive, Headphones,
  LayoutDashboard, Mail, Monitor, Network, Settings, ShieldAlert, Usb, Users, Wrench, X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useSecurity } from '../context/SecurityContext'
import { Brand } from './Brand'

const links = [
  ['Dashboard', '/', LayoutDashboard], ['Computers', '/computers', Monitor],
  ['Activity Monitor', '/activity', Activity], ['Email & Upload Logs', '/email-logs', Mail],
  ['Malware Alerts', '/malware', ShieldAlert], ['USB Device Logs', '/usb-logs', Usb],
  ['Software Inventory', '/software', HardDrive], ['Network Monitor', '/network', Network],
  ['IT Assets', '/it-assets', BriefcaseBusiness], ['Help Desk', '/help-desk', Headphones],
  ['AMC Tracking', '/amc', FileClock], ['Maintenance History', '/maintenance', Wrench],
  ['IT Admin Panel', '/it-admin', ClipboardList],
  ['Reports', '/reports', FileText], ['Users', '/users', Users],
  ['Audit Logs', '/audit', ClipboardList], ['Settings', '/settings', Settings],
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSecurity()
  return <>
    {sidebarOpen && <button className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line/70 bg-[#071524]/95 px-3 py-5 backdrop-blur-xl transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-8 flex items-center justify-between px-2">
        <Brand />
        <button className="text-slate-400 lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {links.map(([label, path, Icon]) => <NavLink key={path} to={path} onClick={() => setSidebarOpen(false)}
          className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${isActive ? 'border border-blue-500/20 bg-blue-500/15 text-cyan' : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}>
          <Icon size={17} className="transition group-hover:scale-110" /> {label}
        </NavLink>)}
      </nav>
      <div className="mt-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-emerald-400"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> All systems operational</div>
        <p className="text-[10px] text-slate-500">Endpoint protection active</p>
      </div>
      <div className="mt-3 border-t border-line/60 pt-3 text-center">
  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
    Created by
  </p>
  <p className="mt-1 text-xs font-semibold text-cyan">
    Rajendra Ameta
  </p>
</div>
    </aside>
  </>
}
