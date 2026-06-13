import { createContext, useContext, useMemo, useState } from 'react'
import { activities, computers, threats } from '../data/mockData'

const SecurityContext = createContext(null)

export function SecurityProvider({ children }) {
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedComputer, setSelectedComputer] = useState(null)

  const stats = useMemo(() => ({
    total: 248,
    online: 231,
    offline: 17,
    malware: threats.length,
    uploads: 47,
  }), [])

  return (
    <SecurityContext.Provider value={{
      activities, computers, threats, stats, search, setSearch,
      sidebarOpen, setSidebarOpen, selectedComputer, setSelectedComputer,
    }}>
      {children}
    </SecurityContext.Provider>
  )
}

export const useSecurity = () => useContext(SecurityContext)
