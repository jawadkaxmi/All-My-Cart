export function parseAmount(str) {
  if (typeof str === 'number') return str;
  return parseInt((str || '0').replace(/[^0-9]/g, '')) || 0;
}

export function enrichData(rawRows) {
  return rawRows.map(r => ({
    ...r,
    totalNum: parseAmount(r.Total_Amount_PKR),
    unitNum: parseAmount(r.Unit_Price_PKR),
    ratingNum: parseInt(r.Customer_Rating) || 0,
    dateObj: new Date(r.Order_Date),
  }));
}

export function formatPKR(n) {
  if (n >= 1e7) return 'Rs ' + (n / 1e7).toFixed(1) + 'Cr';
  if (n >= 1e5) return 'Rs ' + (n / 1e5).toFixed(1) + 'L';
  return 'Rs ' + n.toLocaleString();
}

export function aggregateData(data) {
  const totalRevenue = data.reduce((s, r) => s + r.totalNum, 0);
  const delivered = data.filter(r => r.Delivery_Status === 'Delivered').length;
  const pending = data.filter(r => r.Delivery_Status === 'Pending').length;
  const cancelled = data.filter(r => r.Delivery_Status === 'Cancelled').length;
  const avgRating = (data.reduce((s, r) => s + r.ratingNum, 0) / data.length).toFixed(1);
  const uniqueCustomers = new Set(data.map(r => r.Customer_ID)).size;

  const categoryRevenue = {};
  data.forEach(r => {
    if (r.Product_Category) {
      categoryRevenue[r.Product_Category] = (categoryRevenue[r.Product_Category] || 0) + r.totalNum;
    }
  });

  const cityRevenue = {};
  data.forEach(r => {
    if (r.City) {
      cityRevenue[r.City] = (cityRevenue[r.City] || 0) + r.totalNum;
    }
  });

  const paymentRevenue = {};
  const paymentCount = {};
  data.forEach(r => {
    if (r.Payment_Method) {
      paymentRevenue[r.Payment_Method] = (paymentRevenue[r.Payment_Method] || 0) + r.totalNum;
      paymentCount[r.Payment_Method] = (paymentCount[r.Payment_Method] || 0) + 1;
    }
  });

  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  data.forEach(r => { if (ratingCounts[r.ratingNum] !== undefined) ratingCounts[r.ratingNum]++; });

  const cityEntries = Object.entries(cityRevenue).sort((a, b) => b[1] - a[1]);
  const maleCount = data.filter(r => r.Gender === 'Male').length;
  const femaleCount = data.filter(r => r.Gender === 'Female').length;

  return {
    totalRevenue,
    delivered,
    pending,
    cancelled,
    avgRating,
    uniqueCustomers,
    totalOrders: data.length,
    cityCount: cityEntries.length,
    topCity: cityEntries[0]?.[0] || '—',
    topCityRevenue: cityEntries[0]?.[1] || 0,
    bottomCity: cityEntries[cityEntries.length - 1]?.[0] || '—',
    bottomCityRevenue: cityEntries[cityEntries.length - 1]?.[1] || 0,
    maleCount,
    femaleCount,
    categoryRevenue: Object.entries(categoryRevenue).sort((a, b) => b[1] - a[1]),
    cityRevenue: cityEntries,
    paymentMethods: Object.entries(paymentRevenue)
      .sort((a, b) => b[1] - a[1])
      .map(([method, rev]) => ({ method, rev, count: paymentCount[method] })),
    ratingCounts,
  };
}
