import { Activity, Clock, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getGreeting } from '../utils/helpers'

export function DashboardHeader() {
  const { user } = useAuth()
  const greeting = getGreeting()
  const securityScore = 87
  const lastSync = new Date(Date.now() - 2 * 60000)
  
  const formatTime = (date) => {
    const hours = Math.floor((Date.now() - date) / 60000)
    if (hours === 0) return 'Just now'
    if (hours === 1) return '1 minute ago'
    if (hours < 60) return `${hours} minutes ago`
    const dateHours = Math.floor(hours / 60)
    if (dateHours === 1) return '1 hour ago'
    return `${dateHours} hours ago`
  }
  
  return (
    <div className="mb-8 space-y-6">
      <div className="card-glass p-8 border-cyan/20">
        <div className="flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{greeting}, {user.displayName.split(' ')[0]}</h1>
            <p className="text-lg text-cyan/80 font-medium flex items-center gap-2">
              <Shield size={18} /> Hospital Security Operations Center
            </p>
            <p className="text-sm text-slate-400 mt-2">Monitor and manage hospital cybersecurity across all endpoints in real-time</p>
          </div>
          <div className="mt-6 md:mt-0 md:text-right">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-2 justify-end">
              <Clock size={14} /> Last updated
            </div>
            <p className="text-sm font-semibold text-slate-200">{formatTime(lastSync)}</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Security Score</h3>
            <Shield size={18} className="text-cyan" />
          </div>
          <div className="flex items-end gap-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient-score)" strokeWidth="4" strokeDasharray={`${87 * 2.827} 282.7`} strokeLinecap="round" />
                <defs>
                  <linearGradient id="gradient-score" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#27d3f2', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#1e40af', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{securityScore}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">Good</p>
              <p className="text-xs text-slate-400 mt-1">↑ 2 points</p>
            </div>
          </div>
        </div>
        
        <div className="card-glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Current Threat Level</h3>
            <Activity size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-400 mb-2">MEDIUM</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
              3 Active threats detected
            </div>
          </div>
        </div>
        
        <div className="card-glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">System Health</h3>
            <Shield size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400 mb-2">98%</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
