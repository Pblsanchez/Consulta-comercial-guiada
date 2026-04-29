// js/dataService.js
// Capa de acceso a datos – Única autorizada para interactuar con JSON

/**
 * Obtiene los datos de una métrica desde el archivo JSON correspondiente.
 * @param {string} metric - Nombre de la métrica (facturacion, rentabilidad, dias_calle, oportunidades)
 * @returns {Promise<Array>} Array de objetos con estructura { year, quarter, month, value }
 */
export async function getMetric(metric) {
  try {
    const response = await fetch(`data/${metric}.json`);
    
    if (!response.ok) {
      throw new Error(`No se pudo cargar la métrica "${metric}". Status: ${response.status}`);
    }
    
    const json = await response.json();
    
    // Validación básica del contrato de datos
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error(`Estructura inválida en ${metric}.json. Se esperaba un array en "data".`);
    }
    
    return json.data;
  } catch (error) {
    console.error(`❌ Error en getMetric("${metric}"):`, error.message);
    return [];
  }
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

/**
 * Filtra datos por año.
 * @param {Array} data - Array de datos
 * @param {number} year - Año a filtrar
 * @returns {Array} Datos filtrados
 */
export function filterByYear(data, year) {
  if (!Array.isArray(data)) return [];
  return data.filter(d => d.year === year);
}

/**
 * Filtra datos por año y trimestre.
 * @param {Array} data - Array de datos
 * @param {number} year - Año
 * @param {string} quarter - Trimestre (Q1, Q2, Q3, Q4)
 * @returns {Array} Datos filtrados
 */
export function filterByQuarter(data, year, quarter) {
  if (!Array.isArray(data)) return [];
  return data.filter(d => d.year === year && d.quarter === quarter);
}

/**
 * Filtra datos por múltiples trimestres.
 * @param {Array} data - Array de datos
 * @param {number} year - Año
 * @param {Set|Array} quarters - Trimestres a incluir
 * @returns {Array} Datos filtrados
 */
export function filterByQuarters(data, year, quarters) {
  if (!Array.isArray(data)) return [];
  const quartersArray = quarters instanceof Set ? [...quarters] : quarters;
  return data.filter(d => d.year === year && quartersArray.includes(d.quarter));
}

/**
 * Filtra datos por rango de meses.
 * @param {Array} data - Array de datos
 * @param {number} year - Año
 * @param {string} fromMonth - Mes inicial (ej: "Enero")
 * @param {string} toMonth - Mes final (ej: "Junio")
 * @returns {Array} Datos filtrados
 */
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

/**
 * Suma los valores de un array de datos.
 * @param {Array} data - Array de datos con propiedad "value"
 * @returns {number} Suma total
 */
export function sumValues(data) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  return data.reduce((acc, d) => acc + d.value, 0);
}

/**
 * Calcula el promedio de valores.
 * @param {Array} data - Array de datos con propiedad "value"
 * @returns {number} Promedio
 */
export function averageValue(data) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  return data.reduce((acc, d) => acc + d.value, 0) / data.length;
}

/**
 * Obtiene el valor máximo del período.
 * @param {Array} data - Array de datos
 * @returns {Object} Objeto con el valor máximo { value, month, quarter, year }
 */
export function maxValue(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return data.reduce((max, d) => d.value > max.value ? d : max, data[0]);
}

/**
 * Obtiene el valor mínimo del período.
 * @param {Array} data - Array de datos
 * @returns {Object} Objeto con el valor mínimo { value, month, quarter, year }
 */
export function minValue(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return data.reduce((min, d) => d.value < min.value ? d : min, data[0]);
}

/**
 * Calcula la mediana de los valores.
 * @param {Array} data - Array de datos
 * @returns {number} Mediana
 */
export function medianValue(data) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  
  const sorted = [...data].sort((a, b) => a.value - b.value);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1].value + sorted[mid].value) / 2;
  } else {
    return sorted[mid].value;
  }
}

/* ───────── COMPARACIONES ───────── */

/**
 * Compara dos períodos y calcula la variación.
 * @param {Array} current - Datos del período actual
 * @param {Array} previous - Datos del período anterior
 * @returns {Object} { current, previous, variation, absolute }
 */
export function comparePeriods(current, previous) {
  const currentSum = sumValues(current);
  const previousSum = sumValues(previous);
  
  if (previousSum === 0) {
    return {
      current: currentSum,
      previous: previousSum,
      variation: 0,
      absolute: currentSum,
      trend: currentSum > 0 ? "up" : "flat"
    };
  }

  const variation = ((currentSum - previousSum) / previousSum) * 100;
  const absolute = currentSum - previousSum;

  return {
    current: currentSum,
    previous: previousSum,
    variation: parseFloat(variation.toFixed(1)),
    absolute: parseFloat(absolute.toFixed(2)),
    trend: variation > 0 ? "up" : variation < 0 ? "down" : "flat"
  };
}

/**
 * Compara dos métricas diferentes en el mismo período.
 * @param {Array} data1 - Datos de la primera métrica
 * @param {Array} data2 - Datos de la segunda métrica
 * @returns {Object} Resultados de comparación
 */
export function compareMetrics(data1, data2) {
  const avg1 = averageValue(data1);
  const avg2 = averageValue(data2);
  const sum1 = sumValues(data1);
  const sum2 = sumValues(data2);
  
  const delta1 = data1.length >= 2 
    ? ((data1[data1.length - 1].value - data1[0].value) / data1[0].value) * 100 
    : 0;
  
  const delta2 = data2.length >= 2 
    ? ((data2[data2.length - 1].value - data2[0].value) / data2[0].value) * 100 
    : 0;

  return {
    metric1: {
      average: avg1,
      sum: sum1,
      variation: parseFloat(delta1.toFixed(1)),
      points: data1.length
    },
    metric2: {
      average: avg2,
      sum: sum2,
      variation: parseFloat(delta2.toFixed(1)),
      points: data2.length
    },
    correlation: parseFloat((delta1 * delta2 > 0 ? "positiva" : "negativa"))
  };
}

/* ───────── OUTLIERS (Detección de anomalías) ───────── */

/**
 * Detecta valores atípicos basados en desviación del promedio.
 * @param {Array} data - Array de datos
 * @param {number} threshold - Factor de umbral (default: 1.25)
 * @returns {Array} Array de valores atípicos
 */
export function detectOutliers(data, threshold = 1.25) {
  if (!Array.isArray(data) || data.length < 3) return [];
  
  const avg = averageValue(data);

  return data.filter(
    d => d.value > avg * threshold || d.value < avg / threshold
  );
}

/**
 * Detecta outliers usando el método de rango intercuartílico (IQR).
 * Más robusto estadísticamente que el método de promedio.
 * @param {Array} data - Array de datos
 * @returns {Array} Array de valores atípicos
 */
export function detectOutliersIQR(data) {
  if (!Array.isArray(data) || data.length < 4) return [];
  
  const sorted = [...data].sort((a, b) => a.value - b.value);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  
  const q1 = sorted[q1Index].value;
  const q3 = sorted[q3Index].value;
  const iqr = q3 - q1;
  
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return data.filter(d => d.value < lowerBound || d.value > upperBound);
}

/* ───────── TENDENCIAS ───────── */

/**
 * Calcula la tendencia simple de una serie de datos.
 * @param {Array} data - Array de datos ordenados cronológicamente
 * @returns {Object} { direction, variation, slope }
 */
export function calculateTrend(data) {
  if (!Array.isArray(data) || data.length < 2) {
    return { direction: "flat", variation: 0, slope: 0 };
  }
  
  const first = data[0].value;
  const last = data[data.length - 1].value;
  const variation = ((last - first) / first) * 100;
  
  let direction = "flat";
  if (variation > 1) direction = "up";
  else if (variation < -1) direction = "down";
  
  // Cálculo simple de pendiente (slope)
  const n = data.length;
  const xMean = (n - 1) / 2;
  const yMean = averageValue(data);
  
  let numerator = 0;
  let denominator = 0;
  
  data.forEach((d, i) => {
    numerator += (i - xMean) * (d.value - yMean);
    denominator += Math.pow(i - xMean, 2);
  });
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  
  return {
    direction,
    variation: parseFloat(variation.toFixed(1)),
    slope: parseFloat(slope.toFixed(4))
  };
}

/* ───────── UTILIDADES ───────── */

/**
 * Obtiene los meses disponibles en los datos.
 * @param {Array} data - Array de datos
 * @returns {Array} Array de nombres de meses únicos en orden
 */
export function getAvailableMonths(data) {
  if (!Array.isArray(data)) return [];
  
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  
  const availableMonths = new Set(data.map(d => d.month));
  return months.filter(m => availableMonths.has(m));
}

/**
 * Obtiene los años disponibles en los datos.
 * @param {Array} data - Array de datos
 * @returns {Array} Array de años únicos ordenados
 */
export function getAvailableYears(data) {
  if (!Array.isArray(data)) return [];
  return [...new Set(data.map(d => d.year))].sort();
}

/**
 * Agrupa datos por trimestre.
 * @param {Array} data - Array de datos
 * @returns {Object} Datos agrupados por trimestre { Q1: [...], Q2: [...], ... }
 */
export function groupByQuarter(data) {
  if (!Array.isArray(data)) return {};
  
  return data.reduce((acc, d) => {
    if (!acc[d.quarter]) acc[d.quarter] = [];
    acc[d.quarter].push(d);
    return acc;
  }, {});
}

/**
 * Último valor disponible de una métrica.
 * @param {Array} data - Array de datos
 * @returns {Object|null} Último registro
 */
export function getLatestValue(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[data.length - 1];
}

console.log("✅ dataService.js cargado – Funciones disponibles:");
console.log("  📥 getMetric, getMetricFull");
console.log("  🔍 filterByYear, filterByQuarter, filterByQuarters, filterByMonthRange");
console.log("  📊 sumValues, averageValue, maxValue, minValue, medianValue");
console.log("  ⚖️ comparePeriods, compareMetrics");
console.log("  🔎 detectOutliers, detectOutliersIQR");
console.log("  📈 calculateTrend");
console.log("  🛠️ getAvailableMonths, getAvailableYears, groupByQuarter, getLatestValue");