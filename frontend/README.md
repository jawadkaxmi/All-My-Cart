# PK Retail Intelligence Dashboard

A React + CSS dashboard for Pakistan retail sales analytics.

## Project Structure

```
pk-retail-dashboard/
├── package.json
├── README.md
└── src/
    ├── App.jsx                          # Root component, layout orchestration
    ├── data/
    │   └── salesData.js                 # Raw CSV data as ES module
    ├── hooks/
    │   └── useTableState.js             # Table filter/sort/pagination logic
    ├── utils/
    │   └── dataParser.js                # CSV parsing, data enrichment, aggregation
    ├── styles/
    │   └── tokens.js                    # Design tokens: colors, chart palette, status config
    └── components/
        ├── layout/
        │   ├── Header.jsx               # Sticky top bar with live stats
        │   ├── KpiCard.jsx              # Animated metric card
        │   └── SectionLabel.jsx         # Divider with label
        ├── charts/
        │   ├── CategoryBarChart.jsx     # Revenue by product category
        │   ├── DeliveryDonut.jsx        # SVG donut: delivery status split
        │   ├── CityRevenueChart.jsx     # Horizontal bars: top 8 cities
        │   ├── RatingsChart.jsx         # 1–5 star distribution
        │   └── PaymentMethodsChart.jsx  # Payment method breakdown
        └── table/
            └── OrdersTable.jsx          # Filterable, sortable, paginated orders table
```

## Tech Stack
- React 18 (hooks: useState, useMemo, useEffect, useRef)
- Vite (bundler)
- Pure CSS-in-JS (no external CSS framework)
- Horizon / Syne (display font), DM Mono (monospace)

## Design System
- Dark theme: `#0a0a0f` background, `#111118` surfaces
- Accent: `#c8f55a` (lime), `#ff6b35` (orange), `#7b61ff` (violet), `#06d6a0` (teal)
- Typography: Horizon (headings/display), DM Mono (data/labels)
