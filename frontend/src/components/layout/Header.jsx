import React from 'react';
import { formatPKR } from '../../utils/dataParser';
import { STATUS_CONFIG } from '../../styles/tokens';

export default function Header({ stats }) {
  return (
    <header style={{
      padding: '28px 40px 22px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10,10,15,0.88)',
      backdropFilter: 'blur(24px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{
          fontFamily: "'Horizon', 'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: '-0.5px',
        }}>
          PK<span style={{ color: '#c8f55a' }}>.</span>RETAIL
        </div>
        <div style={{
          height: 20,
          width: 1,
          background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{ fontSize: 11, color: '#666680', letterSpacing: '0.06em' }}>
          Intelligence Dashboard
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Delivered', 'Pending', 'Cancelled'].map(status => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: STATUS_CONFIG[status].color,
              }} />
              <span style={{ color: '#9999aa' }}>{status}:</span>
              <span style={{ color: STATUS_CONFIG[status].color, fontWeight: 600 }}>
                {stats?.[status.toLowerCase()] ?? '—'}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          color: '#666680',
          fontSize: 11,
          textAlign: 'right',
          lineHeight: 1.8,
          fontFamily: "'DM Mono', monospace",
        }}>
          <div>{stats?.totalOrders ?? '—'} orders · 12 cities</div>
          <div>
            May 2025 – May 2026 &nbsp;|&nbsp;
            <span style={{ color: '#c8f55a', fontWeight: 600 }}>
              {stats?.totalRevenue ? formatPKR(stats.totalRevenue) : '—'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
