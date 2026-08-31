import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { Session } from '@supabase/supabase-js'
import { getModuleTarget, type ExternalModuleId } from './integrations'
import { hubModules, type HubModule } from './modules'
import { hasSupabaseConfig, supabase } from './supabase'
import './styles.css'
import './animations.css'
import './auth.css'

const statusLabels = {
  available: 'Verfügbar',
  prepared: 'Vorbereitet',
  planned: 'Geplant',
} as const

function isExternalModuleId(id: string): id is ExternalModuleId {
  return id === 'ls-connect' || id === 'pcad' || id === 'banking'
}

function App() {
  const [activeModule, setActiveModule] = useState<HubModule | null>(null)
  const [now, setNow] = useState(new Date())
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [visibleAppIds, setVisibleAppIds] = useState<Set<string> | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [permissionError, setPermissionError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setSession(null)
      return
    }

    void supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setActiveModule(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setVisibleAppIds(null)
      return
    }

    let cancelled = false
    setPermissionError('')

    void supabase.rpc('hub_visible_apps').then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        setVisibleAppIds(new Set())
        setPermissionError(error.message)
        return
      }

      const ids = new Set((data ?? []).map((row: { app_id: string }) => row.app_id))
      setVisibleAppIds(ids)
    })

    return () => {
      cancelled = true
    }
  }, [session])

  const time = useMemo(
    () => now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    [now],
  )

  const authorizedModules = useMemo(
    () => (visibleAppIds ? hubModules.filter((module) => visibleAppIds.has(module.id)) : []),
    [visibleAppIds],
  )

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError('')
    setAuthBusy(true)

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) setAuthError(error.message)
    setAuthBusy(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  function openModule(module: HubModule) {
    if (isExternalModuleId(module.id)) {
      const target = getModuleTarget(module.id)
      if (target.url) {
        window.location.assign(target.url)
        return
      }
    }

    setActiveModule(module)
  }

  return (
    <main className="stage">
      <section className="phone" aria-label="LS Mobile Hub Smartphone">
        <div className="speaker" />
        <div className="screen">
          <header className="statusbar">
            <span>{time}</span>
            <span className="status-icons">● ◒ ▰</span>
          </header>

          {session === undefined ? (
            <section className="loading-view">LMH wird geladen …</section>
          ) : !session ? (
            <section className="auth-view">
              <div className="auth-card">
                <p className="eyebrow">LS MOBILE HUB · v0.4.0</p>
                <h1>Anmelden</h1>
                <p>Nutze deinen bestehenden LS-Connect-Account. Der Hub besitzt kein separates Benutzerkonto.</p>
                <form className="auth-form" onSubmit={signIn}>
                  <label>
                    E-Mail
                    <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  </label>
                  <label>
                    Passwort
                    <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                  </label>
                  <button className="primary-button" type="submit" disabled={authBusy || !hasSupabaseConfig}>
                    {authBusy ? 'Anmeldung …' : 'Anmelden'}
                  </button>
                </form>
                {authError ? <div className="auth-error">{authError}</div> : null}
                <div className="auth-note">Zugriffe werden serverseitig über LMH-Rollen und Supabase RLS geprüft.</div>
              </div>
            </section>
          ) : activeModule ? (
            <section className="module-view">
              <button className="back-button" onClick={() => setActiveModule(null)}>
                ‹ Home
              </button>
              <div className="module-card-large">
                <div className="module-icon-large">{activeModule.icon}</div>
                <p className="eyebrow">LS MOBILE HUB · v0.4.0</p>
                <h1>{activeModule.name}</h1>
                <p>{activeModule.description}</p>
                <span className={`status-pill status-${activeModule.status}`}>
                  {statusLabels[activeModule.status]}
                </span>
                <div className="placeholder-panel">
                  <strong>Modul noch nicht angebunden</strong>
                  <span>Für dieses Modul ist in der aktuellen Umgebung noch keine Zieladresse konfiguriert.</span>
                </div>
              </div>
            </section>
          ) : (
            <section className="home-view">
              <div className="session-strip">
                <span>{session.user.email ?? 'Angemeldeter Nutzer'}</span>
                <button onClick={signOut}>Abmelden</button>
              </div>
              <div className="home-header">
                <p className="eyebrow">LOS SANTOS · MOBILE SYSTEM</p>
                <h1>LS Mobile Hub</h1>
                <p>Nur für dich freigegebene Apps werden angezeigt.</p>
              </div>

              {visibleAppIds === null ? (
                <div className="placeholder-panel"><strong>Berechtigungen werden geladen …</strong></div>
              ) : (
                <div className="launcher" aria-label="App Launcher">
                  {authorizedModules.map((module) => (
                    <button
                      className="app-tile"
                      key={module.id}
                      onClick={() => openModule(module)}
                      aria-label={`${module.name} öffnen`}
                    >
                      <span className="app-icon">{module.icon}</span>
                      <span className="app-name">{module.shortName}</span>
                      <span className={`app-state app-state-${module.status}`} />
                    </button>
                  ))}
                </div>
              )}

              {permissionError ? <div className="auth-error">Berechtigungen konnten nicht geladen werden: {permissionError}</div> : null}

              <div className="home-footer">
                <span>LMH</span>
                <span>v0.4.0 · Rollen & Rechte</span>
              </div>
            </section>
          )}

          <div className="home-indicator" />
        </div>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
