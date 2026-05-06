// js/dataService.js
// Capa de acceso a datos – v2.3

const MONTHS_2025 = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                     "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MONTHS_2026 = ["Enero","Febrero","Marzo","Abril"];

const SIMULATED_METRICS = {
  cumplimiento_facturacion: {
    generateData: (year, months) => months.map((m, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: m,
      value: parseFloat((92 + Math.random() * 8).toFixed(1))
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
  },
  pipeline: {
    generateData: (year, months) => months.map((mth, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: mth,
      value: Math.round(45 + (i * 3) + Math.random() * 8)
    }))
  },
  relacionamiento: {
    generateData: (year, months) => months.map((mth, i) => ({
      year, quarter: `Q${Math.ceil((i+1)/3)}`, month: mth,
      value: Math.round(8 + Math.random() * 12)
    }))
  }
};

export async function getMetric(metric) {
  try {
    const response = await fetch(`data/${metric}.json`);
    if (response.ok) {
      const json = await response.json();
      if (json.data && Array.isArray(json.data)) return json.data;
    }
  } catch (e) {}
  if (SIMULATED_METRICS[metric]) {
    const sim = SIMULATED_METRICS[metric];
    return [...sim.generateData(2025, MONTHS_2025), ...sim.generateData(2026, MONTHS_2026)];
  }
  console.warn(`⚠️ Métrica "${metric}" no encontrada`);
  return [];
}

export function filterByYear(data, year) { if(!Array.isArray(data))return[]; return data.filter(d=>d.year===year); }
export function filterByQuarter(data, year, quarter) { if(!Array.isArray(data))return[]; return data.filter(d=>d.year===year&&d.quarter===quarter); }
export function filterByQuarters(data, year, quarters) {
  if(!Array.isArray(data))return[];
  const q = quarters instanceof Set ? [...quarters] : quarters;
  return data.filter(d=>d.year===year&&q.includes(d.quarter));
}
export function filterByMonthRange(data, year, fromMonth, toMonth) {
  if(!Array.isArray(data))return[];
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const fi=months.indexOf(fromMonth), ti=months.indexOf(toMonth);
  if(fi===-1||ti===-1)return[];
  return data.filter(d=>{if(d.year!==year)return false;const mi=months.indexOf(d.month);return mi>=fi&&mi<=ti;});
}

export function sumValues(data) { if(!Array.isArray(data)||!data.length)return 0; return data.reduce((a,d)=>a+d.value,0); }
export function averageValue(data) { if(!Array.isArray(data)||!data.length)return 0; return data.reduce((a,d)=>a+d.value,0)/data.length; }
export function maxValue(data) { if(!Array.isArray(data)||!data.length)return null; return data.reduce((max,d)=>d.value>max.value?d:max,data[0]); }
export function minValue(data) { if(!Array.isArray(data)||!data.length)return null; return data.reduce((min,d)=>d.value<min.value?d:min,data[0]); }
export function medianValue(data) {
  if(!Array.isArray(data)||!data.length)return 0;
  const s=[...data].sort((a,b)=>a.value-b.value);
  const mid=Math.floor(s.length/2);
  return s.length%2===0?(s[mid-1].value+s[mid].value)/2:s[mid].value;
}

export function comparePeriods(current, previous) {
  const cs=sumValues(current), ps=sumValues(previous);
  if(ps===0)return{current:cs,previous:ps,variation:0,absolute:cs,trend:cs>0?"up":"flat"};
  const v=((cs-ps)/ps)*100;
  return{current:cs,previous:ps,variation:parseFloat(v.toFixed(1)),absolute:parseFloat((cs-ps).toFixed(2)),trend:v>0?"up":v<0?"down":"flat"};
}

export function compareMetrics(data1, data2) {
  const a1=averageValue(data1),a2=averageValue(data2),s1=sumValues(data1),s2=sumValues(data2);
  const d1=data1.length>=2?((data1[data1.length-1].value-data1[0].value)/data1[0].value)*100:0;
  const d2=data2.length>=2?((data2[data2.length-1].value-data2[0].value)/data2[0].value)*100:0;
  return{metric1:{average:a1,sum:s1,variation:parseFloat(d1.toFixed(1)),points:data1.length},metric2:{average:a2,sum:s2,variation:parseFloat(d2.toFixed(1)),points:data2.length}};
}

export function detectOutliers(data, threshold=1.25) {
  if(!Array.isArray(data)||data.length<3)return[];
  const avg=averageValue(data);
  return data.filter(d=>d.value>avg*threshold||d.value<avg/threshold);
}

export function detectOutliersIQR(data) {
  if(!Array.isArray(data)||data.length<4)return[];
  const s=[...data].sort((a,b)=>a.value-b.value);
  const q1=s[Math.floor(s.length*.25)].value,q3=s[Math.floor(s.length*.75)].value,iqr=q3-q1;
  return data.filter(d=>d.value<q1-1.5*iqr||d.value>q3+1.5*iqr);
}

export function calculateTrend(data) {
  if(!Array.isArray(data)||data.length<2)return{direction:"flat",variation:0,slope:0};
  const f=data[0].value,l=data[data.length-1].value;
  const v=((l-f)/f)*100;
  let d="flat";if(v>1)d="up";else if(v<-1)d="down";
  const n=data.length,xMean=(n-1)/2,yMean=averageValue(data);
  let num=0,den=0;
  data.forEach((d,i)=>{num+=(i-xMean)*(d.value-yMean);den+=Math.pow(i-xMean,2);});
  return{direction:d,variation:parseFloat(v.toFixed(1)),slope:parseFloat((den!==0?num/den:0).toFixed(4))};
}

export function getAvailableMonths(data) {
  if(!Array.isArray(data))return[];
  const months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const av=new Set(data.map(d=>d.month));
  return months.filter(m=>av.has(m));
}

export function getAvailableYears(data) {
  if(!Array.isArray(data))return[];
  return[...new Set(data.map(d=>d.year))].sort();
}

export function groupByQuarter(data) {
  if(!Array.isArray(data))return{};
  return data.reduce((acc,d)=>{if(!acc[d.quarter])acc[d.quarter]=[];acc[d.quarter].push(d);return acc;},{});
}

export function getLatestValue(data) {
  if(!Array.isArray(data)||!data.length)return null;
  return data[data.length-1];
}

console.log("✅ dataService.js v2.3 cargado");