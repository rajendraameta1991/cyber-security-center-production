import { BarChart3, Monitor, MonitorCheck, MonitorX, ShieldAlert, TrendingDown, TrendingUp } from 'lucide-react'

const KPIs = [
  { label: 'Total Endpoints', value: 287, icon: Monitor, trend: '+5', trendUp: true, color: 'text-blue-400' },
  { label: 'Online Endpoints', value: 268, icon: MonitorCheck, trend: '+12', trendUp: true, color: 'text-emerald-400' },
  { label: 'Offline/Inactive', value: 19, icon: MonitorX, trend: '-8', trendUp: false, color: 'text-red-400' },
  { label: 'Critical Alerts', value: 3, icon: ShieldAlert, trend: '-2', trendUp: false, color: 'text-amber-400' },
  { label: 'Threats Blocked', value: 1247, icon: BarChart3, trend: '+89', trendUp: true, color: 'text-cyan' },
]

function Sparkline({ data }) {
  const width = 60
  const height = 24
  const max = Math.max(...data)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (v / max) * (height - 4)
    return `${x},${y}`
  }).join(' ')
  
  return (
    <svg width={width} height={height} className="absolute right-0 top-0 opacity-60">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function KPICards() {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {KPIs.map((kpi) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.trendUp ? TrendingUp : TrendingDown
        const trendColor = kpi.trendUp ? 'text-emerald-400' : 'text-red-400'
        const sparklineData = [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100]
        
        return (
          <div key={kpi.label} className="card-glass group relative overflow-hidden p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-cyan/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan/30 group-hover:to-blue-500/30 transition-colors">
                  <Icon size={20} className={`${kpi.color}`} />
                </div>
                <Sparkline data={sparklineData} />
              </div>
              
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value.toLocaleString()}</p>
              </div>
              
              <div className={`flex items-center gap-1 mt-3 ${trendColor} text-xs font-semibold`}>
                <TrendIcon size={14} />
                <span>{kpi.trend} vs yesterday</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
