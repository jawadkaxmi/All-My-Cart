import React, { useEffect, useRef } from 'react';
import { STATUS_CONFIG } from '../../styles/tokens';

export default function DeliveryDonut({ delivered, pending, cancelled }) {
  const svgRef = useRef(null);
  const total = delivered + pending + cancelled;

  const segments = [
    { label: 'Delivered', n: delivered, color: STATUS_CONFIG.Delivered.color },
    { label: 'Pending',   n: pending,   color: STATUS_CONFIG.Pending.color },
    { label: 'Cancelled', n: cancelled, color: STATUS_CONFIG.Cancelled.color },
  ];

  const cx = 80, cy = 80, r = 60, strokeW = 16;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (!svgRef.current || !total) return;
    const svg = svgRef.current;
    svg.innerHTML = '';

    // Track ring
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bg.setAttribute('cx', cx); bg.setAttribute('cy', cy); bg.setAttribute('r', r);
    bg.setAttribute('fill', 'none');
    bg.setAttribute('stroke', '#18181f');
    bg.setAttribute('stroke-width', strokeW);
    svg.appendChild(bg);

    let offset = 0;
    segments.forEach(seg => {
      const pct = seg.n / total;
      const dash = circ * pct;
      const gap = circ - dash;
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      el.setAttribute('cx', cx); el.setAttribute('cy', cy); el.setAttribute('r', r);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', seg.color);
      el.setAttribute('stroke-width', strokeW);
      el.setAttribute('stroke-dasharray', `${dash} ${gap}`);
      el.setAttribute('stroke-dashoffset', -offset + circ / 4);
      el.setAttribute('stroke-linecap', 'round');
      el.style.transition = 'stroke-dasharray 1.2s ease';
      svg.appendChild(el);
      offset += dash;
    });

    // Center text
    const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t1.setAttribute('x', cx); t1.setAttribute('y', cy - 4);
    t1.setAttribute('text-anchor', 'middle'); t1.setAttribute('fill', '#f0f0f0');
    t1.setAttribute('font-size', '20'); t1.setAttribute('font-weight', '800');
    t1.setAttribute('font-family', 'Horizon, Syne, sans-serif');
    t1.textContent = total;
    svg.appendChild(t1);

    const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t2.setAttribute('x', cx); t2.setAttribute('y', cy + 14);
    t2.setAttribute('text-anchor', 'middle'); t2.setAttribute('fill', '#555570');
    t2.setAttribute('font-size', '9'); t2.setAttribute('font-family', 'DM Mono, monospace');
    t2.textContent = 'ORDERS';
    svg.appendChild(t2);
  }, [delivered, pending, cancelled]);

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
          Delivery Status
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
          Split
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <svg ref={svgRef} viewBox="0 0 160 160" width={160} height={160} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {segments.map(seg => (
            <div key={seg.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                <span style={{ color: '#9999aa', fontSize: 11 }}>{seg.label}</span>
              </div>
              <span style={{
                fontFamily: "'Horizon', 'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: seg.color,
              }}>
                {seg.n}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
