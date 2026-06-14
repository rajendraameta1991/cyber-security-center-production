import { useSecurity } from '../context/SecurityContext'
import { DashboardHeader } from '../components/DashboardHeader'
import { KPICards } from '../components/KPICards'
import { SecurityOverview } from '../components/SecurityOverview'
import { LiveMonitoringPanel } from '../components/LiveMonitoringPanel'
import { ThreatCharts } from '../components/ThreatCharts'
import { QuickActionCenter } from '../components/QuickActionCenter'
import { ThreatIntelligence } from '../components/ThreatIntelligence'
import { ComputerTable } from '../components/ComputerTable'
import { Panel } from '../components/UI'

export function Dashboard() {
  const { stats } = useSecurity()
  
  return (
    <div className="space-y-6 pb-8">
      {/* Dashboard Header */}
      <DashboardHeader />
      
      {/* KPI Cards */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Key Performance Indicators</h2>
        <KPICards />
      </div>
      
      {/* Security Overview */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Security Overview</h2>
        <SecurityOverview />
      </div>
      
      {/* Live Monitoring */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Real-Time Monitoring</h2>
        <LiveMonitoringPanel />
      </div>
      
      {/* Threat Charts */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Threat Analytics</h2>
        <ThreatCharts />
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Operations</h2>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <QuickActionCenter />
          </div>
          
          {/* System Status Widget */}
          <div className="card-glass">
            <h3 className="text-sm font-semibold text-slate-300 mb-6">System Status</h3>
            <div className="space-y-4">
              {[
                { name: 'Database', status: 'Operational', color: 'text-emerald-400' },
                { name: 'API Gateway', status: 'Operational', color: 'text-emerald-400' },
                { name: 'Backup Service', status: 'Operational', color: 'text-emerald-400' },
                { name: 'Sync Service', status: 'Operational', color: 'text-emerald-400' },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-lg border border-line/50 bg-slate-950/30 hover:bg-slate-950/50 transition-colors">
                  <p className="text-sm text-slate-300">{service.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span className={`text-xs font-semibold ${service.color}`}>{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Threat Intelligence */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Threat Intelligence</h2>
        <ThreatIntelligence />
      </div>
      
      {/* Endpoint Summary */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Endpoint Status</h2>
        <Panel className="mt-0" title="Hospital Endpoints" subtitle="Live health and security status of all registered devices">
          <ComputerTable limit={10} />
        </Panel>
      </div>
    </div>
  )
}
