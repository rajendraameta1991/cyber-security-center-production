import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function Layout({ children }) {
  return <div className="min-h-screen"><Sidebar /><main className="lg:pl-64"><Header /><div className="p-4 md:p-6">{children}</div></main></div>
}
