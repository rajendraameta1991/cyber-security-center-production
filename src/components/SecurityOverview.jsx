import { AlertTriangle, CheckCircle2, Shield, Zap } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const complianceData = [
  { name: 'Compliant', value: 215, color: '#10b981' },
  { name: 'Warning', value: 45, color: '#f59e0b' },
  { name: 'Non-Compliant', value: 27, color: '#ef4444' },
]

const endpointData = [
  { name: 'Protected', value: 268, color: '#27d3f2' },
  { name: 'Unprotected', value: 19, color: '#ef4444' },
]

export function SecurityOverview() {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300">Threat Level Gauge</h3>
          <AlertTriangle size={18} className="text-amber-400" />
        </div>
        <div className="space-y-4">
          {[
            { label: 'Critical', count: 3, color: 'bg-red-500', width: 'w-[30%]' },
            { label: 'High', count: 12, color: 'bg-amber-500', width: 'w-[45%]' },
            { label: 'Medium', count: 34, color: 'bg-yellow-500', width: 'w-[65%]' },
            { label: 'Low', count: 156, color: 'bg-blue-500', width: 'w-[95%]' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-400">{item.label}</span>
                <span className="text-xs font-bold text-slate-200">{item.count}</span>
              </div>
              <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} transition-all duration-500`} style={{width: item.width}} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300">Compliance Status</h3>
          <CheckCircle2 size={18} className="text-emerald-400" />
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={complianceData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none" paddingAngle={2}>
                {complianceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 mt-4">
          {complianceData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}} />
                {item.name}
              </span>
              <span className="font-semibold text-slate-200">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300">Protection Coverage</h3>
          <Shield size={18} className="text-cyan" />
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={endpointData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                {endpointData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Protected
            </span>
            <span className="font-bold">268</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              Unprotected
            </span>
            <span className="font-bold">19</span>
          </div>
          <div className="mt-4 pt-4 border-t border-line/50">
            <p className="text-xs text-slate-400">Coverage</p>
            <p className="text-2xl font-bold text-cyan mt-1">93.4%</p>
          </div>
        </div>
      </div>
      
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300">Security Metrics</h3>
          <Zap size={18} className="text-cyan" />
        </div>
        <div className="space-y-4">
          {[
            { label: 'Patch Compliance', value: 92, icon: '📦' },
            { label: 'Malware Status', value: 98, icon: '🛡️' },
            { label: 'Firewall Status', value: 100, icon: '🔥' },
            { label: 'Antivirus Active', value: 96, icon: '✅' },
          ].map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{metric.label}</span>
                <span className={`text-xs font-bold ${
                  metric.value >= 95 ? 'text-emerald-400' :
                  metric.value >= 85 ? 'text-blue-400' :
                  'text-amber-400'
                }`}>{metric.value}%</span>
              </div>
              <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${
                  metric.value >= 95 ? 'bg-emerald-500' :
                  metric.value >= 85 ? 'bg-blue-500' :
                  'bg-amber-500'
                }`} style={{width: `${metric.value}%`}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
