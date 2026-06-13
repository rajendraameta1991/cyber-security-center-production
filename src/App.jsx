import { Navigate, Route, Routes } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ComputerModal } from './components/ComputerModal'
import { Layout } from './components/Layout'
import { useAuth } from './context/AuthContext'
import { Dashboard } from './pages/Dashboard'
import { ActivityMonitor, AuditLogs, Computers, EmailLogs, MalwareAlerts, NetworkMonitor, Reports, Settings, SoftwareInventory, UsbLogs, Users } from './pages/Pages'
import { AMCTracking, HelpDesk, ITAdminPanel, ITAssets, MaintenanceHistory } from './pages/ITOperations'
import { AuthPage } from './pages/AuthPage'

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center bg-ink text-cyan"><Loader2 className="animate-spin" size={32} /></div>
  if (!user) return <AuthPage />
  return <Layout><Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/computers" element={<Computers />} />
    <Route path="/activity" element={<ActivityMonitor />} />
    <Route path="/email-logs" element={<EmailLogs />} />
    <Route path="/malware" element={<MalwareAlerts />} />
    <Route path="/usb-logs" element={<UsbLogs />} />
    <Route path="/software" element={<SoftwareInventory />} />
    <Route path="/network" element={<NetworkMonitor />} />
    <Route path="/it-assets" element={<ITAssets />} />
    <Route path="/help-desk" element={<HelpDesk />} />
    <Route path="/amc" element={<AMCTracking />} />
    <Route path="/maintenance" element={<MaintenanceHistory />} />
    <Route path="/it-admin" element={<ITAdminPanel />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/users" element={<Users />} />
    <Route path="/audit" element={<AuditLogs />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes><ComputerModal /></Layout>
}
