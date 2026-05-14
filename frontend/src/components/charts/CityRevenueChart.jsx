import React from 'react';
import { formatPKR } from '../../utils/dataParser';
import { CHART_COLORS } from '../../styles/tokens';

export default function CityRevenueChart({ data }) {
  const max = data[0]?.[1] || 1;
  const top8 = data.slice(0, 8);

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
        Top Cities by Revenue
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {top8.map(([city, rev], i) => {
          const pct = (rev / max) * 100;
          const color = CHART_COLORS[i % CHART_COLORS.length];
          return (
            <div key={city}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#d0d0e0' }}>{city}</span>
                <span style={{
                  fontFamily: "'Horizon', 'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  color,
                }}>
                  {formatPKR(rev)}
                </span>
              </div>
              <div style={{ background: '#18181f', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: color,
                  borderRadius: 4,
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
