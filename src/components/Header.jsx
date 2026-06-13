import { Bell, ChevronDown, LogOut, Menu, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSecurity } from '../context/SecurityContext'

export function Header() {
  const { search, setSearch, setSidebarOpen } = useSecurity()
  const { user, logout } = useAuth()
  const [now, setNow] = useState(new Date())
  const [profileOpen, setProfileOpen] = useState(false)
  const initials = user.displayName.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-line/70 bg-[#071524]/80 px-4 backdrop-blur-xl md:px-6">
    <button className="text-slate-300 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
    <label className="relative hidden max-w-md flex-1 sm:block">
      <Search className="absolute left-3 top-2.5 text-slate-500" size={17} />
      <input className="input w-full pl-10" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search devices, alerts, users..." />
    </label>
    <div className="ml-auto hidden text-right md:block">
      <p className="text-xs font-semibold text-slate-200">{now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
      <p className="text-[11px] text-slate-500">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
    </div>
    <button className="btn-primary hidden lg:flex"><Plus size={16} /> Quick actions</button>
    <button className="relative rounded-lg border border-line bg-slate-800/40 p-2.5 text-slate-300 transition hover:text-cyan">
      <Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-[#0b1b2d] bg-red-500" />
    </button>
    <div className="relative">
      <button className="flex items-center gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-white/5" onClick={() => setProfileOpen(!profileOpen)}>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan text-xs font-bold text-white">{initials}</span>
        <span className="hidden xl:block"><span className="block text-xs font-semibold text-slate-200">{user.displayName}</span><span className="block text-[10px] capitalize text-slate-500">{user.role}</span></span>
        <ChevronDown className="hidden text-slate-500 xl:block" size={14} />
      </button>
      {profileOpen && <div className="absolute right-0 top-12 w-48 rounded-xl border border-line bg-[#0b1b2d] p-2 shadow-xl">
        <p className="border-b border-line px-2 py-2 text-[11px] text-slate-500">Signed in as <b className="block truncate text-slate-200">{user.username}</b></p>
        <button className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10" onClick={logout}><LogOut size={15} /> Sign out</button>
      </div>}
    </div>
  </header>
}
