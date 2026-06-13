import { useState } from 'react'
import { ArrowRight, KeyRound, Loader2, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'
import { Brand } from '../components/Brand'
import { useAuth } from '../context/AuthContext'

export function AuthPage() {
  const { initialized, login, setup } = useAuth()
  const isSetup = initialized === false
  const [form, setForm] = useState({ setupKey: '', displayName: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value })
  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isSetup) await setup(form)
      else await login({ username: form.username, password: form.password })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 py-8">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,.18),transparent_30%),radial-gradient(circle_at_90%_90%,rgba(39,211,242,.09),transparent_32%)]" />
    <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-line/80 bg-[#081827]/85 shadow-[0_30px_100px_rgba(0,0,0,.38)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
      <section className="hidden border-r border-line/70 p-10 lg:flex lg:flex-col">
        <Brand />
        <div className="my-auto">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.28em] text-cyan">Secure access gateway</p>
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white">Hospital security operations, protected by design.</h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">Authorized personnel only. Access is logged and monitored by the Cyber Security Center.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400"><ShieldCheck size={16} /> Encrypted session authentication</div>
      </section>
      <section className="p-6 sm:p-10">
        <div className="mb-8 lg:hidden"><Brand /></div>
        <span className="mb-5 inline-flex rounded-xl bg-blue-500/10 p-3 text-cyan"><LockKeyhole /></span>
        <h2 className="text-2xl font-bold text-white">{isSetup ? 'Create initial administrator' : 'Welcome back'}</h2>
        <p className="mt-2 text-sm leading-5 text-slate-500">{isSetup ? 'Complete the secure one-time setup to activate the portal.' : 'Sign in with your authorized Cyber Security Center account.'}</p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          {isSetup && <><Field icon={KeyRound} label="Server setup key" value={form.setupKey} onChange={update('setupKey')} type="password" autoComplete="off" /><Field icon={UserRound} label="Display name" value={form.displayName} onChange={update('displayName')} autoComplete="name" /></>}
          <Field icon={UserRound} label="Username" value={form.username} onChange={update('username')} autoComplete="username" />
          <Field icon={LockKeyhole} label="Password" value={form.password} onChange={update('password')} type="password" autoComplete={isSetup ? 'new-password' : 'current-password'} />
          {isSetup && <p className="text-[11px] leading-5 text-slate-500">Use at least 12 characters with uppercase, lowercase, and a number.</p>}
          {error && <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">{error}</p>}
          <button disabled={busy} className="btn-primary w-full py-3 disabled:cursor-wait disabled:opacity-70">{busy ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}{isSetup ? 'Create admin account' : 'Sign in securely'}</button>
        </form>
        <p className="mt-8 text-center text-[10px] uppercase tracking-[.18em] text-slate-600">Created by Rajendra Ameta</p>
      </section>
    </div>
  </main>
}

function Field({ icon: Icon, label, ...props }) {
  return <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-400">{label}</span><span className="relative block"><Icon className="absolute left-3 top-3 text-slate-500" size={16} /><input required className="input w-full py-2.5 pl-10" {...props} /></span></label>
}
