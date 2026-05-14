import { useState, useMemo } from 'react';

export function useTableState(data) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ col: 'Order_ID', dir: 1 });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const filtered = useMemo(() => {
    let d = data.slice();
    if (filter !== 'All') d = d.filter(r => r.Delivery_Status === filter);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(r =>
        r.Order_ID.toLowerCase().includes(q) ||
        r.Customer_Name.toLowerCase().includes(q) ||
        r.City.toLowerCase().includes(q) ||
        r.Product_Name.toLowerCase().includes(q) ||
        r.Payment_Method.toLowerCase().includes(q)
      );
    }
    d.sort((a, b) => {
      let va = a[sort.col] || '', vb = b[sort.col] || '';
      if (sort.col === 'Total_Amount_PKR') { va = a.totalNum; vb = b.totalNum; }
      if (sort.col === 'Customer_Rating') { va = a.ratingNum; vb = b.ratingNum; }
      if (sort.col === 'Order_Date') { va = a.dateObj; vb = b.dateObj; }
      return (va < vb ? -1 : va > vb ? 1 : 0) * sort.dir;
    });
    return d;
  }, [data, filter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageData = filtered.slice(start, start + PAGE_SIZE);

  function toggleSort(col) {
    setSort(prev => ({ col, dir: prev.col === col ? prev.dir * -1 : 1 }));
    setPage(1);
  }

  function changeFilter(f) { setFilter(f); setPage(1); }
  function changeSearch(s) { setSearch(s); setPage(1); }

  return {
    filter, changeFilter,
    search, changeSearch,
    sort, toggleSort,
    page: safePage, setPage,
    totalPages,
    pageData,
    totalFiltered: filtered.length,
    start,
    PAGE_SIZE,
  };
}
