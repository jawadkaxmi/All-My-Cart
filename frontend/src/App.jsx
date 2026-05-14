import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import salesDataUrl from './data/cleaned_sales_data.csv';
import { enrichData, aggregateData, formatPKR } from './utils/dataParser';
import Header from './components/layout/Header';
import SectionLabel from './components/layout/SectionLabel';
import KpiCard from './components/layout/KpiCard';
import CategoryBarChart from './components/charts/CategoryBarChart';
import DeliveryDonut from './components/charts/DeliveryDonut';
import CityRevenueChart from './components/charts/CityRevenueChart';
import RatingsChart from './components/charts/RatingsChart';
import PaymentMethodsChart from './components/charts/PaymentMethodsChart';
import OrdersTable from './components/table/OrdersTable';

export default function App() {
  const [allData, setAllData] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(salesDataUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        });
        const enriched = enrichData(result.data || []);
        const aggregated = aggregateData(enriched);
        setAllData(enriched);
        setStats(aggregated);
      })
      .catch((err) => {
        console.error('CSV Load Error:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div style={{ color: 'red', padding: 40, fontFamily: 'monospace' }}>
        Error loading data: {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{
        background: '#0a0a0f', minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#c8f55a', fontFamily: 'monospace', fontSize: 18,
      }}>
        Loading PK Retail Dashboard...
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Revenue',
      value: formatPKR(stats.totalRevenue),
      sub: `${stats.totalOrders.toLocaleString()} orders processed`,
      color: '#c8f55a',
    },
    {
      label: 'Delivered Orders',
      value: stats.delivered.toLocaleString(),
      sub: `${((stats.delivered / stats.totalOrders) * 100).toFixed(0)}% fulfillment rate`,
      color: '#ff6b35',
    },
    {
      label: 'Unique Customers',
      value: stats.uniqueCustomers.toLocaleString(),
      sub: `Across ${stats.cityCount} cities`,
      color: '#7b61ff',
    },
    {
      label: 'Avg Rating',
      value: `${stats.avgRating} ★`,
      sub: 'Out of 5.0',
      color: '#06d6a0',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0a0a0f;
          color: #f0f0f0;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          min-height: 100vh;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        tr:hover td { background: rgba(255,255,255,0.018); }
      `}</style>

      <Header stats={stats} />

      <main style={{ padding: '36px 40px', maxWidth: 1600, margin: '0 auto' }}>

        {/* Analysis Summary Banner */}
        <div style={{
          background: 'rgba(200,245,90,0.06)',
          border: '1px solid rgba(200,245,90,0.2)',
          borderRadius: 12,
          padding: '16px 24px',
          marginBottom: 28,
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          fontSize: 12,
        }}>
          <div>
            <span style={{ color: '#666680' }}>TOP CITY: </span>
            <span style={{ color: '#c8f55a', fontWeight: 600 }}>{stats.topCity}</span>
            <span style={{ color: '#888' }}> · {formatPKR(stats.topCityRevenue)}</span>
          </div>
          <div>
            <span style={{ color: '#666680' }}>LEAST CITY: </span>
            <span style={{ color: '#ff6b35', fontWeight: 600 }}>{stats.bottomCity}</span>
            <span style={{ color: '#888' }}> · {formatPKR(stats.bottomCityRevenue)}</span>
          </div>
          <div>
            <span style={{ color: '#666680' }}>GENDER: </span>
            <span style={{ color: '#7b61ff' }}>Male {stats.maleCount}</span>
            <span style={{ color: '#888' }}> / </span>
            <span style={{ color: '#ff6b35' }}>Female {stats.femaleCount}</span>
          </div>
          <div>
            <span style={{ color: '#666680' }}>TOP PAYMENT: </span>
            <span style={{ color: '#06d6a0', fontWeight: 600 }}>
              {stats.paymentMethods[0]?.method} ({stats.paymentMethods[0]?.count})
            </span>
          </div>
          <div>
            <span style={{ color: '#666680' }}>TOP CATEGORY: </span>
            <span style={{ color: '#c8f55a', fontWeight: 600 }}>
              {stats.categoryRevenue[0]?.[0]}
            </span>
          </div>
        </div>

        <SectionLabel>Overview</SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 36,
        }}>
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} accentColor={k.color} />
          ))}
        </div>

        <SectionLabel>Revenue &amp; Status</SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 16,
          marginBottom: 36,
        }}>
          <CategoryBarChart data={stats.categoryRevenue} />
          <DeliveryDonut
            delivered={stats.delivered}
            pending={stats.pending}
            cancelled={stats.cancelled}
          />
        </div>

        <SectionLabel>Deep Dive</SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
          marginBottom: 36,
        }}>
          <CityRevenueChart data={stats.cityRevenue} />
          <RatingsChart ratingCounts={stats.ratingCounts} />
          <PaymentMethodsChart data={stats.paymentMethods} />
        </div>

        <SectionLabel>Orders</SectionLabel>
        <OrdersTable data={allData} />

      </main>
    </>
  );
}
