import Card from './Card';
import { SAMPLE_CARDS } from '../data/sample-cards';

export default function CardGallery() {
  return (
    <div style={{ padding: '0 24px' }}>
      {SAMPLE_CARDS.map((section) => (
        <div key={section.section} style={{ marginBottom: 40 }}>
          <h3 style={{
            color: '#6b7280',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: 16,
            fontWeight: 600,
          }}>
            {section.section} — {section.effect.replace(/-/g, ' ')}
          </h3>
          <div style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
          }}>
            {section.cards.map((card) => (
              <div key={card.id} style={{ width: 220 }}>
                <Card
                  image={card.image}
                  effect={section.effect}
                  name={card.name}
                />
                <p style={{
                  color: '#9ca3af',
                  fontSize: 12,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                  {card.name}
                  <span style={{ color: '#6b7280', marginLeft: 6 }}>{card.id}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
