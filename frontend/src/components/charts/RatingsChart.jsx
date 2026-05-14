import React from 'react';

export default function RatingsChart({ ratingCounts }) {
  const max = Math.max(...Object.values(ratingCounts));

  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      padding: '28px',
    }}>
      <div style={{
        fontFamily: "'Horizon', 'Syne', sans-serif",
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 24,
      }}>
        Customer Ratings
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[5, 4, 3, 2, 1].map(star => {
          const pct = max ? (ratingCounts[star] / max) * 100 : 0;
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                textAlign: 'right',
                color: '#666680',
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
              }}>
                {star}★
              </div>
              <div style={{ flex: 1, background: '#18181f', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #c8f55a, #7b61ff)',
                  borderRadius: 4,
                  transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ width: 30, color: '#666680', fontSize: 11, fontFamily: "'DM Mono', monospace" }}>
                {ratingCounts[star]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
