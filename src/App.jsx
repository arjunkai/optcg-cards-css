import CardGallery from './components/CardGallery';
import CardSearch from './components/CardSearch';

export default function App() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        padding: '48px 24px 32px',
        borderBottom: '1px solid #2a2a2a',
        marginBottom: 32,
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
          OPTCG Cards CSS
        </h1>
        <p style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>
          Interactive holographic card effects for One Piece TCG
        </p>
        <p style={{ color: '#4b5563', marginTop: 4, fontSize: 12 }}>
          Hover over a card to see the effect. Touch and drag on mobile.
        </p>
      </header>

      {/* Search */}
      <CardSearch />

      {/* Gallery */}
      <CardGallery />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid #2a2a2a',
        marginTop: 40,
      }}>
        <p style={{ color: '#6b7280', fontSize: 12 }}>
          Open source · <a href="https://github.com/arjunkai/optcg-cards-css">GitHub</a> · Powered by <a href="https://optcg-api.arjunbansal-ai.workers.dev">OPTCG API</a>
        </p>
        <p style={{ color: '#4b5563', fontSize: 11, marginTop: 4 }}>
          CardPipeline LLC · Not affiliated with Bandai or Toei Animation
        </p>
      </footer>
    </div>
  );
}
