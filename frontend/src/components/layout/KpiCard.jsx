import React, { useEffect, useRef, useState } from 'react';

export default function KpiCard({ label, value, sub, accentColor, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#111118',
        border: `1px solid ${hovered ? accentColor + '33' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16,
        padding: '24px 26px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s, transform 0.3s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        opacity: visible ? 1 : 0,
        animation: visible ? `fadeUp 0.6s ease both` : 'none',
        cursor: 'default',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 2,
        background: accentColor,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />

      {/* Glow spot */}
      <div style={{
        position: 'absolute',
        top: -40, right: -40,
        width: 120, height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#666680',
        marginBottom: 10,
        fontFamily: "'DM Mono', monospace",
      }}>
        {label}
      </div>

      <div style={{
        fontFamily: "'Horizon', 'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 30,
        lineHeight: 1,
        marginBottom: 6,
        color: accentColor,
        letterSpacing: '-0.5px',
      }}>
        {value}
      </div>

      <div style={{ fontSize: 11, color: '#555570' }}>
        {sub}
      </div>
    </div>
  );
}
