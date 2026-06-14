import { Activity, AlertTriangle, Clock, Eye, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

function AnimatedPulse({ status }) {
  const colors = {
    critical: 'bg-red-400',
    warning: 'bg-amber-400',
    info: 'bg-blue-400',
    success: 'bg-emerald-400',
  }
  
  return (
    <span className="relative inline-flex items-center justify-center">
      <span className={`${colors[status] || colors.info} h-2 w-2 rounded-full animate-pulse`} />
      <span className={`${colors[status] || colors.info} absolute inline-flex h-2 w-2 rounded-full opacity-75 animate-ping`} />
    </span>
  )
}

const mockEvents = [
  { id: 1, type: 'critical', title: 'Suspicious Process Detected', device: 'HOSP-WS-042', time: 'Just now', icon: AlertTriangle },
  { id: 2, type: 'info', title: 'Device Connected to Network', device: 'HOSP-LAP-108', time: '2 min ago', icon: Activity },
  { id: 3, type: 'success', title: 'Security Patch Applied', device: 'HOSP-SRV-03', time: '5 min ago', icon: Shield },
  { id: 4, type: 'warning', title: 'High CPU Usage Detected', device: 'HOSP-WS-187', time: '8 min ago', icon: Activity },
  { id: 5, type: 'info', title: 'Antivirus Definition Updated', device: 'All Endpoints', time: '15 min ago', icon: Shield },
]

export function LiveMonitoringPanel() {
  const [events, setEvents] = useState(mockEvents)
  const [activeEvents, setActiveEvents] = useState(events.length)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEvents(Math.floor(Math.random() * 5) + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 card-glass">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-300">Live Activity Feed</h3>
            <p className="text-xs text-slate-500 mt-1">Real-time security events and threat detection</p>
          </div>
          <Eye size={18} className="text-cyan" />
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event, index) => {
            const Icon = event.icon
            const statusColors = {
              critical: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10',
              warning: 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10',
              info: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10',
              success: 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10',
            }
            
            const iconColors = {
              critical: 'text-red-400',
              warning: 'text-amber-400',
              info: 'text-blue-400',
              success: 'text-emerald-400',
            }
            
            return (
              <div key={event.id} className={`border border-line/50 rounded-lg p-3 transition-all ${statusColors[event.type]}`}>
                <div className="flex items-start gap-3">
                  <div className="relative mt-1">
                    <Icon size={16} className={`${iconColors[event.type]}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{event.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{event.device}</p>
                      </div>
                      <AnimatedPulse status={event.type} />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
                    <Clock size={12} />
                    {event.time}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300">Event Summary</h3>
          <Activity size={18} className="text-cyan" />
        </div>
        
        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 p-4">
            <p className="text-xs font-medium text-red-300 mb-2">CRITICAL EVENTS</p>
            <p className="text-3xl font-bold text-red-400">3</p>
            <p className="text-xs text-slate-400 mt-2">Require immediate action</p>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 p-4">
            <p className="text-xs font-medium text-amber-300 mb-2">WARNING EVENTS</p>
            <p className="text-3xl font-bold text-amber-400">12</p>
            <p className="text-xs text-slate-400 mt-2">Monitor for changes</p>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 p-4">
            <p className="text-xs font-medium text-emerald-300 mb-2">RESOLVED EVENTS</p>
            <p className="text-3xl font-bold text-emerald-400">156</p>
            <p className="text-xs text-slate-400 mt-2">Today</p>
          </div>
          
          <div className="pt-4 border-t border-line/50">
            <p className="text-xs text-slate-400 mb-3">Detection Rate</p>
            <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan to-blue-500" style={{width: '87%'}} />
            </div>
            <p className="text-xs text-slate-400 mt-2">87% of threats blocked</p>
          </div>
        </div>
      </div>
    </div>
  )
}
