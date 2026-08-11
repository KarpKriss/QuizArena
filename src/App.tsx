const pillars = [
  {
    title: 'Wiedza',
    text: 'Pytania z wielu kategorii i różne formaty rund sprawiają, że sama pamięć nie wystarcza.',
  },
  {
    title: 'Ryzyko',
    text: 'Decyzje podejmowane pod presją mogą dać przewagę albo szybko odwrócić sytuację.',
  },
  {
    title: 'Interakcja',
    text: 'Quiz Arena ma być grą stołową, w której gracze reagują na siebie, a nie tylko odpowiadają na pytania.',
  },
]

export default function App() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__eyebrow">QUIZ ARENA</div>
        <h1>Wiedza to dopiero początek.</h1>
        <p className="hero__lead">
          Projekt strony internetowej dla imprezowej gry quizowej łączącej wiedzę,
          ryzyko, taktykę i interakcję między graczami.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#o-grze">
            Poznaj projekt
          </a>
          <a className="button button--secondary" href="#status">
            Status developmentu
          </a>
        </div>
      </section>

      <section className="section" id="o-grze">
        <div className="section__heading">
          <span>DNA GRY</span>
          <h2>Nie kolejny zwykły quiz.</h2>
        </div>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article className="pillar-card" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section status" id="status">
        <div>
          <span className="status__label">PHASE 0</span>
          <h2>Fundament projektu jest gotowy.</h2>
        </div>
        <p>
          Obecna wersja jest świadomie minimalistycznym szkieletem. Kolejne etapy
          obejmą architekturę informacji, identyfikację wizualną, prezentację gry oraz
          funkcje cyfrowego companion app.
        </p>
      </section>
    </main>
  )
}
