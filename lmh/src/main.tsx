import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { Session } from '@supabase/supabase-js'
import { getModuleTarget, type ExternalModuleId } from './integrations'
import { loadCurrentIdentity, type HubIdentity } from './identity'
import { hubModules, type HubModule } from './modules'
import { hasSupabaseConfig, supabase } from './supabase'
import './styles.css'
import './animations.css'
import './auth.css'
import './identity.css'

const statusLabels = {
  available: 'Verfügbar',
  prepared: 'Vorbereitet',
  planned: 'Geplant',
} as const

function isExternalModuleId(id: string): id is ExternalModuleId {
  return id === 'ls-connect' || id === 'pcad' || id === 'banking'
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'LS'
}

function App() {
  const [activeModule, setActiveModule] = useState<HubModule | null>(null)
  const [now, setNow] = useState(new Date())
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [identity, setIdentity] = useState<HubIdentity | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [identityError, setIdentityError] = useState('')
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
      setIdentity(null)
      setActiveModule(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setIdentity(null)
      setIdentityError('')
      return
    }

    let cancelled = false
    setIdentityError('')

    void loadCurrentIdentity()
      .then((nextIdentity) => {
        if (!cancelled) setIdentity(nextIdentity)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setIdentity(null)
        setIdentityError(error instanceof Error ? error.message : 'Identität konnte nicht geladen werden.')
      })

    return () => {
      cancelled = true
    }
  }, [session])

  const time = useMemo(
    () => now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    [now],
  )

  const authorizedModules = useMemo(() => {
    if (!identity) return []
    const visibleApps = new Set<string>(identity.visible_apps)
    return hubModules.filter((module) => visibleApps.has(module.id))
  }, [identity])

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

  const displayName = identity?.character?.name || identity?.account.email || 'LS-Connect Account'
  const identityMeta = identity?.character
    ? `${identity.character.handle} · ${identity.character.account_type}`
    : identity?.account.collaboration_code
      ? `Code ${identity.account.collaboration_code}`
      : 'Noch kein aktiver Charakter'

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
                <p className="eyebrow">LS MOBILE HUB · v0.5.0</p>
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
                <div className="auth-note">Identität und Freigaben stammen direkt aus dem gemeinsamen LS-Connect-/LMH-Backend.</div>
              </div>
            </section>
          ) : activeModule ? (
            <section className="module-view">
              <button className="back-button" onClick={() => setActiveModule(null)}>
                ‹ Home
              </button>
              <div className="module-card-large">
                <div className="module-icon-large">{activeModule.icon}</div>
                <p className="eyebrow">LS MOBILE HUB · v0.5.0</p>
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

              {identity ? (
                <div className="identity-card">
                  <div className="identity-avatar">{initials(displayName)}</div>
                  <div className="identity-copy">
                    <div className="identity-name">{displayName}</div>
                    <div className="identity-meta">{identityMeta}</div>
                    <div className="identity-roles">
                      {identity.roles.map((role) => <span className="identity-role" key={role}>{role}</span>)}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="home-header">
                <p className="eyebrow">LOS SANTOS · MOBILE SYSTEM</p>
                <h1>LS Mobile Hub</h1>
                <p>LS-Connect-Identität und Hub-Berechtigungen sind zentral verbunden.</p>
              </div>

              {!identity && !identityError ? (
                <div className="placeholder-panel"><strong>LS-Connect-Identität wird geladen …</strong></div>
              ) : identity ? (
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
              ) : null}

              {identityError ? <div className="auth-error">LS-Connect-Identität konnte nicht geladen werden: {identityError}</div> : null}

              <div className="home-footer">
                <span>LMH</span>
                <span>v0.5.0 · LS-Connect-Integration</span>
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
