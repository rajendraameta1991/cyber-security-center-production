import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { useSecurity } from '../context/SecurityContext'
import { Badge, EmptyState, FilterBar, ViewButton } from './UI'

export function ComputerTable({ limit, showFilter = true }) {
  const { computers, setSelectedComputer } = useSecurity()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')
  const filtered = useMemo(() => computers.filter(c => JSON.stringify(c).toLowerCase().includes(search.toLowerCase())).sort((a, b) => String(a[sort]).localeCompare(String(b[sort]))).slice(0, limit), [computers, search, sort, limit])
  const cols = [['name', 'Computer name'], ['ip', 'IP address'], ['user', 'User'], ['status', 'Status'], ['cpu', 'CPU'], ['ram', 'RAM'], ['os', 'Operating system'], ['lastSeen', 'Last seen']]
  return <div>
    {showFilter && <FilterBar search={search} setSearch={setSearch} placeholder="Search computer inventory..." />}
    <div className="table-wrap">
      <table className="data-table min-w-[900px]"><thead><tr>
        {cols.map(([key, label]) => <th key={key}><button className="inline-flex items-center gap-1 hover:text-cyan" onClick={() => setSort(key)}>{label}<ArrowUpDown size={11} /></button></th>)}<th />
      </tr></thead><tbody>
        {filtered.map(c => <tr key={c.name}><td className="font-semibold !text-white">{c.name}</td><td>{c.ip}</td><td>{c.user}</td><td><Badge>{c.status}</Badge></td><td>{c.cpu}%</td><td>{c.ram}%</td><td>{c.os}</td><td>{c.lastSeen}</td><td><ViewButton onClick={() => setSelectedComputer(c)} /></td></tr>)}
      </tbody></table>
      {!filtered.length && <EmptyState />}
    </div>
  </div>
}
