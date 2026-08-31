import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { hubModules, type HubModule } from './modules'
import './styles.css'

const statusLabels = {
  available: 'Verfügbar',
  prepared: 'Vorbereitet',
  planned: 'Geplant',
} as const

function App() {
  const [activeModule, setActiveModule] = useState<HubModule | null>(null)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const time = useMemo(
    () => now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    [now],
  )

  return (
    <main className="stage">
      <section className="phone" aria-label="LS Mobile Hub Smartphone">
        <div className="speaker" />
        <div className="screen">
          <header className="statusbar">
            <span>{time}</span>
            <span className="status-icons">● ◒ ▰</span>
          </header>

          {activeModule ? (
            <section className="module-view">
              <button className="back-button" onClick={() => setActiveModule(null)}>
                ‹ Home
              </button>
              <div className="module-card-large">
                <div className="module-icon-large">{activeModule.icon}</div>
                <p className="eyebrow">LS MOBILE HUB · v0.1.1</p>
                <h1>{activeModule.name}</h1>
                <p>{activeModule.description}</p>
                <span className={`status-pill status-${activeModule.status}`}>
                  {statusLabels[activeModule.status]}
                </span>
                <div className="placeholder-panel">
                  <strong>Modul sauber abgegrenzt</strong>
                  <span>
                    Zieladressen und Schnittstellen liegen außerhalb der Oberfläche und können je Umgebung getrennt konfiguriert werden.
                  </span>
                </div>
              </div>
            </section>
          ) : (
            <section className="home-view">
              <div className="home-header">
                <p className="eyebrow">LOS SANTOS · MOBILE SYSTEM</p>
                <h1>LS Mobile Hub</h1>
                <p>Deine zentrale Oberfläche für Apps und Dienste.</p>
              </div>

              <div className="launcher" aria-label="App Launcher">
                {hubModules.map((module) => (
                  <button
                    className="app-tile"
                    key={module.id}
                    onClick={() => setActiveModule(module)}
                    aria-label={`${module.name} öffnen`}
                  >
                    <span className="app-icon">{module.icon}</span>
                    <span className="app-name">{module.shortName}</span>
                    <span className={`app-state app-state-${module.status}`} />
                  </button>
                ))}
              </div>

              <div className="home-footer">
                <span>LMH</span>
                <span>v0.1.1 · Struktur-Hotfix</span>
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
