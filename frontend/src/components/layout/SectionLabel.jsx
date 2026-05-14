import React from 'react';

export default function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#555570',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: "'DM Mono', monospace",
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
}
