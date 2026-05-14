import React, { useState } from 'react';
import { formatPKR } from '../../utils/dataParser';
import { CHART_COLORS } from '../../styles/tokens';

export default function CategoryBarChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const max = data[0]?.[1] || 1;

  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      padding: '28px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: "'Horizon', 'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 14,
        }}>
          Revenue by Category
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          background: 'rgba(200,245,90,0.1)',
          color: '#c8f55a',
          padding: '3px 10px',
          borderRadius: 20,
          border: '1px solid rgba(200,245,90,0.2)',
        }}>
          PKR
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, position: 'relative' }}>
        {data.map(([cat, rev], i) => {
          const pct = (rev / max) * 100;
          const color = CHART_COLORS[i % CHART_COLORS.length];
          return (
            <div
              key={cat}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}
            >
              <div
                onMouseEnter={() => setTooltip({ cat, rev, color, index: i })}
                onMouseLeave={() => setTooltip(null)}
                style={{
                  width: '100%',
                  height: `${Math.max(pct, 4)}%`,
                  borderRadius: '6px 6px 0 0',
                  background: color,
                  transition: 'opacity 0.2s, height 0.8s ease',
                  opacity: tooltip && tooltip.index !== i ? 0.5 : 1,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              />
              <div style={{ fontSize: 9, color: '#555570', textAlign: 'center', lineHeight: 1.2 }}>
                {cat}
              </div>
            </div>
          );
        })}
      </div>

      {tooltip && (
        <div style={{
          marginTop: 12,
          padding: '8px 14px',
          background: '#18181f',
          border: `1px solid ${tooltip.color}44`,
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#9999aa' }}>{tooltip.cat}</span>
          <span style={{ fontFamily: "'Horizon', 'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: tooltip.color }}>
            {formatPKR(tooltip.rev)}
          </span>
        </div>
      )}
    </div>
  );
}
