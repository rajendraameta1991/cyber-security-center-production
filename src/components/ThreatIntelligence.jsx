import { AlertTriangle, BarChart3, Zap, Target } from 'lucide-react'

const topThreats = [
  { id: 1, name: 'Emotet Trojan', category: 'Banking Malware', risk: 'CRITICAL', detected: 3, icon: '💀' },
  { id: 2, name: 'Ransomware.Sodinokibi', category: 'File Encryptor', risk: 'CRITICAL', detected: 5, icon: '🔒' },
  { id: 3, name: 'PUA/ProgramID', category: 'Potentially Unwanted', risk: 'HIGH', detected: 12, icon: '⚠️' },
  { id: 4, name: 'Adware.Bundler', category: 'Advertisement', risk: 'MEDIUM', detected: 28, icon: '📢' },
]

const riskDistribution = [
  { level: 'CRITICAL', count: 8, percentage: 12, color: 'bg-red-500' },
  { level: 'HIGH', count: 23, percentage: 35, color: 'bg-amber-500' },
  { level: 'MEDIUM', count: 28, percentage: 42, color: 'bg-yellow-500' },
  { level: 'LOW', count: 6, percentage: 11, color: 'bg-blue-500' },
]

const mitreAttackMappings = [
  { tactic: 'Execution', technique: 'Malicious Script', color: 'text-red-400' },
  { tactic: 'Persistence', technique: 'Registry Run Keys', color: 'text-amber-400' },
  { tactic: 'Privilege Escalation', technique: 'Exploitation', color: 'text-yellow-400' },
  { tactic: 'Defense Evasion', technique: 'Process Hiding', color: 'text-blue-400' },
]

export function ThreatIntelligence() {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300">Top Threats</h3>
          <AlertTriangle size={18} className="text-red-400" />
        </div>
        
        <div className="space-y-3">
          {topThreats.map((threat) => (
            <div key={threat.id} className="rounded-lg border border-line/50 bg-slate-950/30 p-3 hover:bg-slate-950/50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-2 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">{threat.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{threat.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{threat.category}</p>
                  </div>
                </div>
                <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded ${
                  threat.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                  threat.risk === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{threat.risk}</span>
              </div>
              <p className="text-[10px] text-cyan mt-2">Detected {threat.detected}x</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300">Risk Distribution</h3>
          <BarChart3 size={18} className="text-cyan" />
        </div>
        
        <div className="space-y-4">
          {riskDistribution.map((risk) => (
            <div key={risk.level}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${
                  risk.level === 'CRITICAL' ? 'text-red-400' :
                  risk.level === 'HIGH' ? 'text-amber-400' :
                  risk.level === 'MEDIUM' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>{risk.level}</span>
                <span className="text-xs font-semibold text-slate-300">{risk.count} ({risk.percentage}%)</span>
              </div>
              <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${risk.color}`} style={{width: `${risk.percentage}%`}} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300">Critical Alerts</h3>
          <Zap size={18} className="text-amber-400" />
        </div>
        
        <div className="space-y-3">
          {[
            { title: 'Unauthorized Access Attempt', device: 'HOSP-WS-042', count: 3 },
            { title: 'Certificate Validation Failed', device: 'HOSP-SRV-05', count: 1 },
            { title: 'Brute Force Attack Detected', device: 'HOSP-DB-01', count: 47 },
          ].map((alert, index) => (
            <div key={index} className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 hover:bg-red-500/10 transition-colors">
              <p className="text-xs font-semibold text-red-300">{alert.title}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-slate-400">{alert.device}</p>
                <span className="text-xs font-bold text-red-400">×{alert.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300">MITRE ATT&CK</h3>
          <Target size={18} className="text-cyan" />
        </div>
        
        <div className="space-y-3">
          {mitreAttackMappings.map((mapping, index) => (
            <div key={index} className="rounded-lg border border-line/50 bg-slate-950/30 p-3 hover:bg-slate-950/50 transition-colors">
              <p className={`text-[10px] font-bold ${mapping.color}`}>{mapping.tactic}</p>
              <p className="text-xs text-slate-200 mt-2">{mapping.technique}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
