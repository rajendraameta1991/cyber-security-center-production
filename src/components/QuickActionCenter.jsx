import { Plus, Zap, Lock, AlertCircle, HardDriveUpload, Ticket } from 'lucide-react'

const actions = [
  { id: 1, icon: Zap, label: 'Scan Device', description: 'Run full security scan', color: 'from-blue-500 to-blue-600', textColor: 'text-blue-400' },
  { id: 2, icon: Lock, label: 'Isolate Device', description: 'Remove from network', color: 'from-red-500 to-red-600', textColor: 'text-red-400' },
  { id: 3, icon: AlertCircle, label: 'Create Incident', description: 'Log security event', color: 'from-amber-500 to-amber-600', textColor: 'text-amber-400' },
  { id: 4, icon: HardDriveUpload, label: 'Add Asset', description: 'Register new endpoint', color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-400' },
  { id: 5, icon: Ticket, label: 'Create Ticket', description: 'Open support ticket', color: 'from-violet-500 to-violet-600', textColor: 'text-violet-400' },
  { id: 6, icon: Plus, label: 'More Actions', description: 'View all options', color: 'from-cyan-500 to-cyan-600', textColor: 'text-cyan' },
]

export function QuickActionCenter() {
  return (
    <div className="card-glass">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300">Quick Action Center</h3>
        <p className="text-xs text-slate-500 mt-1">Common security operations</p>
      </div>
      
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button key={action.id} className="group relative overflow-hidden rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan/20 border border-line/50 hover:border-cyan/50 bg-slate-950/40 hover:bg-slate-900/60">
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative flex flex-col items-center gap-2 text-center">
                <div className={`relative h-10 w-10 rounded-lg bg-gradient-to-br ${action.color} bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-all`}>
                  <Icon size={20} className={action.textColor} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">{action.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1 hidden sm:block">{action.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
