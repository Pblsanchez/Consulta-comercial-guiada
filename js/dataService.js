// js/dataService.js
// Capa de acceso a datos – Única autorizada para interactuar con JSON

// ================= SIMULADOR DE MÉTRICAS (para indicadores sin JSON aún) =================
const SIMULATED_METRICS = {
  cumplimiento_facturacion: {
    generateData: (year, months) => months.map((m, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: m,
      value: parseFloat((92 + Math.random() * 8).toFixed(1))
    }))
  },
  pipeline: {
    generateData: (year, months) => months.map((m, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: m,
      value: Math.round(40 + (i * 2) + Math.random() * 8)
    }))
  },
  relacionamiento: {
    generateData: (year, months) => months.map((m, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: m,
      value: Math.round(5 + Math.random() * 10)
    }))
  },
  cumplimiento_global: {
    generateData: (year, months) => months.map((m, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: m,
      value: parseFloat((85 + Math.random() * 15).toFixed(1))
    }))
  },
  evolucion_objetivos: {
    generateData: (year, months) => months.map((m, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: m,
      value: parseFloat((70 + (i * 3) + Math.random() * 5).toFixed(1))
    }))
  },
  clientes: {
    generateData: (year, months) => months.map((mth, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: mth,
      value: Math.round(120 + (i * 2))
    }))
  },
  documentacion: {
    generateData: (year, months) => months.map((mth, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: mth,
      value: Math.round(8 - (i * 0.5) + Math.random() * 3)
    }))
  },
  tkt_gestion: {
    generateData: (year, months) => months.map((mth, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: mth,
      value: Math.round(20 + Math.random() * 15)
    }))
  },
  servicios_activos: {
    generateData: (year, months) => months.map((mth, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: mth,
      value: Math.round(25 + (i * 1.5))
    }))
  },
  kpi_contrato: {
    generateData: (year, months) => months.map((mth, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: mth,
      value: Math.round(85 + Math.random() * 15)
    }))
  },
  tarifas: {
    generateData: (year, months) => months.map((mth, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: mth,
      value: Math.round(8 + Math.random() * 3)
    }))
  },
  adecuaciones: {
    generateData: (year, months) => months.map((mth, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: mth,
      value: Math.round(2 + Math.random() * 4)
    }))
  }
};

const MONTHS_2025 = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                     "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MONTHS_2026 = ["Enero","Febrero","Marzo","Abril"];

// ================= FUNCIÓN PRINCIPAL =================

/**
 * Obtiene los datos de una métrica. Intenta desde JSON real, y si no existe usa el simulador.
 * @param {string} metric - Nombre de la métrica
 * @returns {Promise<Array>} Array de objetos con estructura { year, quarter, month, value }
 */
export async function getMetric(metric) {
  // 1. Intentar cargar desde JSON real
  try {
    const response = await fetch(`data/${metric}.json`);
    if (response.ok) {
      const json = await response.json();
      if (json.data && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (e) {
    // No hay JSON real, continuar al simulador
  }

  // 2. Fallback: datos simulados para métricas sin JSON propio
  if (SIMULATED_METRICS[metric]) {
    const sim = SIMULATED_METRICS[metric];
    return [...sim.generateData(2025, MONTHS_2025), ...sim.generateData(2026, MONTHS_2026)];
  }

  // 3. Nada encontrado
  console.warn(`⚠️ Métrica "${metric}" no encontrada (ni JSON ni simulador)`);
  return [];
}

/**
 * Obtiene información completa de una métrica (incluyendo metadata).
 * @param {string} metric - Nombre de la métrica
 * @returns {Promise<Object>} Objeto completo del JSON
 */
export async function getMetricFull(metric) {
  try {
    const response = await fetch(`data/${metric}.json`);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`❌ Error en getMetricFull("${metric}"):`, error.message);
    return null;
  }
}

/* ───────── FILTROS ───────── */

export function filterByYear(data, year) {
  if (!Array.isArray(data)) return [];
  return data.filter(d => d.year === year);
}

export function filterByQuarter(data, year, quarter) {
  if (!Array.isArray(data)) return [];
  return data.filter(d => d.year === year && d.quarter === quarter);
}

export function filterByQuarters(data, year, quarters) {
  if (!Array.isArray(data)) return [];
  const quartersArray = quarters instanceof Set ? [...quarters] : quarters;
  return data.filter(d => d.year === year && quartersArray.includes(d.quarter));
}

export function filterByMonthRange(data, year, fromMonth, toMonth) {
  if (!Array.isArray(data)) return [];
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const fromIndex = months.indexOf(fromMonth);
  const toIndex = months.indexOf(toMonth);
  if (fromIndex === -1 || toIndex === -1) return [];
  return data.filter(d => {
    if (d.year !== year) return false;
    const monthIndex = months.indexOf(d.month);
    return monthIndex >= fromIndex && monthIndex <= toIndex;
  });
}

/* ───────── AGREGACIONES ───────── */

export function sumValues(data) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  return data.reduce((acc, d) => acc + d.value, 0);
}

export function averageValue(data) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  return data.reduce((acc, d) => acc + d.value, 0) / data.length;
}

export function maxValue(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return data.reduce((max, d) => d.value > max.value ? d : max, data[0]);
}

export function minValue(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return data.reduce((min, d) => d.value < min.value ? d : min, data[0]);
}

export function medianValue(data) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a.value - b.value);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1].value + sorted[mid].value) / 2
    : sorted[mid].value;
}

/* ───────── COMPARACIONES ───────── */

export function comparePeriods(current, previous) {
  const currentSum = sumValues(current);
  const previousSum = sumValues(previous);
  if (previousSum === 0) return { current: currentSum, previous: previousSum, variation: 0, absolute: currentSum, trend: currentSum > 0 ? "up" : "flat" };
  const variation = ((currentSum - previousSum) / previousSum) * 100;
  return {
    current: currentSum,
    previous: previousSum,
    variation: parseFloat(variation.toFixed(1)),
    absolute: parseFloat((currentSum - previousSum).toFixed(2)),
    trend: variation > 0 ? "up" : variation < 0 ? "down" : "flat"
  };
}

export function compareMetrics(data1, data2) {
  const avg1 = averageValue(data1), avg2 = averageValue(data2);
  const sum1 = sumValues(data1), sum2 = sumValues(data2);
  const delta1 = data1.length >= 2 ? ((data1[data1.length-1].value - data1[0].value) / data1[0].value) * 100 : 0;
  const delta2 = data2.length >= 2 ? ((data2[data2.length-1].value - data2[0].value) / data2[0].value) * 100 : 0;
  return {
    metric1: { average: avg1, sum: sum1, variation: parseFloat(delta1.toFixed(1)), points: data1.length },
    metric2: { average: avg2, sum: sum2, variation: parseFloat(delta2.toFixed(1)), points: data2.length }
  };
}

/* ───────── OUTLIERS ───────── */

export function detectOutliers(data, threshold = 1.25) {
  if (!Array.isArray(data) || data.length < 3) return [];
  const avg = averageValue(data);
  return data.filter(d => d.value > avg * threshold || d.value < avg / threshold);
}

export function detectOutliersIQR(data) {
  if (!Array.isArray(data) || data.length < 4) return [];
  const sorted = [...data].sort((a, b) => a.value - b.value);
  const q1 = sorted[Math.floor(sorted.length * 0.25)].value;
  const q3 = sorted[Math.floor(sorted.length * 0.75)].value;
  const iqr = q3 - q1;
  return data.filter(d => d.value < q1 - 1.5 * iqr || d.value > q3 + 1.5 * iqr);
}

/* ───────── TENDENCIAS ───────── */

export function calculateTrend(data) {
  if (!Array.isArray(data) || data.length < 2) return { direction: "flat", variation: 0, slope: 0 };
  const first = data[0].value, last = data[data.length - 1].value;
  const variation = ((last - first) / first) * 100;
  let direction = "flat";
  if (variation > 1) direction = "up";
  else if (variation < -1) direction = "down";
  const n = data.length, xMean = (n - 1) / 2, yMean = averageValue(data);
  let num = 0, den = 0;
  data.forEach((d, i) => { num += (i - xMean) * (d.value - yMean); den += Math.pow(i - xMean, 2); });
  return { direction, variation: parseFloat(variation.toFixed(1)), slope: parseFloat((den !== 0 ? num / den : 0).toFixed(4)) };
}

/* ───────── UTILIDADES ───────── */

export function getAvailableMonths(data) {
  if (!Array.isArray(data)) return [];
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const available = new Set(data.map(d => d.month));
  return months.filter(m => available.has(m));
}

export function getAvailableYears(data) {
  if (!Array.isArray(data)) return [];
  return [...new Set(data.map(d => d.year))].sort();
}

export function groupByQuarter(data) {
  if (!Array.isArray(data)) return {};
  return data.reduce((acc, d) => {
    if (!acc[d.quarter]) acc[d.quarter] = [];
    acc[d.quarter].push(d);
    return acc;
  }, {});
}

export function getLatestValue(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[data.length - 1];
}

console.log("✅ dataService.js v2.2 – JSON + Simulador cargado");
console.log("  📥 getMetric (con fallback a simulador)");
console.log("  🔍 filterByYear, filterByQuarter, filterByQuarters, filterByMonthRange");
console.log("  📊 sumValues, averageValue, maxValue, minValue, medianValue");
console.log("  ⚖️ comparePeriods, compareMetrics");
console.log("  🔎 detectOutliers, detectOutliersIQR");
console.log("  📈 calculateTrend");
console.log("  🛠️ getAvailableMonths, getAvailableYears, groupByQuarter, getLatestValue");