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

  return <main className="relative grid min-h-screen w-full lg:grid-cols-2 bg-white text-gray-900">
    {/* Left Column: Light Theme Login Form */}
    <section className="flex flex-col p-8 sm:p-12 lg:p-16 justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 lg:hidden">
          <div className="rounded-2xl bg-ink p-4 w-fit shadow-md"><Brand /></div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {isSetup ? 'Create initial administrator' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isSetup
            ? 'Complete the secure one-time setup to activate the portal.'
            : 'Please enter your details.'}
        </p>

        {/* OAuth Mock Buttons */}
        {!isSetup && (
          <div className="mt-8 space-y-3">
            <button type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign in with Google
            </button>
            <button type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Sign in with GitHub
            </button>
            <div className="relative mt-8 flex items-center py-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 px-4 text-xs text-gray-500 uppercase tracking-wide">Or continue with email</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={submit}>
          {isSetup && (
            <>
              <Field icon={KeyRound} label="Server setup key" value={form.setupKey} onChange={update('setupKey')} type="password" autoComplete="off" />
              <Field icon={UserRound} label="Display name" value={form.displayName} onChange={update('displayName')} autoComplete="name" />
            </>
          )}
          <Field icon={UserRound} label="Username" value={form.username} onChange={update('username')} autoComplete="username" />
          <Field icon={LockKeyhole} label="Password" value={form.password} onChange={update('password')} type="password" autoComplete={isSetup ? 'new-password' : 'current-password'} />

          {isSetup && <p className="text-[11px] leading-5 text-gray-500">Use at least 12 characters with uppercase, lowercase, and a number.</p>}

          {!isSetup && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember for 30 days</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
            </div>
          )}

          {error && <p className="rounded-lg border border-red-400/20 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

          <button disabled={busy} className="mt-6 flex w-full justify-center rounded-lg bg-gray-900 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-wait disabled:opacity-70">
            {busy ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            {isSetup ? 'Create admin account' : 'Sign in'}
          </button>
        </form>

        {!isSetup && (
          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">Sign up</a>
          </p>
        )}
      </div>
    </section>

    {/* Right Column: Dark Theme Promotional Panel */}
    <section className="hidden relative bg-ink lg:flex lg:flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,.18),transparent_30%),radial-gradient(circle_at_90%_90%,rgba(39,211,242,.09),transparent_32%)]" />
      <div className="relative flex flex-col justify-between h-full p-10 lg:p-16">
        <div>
          <Brand />
        </div>

        <div className="mt-auto mb-16">
          <span className="mb-5 inline-flex rounded-xl bg-blue-500/10 p-3 text-cyan"><LockKeyhole /></span>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.28em] text-cyan">Secure access gateway</p>
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white">Hospital security operations, protected by design.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-400">Authorized personnel only. Access is logged and monitored by the Cyber Security Center.</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <ShieldCheck size={16} /> Encrypted session authentication
        </div>
      </div>
    </section>
  </main>
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <span className="relative block">
        <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          required
          className="block w-full rounded-lg border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white outline-none transition-shadow"
          {...props}
        />
      </span>
    </label>
  )
}
