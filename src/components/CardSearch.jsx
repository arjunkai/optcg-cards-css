import { useState, useRef } from 'react';
import Card from './Card';
import { finishToEffect } from '../data/sample-cards';

const API_BASE = 'https://optcg-api.arjunbansal-ai.workers.dev';

export default function CardSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  function handleSearch(value) {
    setQuery(value);
    clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/cards?name=${encodeURIComponent(value)}&page_size=12`);
        const data = await res.json();
        setResults(data.data || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 400);
  }

  return (
    <div style={{ padding: '0 24px', marginBottom: 40 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search any card..."
        style={{
          width: '100%',
          maxWidth: 480,
          padding: '10px 16px',
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 8,
          color: 'white',
          fontSize: 14,
          outline: 'none',
        }}
      />
      {loading && (
        <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>Searching...</p>
      )}
      {results.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          marginTop: 20,
        }}>
          {results.map((card) => (
            <div key={card.id} style={{ width: 180 }}>
              <Card
                image={`${API_BASE}/images/${card.id}`}
                effect={finishToEffect(card.finish)}
                name={card.name}
              />
              <p style={{
                color: '#9ca3af',
                fontSize: 11,
                marginTop: 6,
                textAlign: 'center',
              }}>
                {card.name}
                <span style={{ display: 'block', color: '#6b7280', fontSize: 10 }}>
                  {card.id} · {card.rarity}{card.variant_type ? ` · ${card.variant_type}` : ''}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
