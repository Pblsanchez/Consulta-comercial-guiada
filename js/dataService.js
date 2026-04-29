// js/dataService.js

export async function getMetric(metric) {
  const response = await fetch(`data/${metric}.json`);
  const json = await response.json();
  return json.data;
}

/* ───────── FILTROS ───────── */
export function filterByYear(data, year) {
  return data.filter(d => d.year === year);
}

export function filterByQuarter(data, year, quarter) {
  return data.filter(
    d => d.year === year && d.quarter === quarter
  );
}

/* ───────── AGREGACIONES ───────── */
export function sumValues(data) {
  return data.reduce((acc, d) => acc + d.value, 0);
}

export function averageValue(data) {
  return data.reduce((acc, d) => acc + d.value, 0) / data.length;
}

/* ───────── COMPARACIONES ───────── */
export function comparePeriods(current, previous) {
  const currentSum = sumValues(current);
  const previousSum = sumValues(previous);

  const variation =
    ((currentSum - previousSum) / previousSum) * 100;

  return {
    current: currentSum,
    previous: previousSum,
    variation: variation.toFixed(1)
  };
}

/* ───────── OUTLIERS (simple y efectivo) ───────── */
export function detectOutliers(data, threshold = 1.25) {
  const avg = averageValue(data);

  return data.filter(
    d => d.value > avg * threshold || d.value < avg / threshold
  );
}
``