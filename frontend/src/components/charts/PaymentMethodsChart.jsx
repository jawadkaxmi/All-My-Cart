import React from 'react';
import { formatPKR } from '../../utils/dataParser';
import { PAYMENT_ICONS } from '../../styles/tokens';

export default function PaymentMethodsChart({ data }) {
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
        Payment Methods
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(({ method, rev, count }) => (
          <div
            key={method}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              background: '#18181f',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ fontSize: 18 }}>{PAYMENT_ICONS[method] || '💰'}</div>
            <div style={{ flex: 1, fontSize: 11, color: '#d0d0e0' }}>{method}</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Horizon', 'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                color: '#c8f55a',
              }}>
                {formatPKR(rev)}
              </div>
              <div style={{ color: '#555570', fontSize: 10 }}>{count} orders</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
