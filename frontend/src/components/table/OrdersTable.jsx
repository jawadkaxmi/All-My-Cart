import React from 'react';
import { useTableState } from '../../hooks/useTableState';
import { formatPKR } from '../../utils/dataParser';
import { STATUS_CONFIG } from '../../styles/tokens';

function StarRating({ n }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          color: i <= n ? '#c8f55a' : '#2a2a3a',
          fontSize: 11,
        }}>★</span>
      ))}
    </div>
  );
}

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] || {};
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.05em',
      background: cfg.bg,
      color: cfg.color,
    }}>
      {status}
    </span>
  );
}

function PageButton({ label, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32, height: 32,
        borderRadius: 8,
        border: `1px solid ${active ? 'rgba(200,245,90,0.3)' : 'rgba(255,255,255,0.07)'}`,
        background: active ? 'rgba(200,245,90,0.12)' : 'transparent',
        color: active ? '#c8f55a' : '#666680',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        opacity: disabled ? 0.35 : 1,
        transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

const COLUMNS = [
  { key: 'Order_ID',         label: 'Order ID' },
  { key: 'Customer_Name',    label: 'Customer' },
  { key: 'City',             label: 'City' },
  { key: 'Product_Name',     label: 'Product' },
  { key: 'Total_Amount_PKR', label: 'Amount' },
  { key: 'Delivery_Status',  label: 'Status' },
  { key: 'Customer_Rating',  label: 'Rating' },
  { key: 'Order_Date',       label: 'Date' },
];

export default function OrdersTable({ data }) {
  const {
    filter, changeFilter,
    search, changeSearch,
    sort, toggleSort,
    page, setPage,
    totalPages,
    pageData,
    totalFiltered,
    start,
    PAGE_SIZE,
  } = useTableState(data);

  const pageRange = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pageRange.push(i);
  }

  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 36,
    }}>
      {/* Table Header */}
      <div style={{
        padding: '20px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{
          fontFamily: "'Horizon', 'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 15,
        }}>
          All Orders
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)',
            color: '#555570', fontSize: 14,
          }}>⌕</span>
          <input
            value={search}
            onChange={e => changeSearch(e.target.value)}
            placeholder="Search orders..."
            style={{
              background: '#18181f',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              padding: '8px 14px 8px 36px',
              color: '#f0f0f0',
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              width: 220,
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{
        padding: '12px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        gap: 6,
      }}>
        {['All', 'Delivered', 'Pending', 'Cancelled'].map(f => (
          <button
            key={f}
            onClick={() => changeFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 11,
              cursor: 'pointer',
              border: `1px solid ${filter === f ? 'rgba(200,245,90,0.3)' : 'rgba(255,255,255,0.07)'}`,
              background: filter === f ? 'rgba(200,245,90,0.1)' : 'transparent',
              color: filter === f ? '#c8f55a' : '#666680',
              fontFamily: "'DM Mono', monospace",
              transition: 'all 0.15s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: sort.col === col.key ? '#c8f55a' : '#555570',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {col.label} {sort.col === col.key ? (sort.dir === 1 ? '↑' : '↓') : '↕'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map(r => (
              <tr
                key={r.Order_ID}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <td style={{ padding: '13px 20px', fontSize: 11, color: '#555570', fontFamily: "'DM Mono', monospace" }}>
                  {r.Order_ID}
                </td>
                <td style={{ padding: '13px 20px', fontSize: 12, fontWeight: 500, color: '#f0f0f0' }}>
                  {r.Customer_Name}
                </td>
                <td style={{ padding: '13px 20px', fontSize: 12, color: '#c0c0d0' }}>
                  {r.City}
                </td>
                <td style={{ padding: '13px 20px' }}>
                  <div style={{ fontSize: 12, color: '#f0f0f0' }}>{r.Product_Name}</div>
                  <div style={{ fontSize: 10, color: '#555570', marginTop: 2 }}>{r.Product_Category}</div>
                </td>
                <td style={{
                  padding: '13px 20px',
                  fontFamily: "'Horizon', 'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#f0f0f0',
                }}>
                  {r.Total_Amount_PKR}
                </td>
                <td style={{ padding: '13px 20px' }}>
                  <Badge status={r.Delivery_Status} />
                </td>
                <td style={{ padding: '13px 20px' }}>
                  <StarRating n={r.ratingNum} />
                </td>
                <td style={{ padding: '13px 20px', fontSize: 11, color: '#555570', fontFamily: "'DM Mono', monospace" }}>
                  {r.Order_Date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{
        padding: '16px 28px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ color: '#555570', fontSize: 11, fontFamily: "'DM Mono', monospace" }}>
          Showing {start + 1}–{Math.min(start + PAGE_SIZE, totalFiltered)} of {totalFiltered} orders
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <PageButton label="‹" onClick={() => setPage(page - 1)} disabled={page === 1} />
          {pageRange[0] > 1 && (
            <>
              <PageButton label={1} onClick={() => setPage(1)} />
              {pageRange[0] > 2 && <span style={{ padding: '0 4px', color: '#555570' }}>…</span>}
            </>
          )}
          {pageRange.map(p => (
            <PageButton key={p} label={p} onClick={() => setPage(p)} active={p === page} />
          ))}
          {pageRange[pageRange.length - 1] < totalPages && (
            <>
              {pageRange[pageRange.length - 1] < totalPages - 1 && (
                <span style={{ padding: '0 4px', color: '#555570' }}>…</span>
              )}
              <PageButton label={totalPages} onClick={() => setPage(totalPages)} />
            </>
          )}
          <PageButton label="›" onClick={() => setPage(page + 1)} disabled={page === totalPages} />
        </div>
      </div>
    </div>
  );
}
