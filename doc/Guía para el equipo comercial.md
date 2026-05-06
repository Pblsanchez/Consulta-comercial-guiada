# 📊 Dashboard Comercial – Guía para el equipo comercial

**Versión 2.3 · Mayo 2026**

---

## 🏠 Vista general

Cuando abrís el dashboard, ves la sección **A. Comercial – Objetivos** con filtros de año y trimestre arriba, las tarjetas de KPIs en el centro y el gráfico debajo.

El **Copilot** está colapsado como una barra roja al pie de la pantalla. Hacés clic en la barra y se despliega el panel de consulta guiada. Al cerrarlo, recuperás todo el espacio para visualizar los gráficos.

Los filtros por año (2025, 2026) y trimestre (Q1, Q2, Q3, Q4) se aplican en tiempo real a todos los KPIs y gráficos. Si no seleccionás ningún trimestre, se muestra la vista anual completa.

---

## 📁 Sección A: COMERCIAL – OBJETIVOS

### 🔹 Subsección: Facturación

La subsección principal. Muestra los indicadores clave de desempeño comercial y un gráfico con tres líneas superpuestas para comparar visualmente.

| KPI | Qué muestra | Cálculo | Para qué sirve |
|-----|------------|---------|----------------|
| **Facturación Real** | Valor de facturación mensual total en millones de ARS | Dato directo del sistema de facturación | Ver la evolución real de ventas mes a mes y detectar estacionalidad |
| **Rentabilidad** | Porcentaje de margen neto | Renta por cuenta % | Medir si la facturación se traduce en ganancia. Integrado dentro de la card de Facturación para consulta rápida |
| **Envíos (miles)** | Volumen de envíos en miles de unidades | Dato directo de envíos | Entender la demanda operativa real. Útil para dimensionar recursos |
| **% Cumplimiento** | Qué porcentaje del presupuesto se alcanzó en el período | Facturación Real / Presupuesto × 100 | 🟢🟡🔴 Evaluar si estamos dentro del objetivo comercial. La barra cambia de color según nivel de cumplimiento |
| **IP B2B** | Ingreso promedio por envío corporativo en $ ARS | Facturación B2B / Envíos B2B | Monitorear el precio de los envíos corporativos. Un IP bajo puede indicar presión de precios |
| **IP B2C** | Ingreso promedio por envío a consumidor en $ ARS | Facturación B2C / Envíos B2C | Monitorear el precio de los envíos a consumidor final. Complementa al IP B2B |
| **Adecuación Real** | Porcentaje acumulado de adecuación tarifaria aplicada | Dato directo de adecuaciones | Controlar el impacto de ajustes de tarifas. Si sube más de lo esperado, puede indicar desvíos |

**📈 Gráfico principal**

Tres líneas superpuestas con leyenda abajo:
- 🔴 **Facturación Real** (línea sólida roja)
- 🟠 **Proyectado** (línea punteada naranja): previsión automática de facturación basada en envíos, precio promedio y días del mes
- ⚫ **Presupuesto** (línea de puntos gris): objetivo comercial definido

Esto permite responder preguntas como: ¿vamos en línea con el presupuesto? ¿el proyectado anticipa un desvío?

---

### 🔹 Subsección: Cobranzas y NC

Indicadores para monitorear la salud financiera de la cartera y la eficiencia operativa del ciclo de cobro.

| KPI | Qué muestra | Cálculo | Para qué sirve |
|-----|------------|---------|----------------|
| **Días en la Calle** | Días promedio que tarda en cobrarse una factura | Dato directo de cobranzas | Medir la eficiencia de cobro. Más días = más capital inmovilizado. La tendencia bajista es positiva |
| **NC Emitidas** | Cantidad de Notas de Crédito emitidas por mes | Dato directo de SAP | Identificar problemas de facturación o disconformidades que generan NC |
| **WF NC Pendientes** | Notas de Crédito pendientes de aprobación en workflow | Dato directo de SAP | 🟢🟡🔴 Alerta temprana de cuellos de botella administrativos. 0-3: bajo (verde), 4-6: medio (naranja), 7+: crítico (rojo) |
| **Cobranzas** | Monto total cobrado en millones de ARS | Dato directo de estado de cuenta | Seguimiento del flujo de caja real ingresado |

**📈 Gráfico principal**

Doble eje para ver correlación:
- 🔵 **Días en la Calle** (eje izquierdo, azul)
- 🟢 **Cobranzas en $** (eje derecho, verde)

Si Días en la Calle baja y Cobranzas sube, el ciclo de cobro está mejorando.

---

### 🔹 Subsección: Gestión Comercial

KPIs para medir la actividad del equipo comercial y la evolución de la cartera de clientes.

| KPI | Qué muestra | Cálculo | Para qué sirve |
|-----|------------|---------|----------------|
| **Oportunidades** | Cantidad de oportunidades comerciales activas en el período | Dato directo de CRM | Medir la salud del pipeline. Si bajan, puede anticipar una caída de facturación futura |
| **Pipeline** | Total de oportunidades en cartera | Dato directo de CRM | Ver la evolución del embudo de ventas. Un pipeline creciente indica trabajo comercial activo |
| **Relacionamiento** | Acciones de relacionamiento con clientes realizadas por mes | Dato directo de CRM | Medir la intensidad de la gestión comercial. Visitas, llamadas, seguimientos |
| **Cantidad Clientes** | Total de clientes activos | Dato directo de cartera | Ver el crecimiento o retracción de la base de clientes |

**📈 Gráfico principal**

Muestra la evolución de la métrica seleccionada. Al hacer clic en cualquier KPI, el gráfico principal cambia para mostrar esa métrica específica.

---

## 👥 Sección B: CARTERA *(disponible próximamente)*

Información detallada del cliente: datos particulares, formularios de alta, competidores, documentación (carta oferta, carta de aceptación, licitaciones). Tickets de gestión vinculados al CRM con ACyO.

---

## 📦 Sección C: SERVICIOS / PRODUCTOS *(disponible próximamente)*

Servicios activos, en gestión y pendientes. KPIs por contrato (envíos, facturación, desvíos). Tarifas asociadas con sus vigencias. Procesos de adecuación en curso.

---

## 🤖 Copilot heurístico

Es el asistente de consulta guiada. Lo encontrás colapsado en una barra roja al pie de la pantalla. Al hacer clic, se despliega y podés escribir consultas en **lenguaje natural**.

### ¿Qué podés preguntar?

| Tipo de consulta | Ejemplo | Respuesta que obtenés |
|------------------|---------|----------------------|
| Comparativa Real vs Presupuesto | `facturación vs presupuesto Q1 2026` | Porcentaje de cumplimiento con semáforo (🟢 en objetivo, 🟡 atención, 🔴 crítico) y análisis narrativo |
| Estado de métricas | `cómo están las NC pendientes` | Cantidad actual con nivel de criticidad y recomendación |
| Correlación entre métricas | `días de calle vs nc emitidas 2025` | Análisis de relación entre ambas variables |
| Análisis de una métrica | `envíos en Q2 2026` | Promedio del período, total acumulado y tendencia (% de variación) |
| Navegación por voz | `mostrame cartera` | Cambia automáticamente a la sección Cartera |
| Filtros por lenguaje | `ver datos de 2025 Q3` | Ajusta los filtros de año y trimestre automáticamente |

### Memoria conversacional

El Copilot recuerda tus últimas 5 consultas. Hacé clic en cualquiera del historial para re-ejecutarla sin volver a escribir.

---

## 🎯 Beneficios para el equipo comercial

| Antes | Ahora con el Dashboard |
|-------|------------------------|
| Buscar datos en Excel, SAP, CRM por separado | Todo unificado en una sola pantalla |
| Esperar informes de IT para cruzar métricas | Consultas instantáneas en lenguaje natural |
| No poder comparar real vs presupuesto sin armar planillas | Gráficos superpuestos con 3 líneas y % de cumplimiento |
| NC pendientes se acumulaban sin alerta | Semáforo automático según criticidad |
| Difícil ver correlaciones entre métricas | Gráficos de doble eje y análisis narrativo |
| Tiempo perdido armando informes | Datos listos para decidir en tiempo real |

---

## 📊 ¿Cómo leer los indicadores?

- **▲ Verde con +%**: La métrica subió respecto al inicio del período. Generalmente positivo (excepto Días en la Calle y WF Pendientes, donde una suba es negativa)
- **▼ Rojo con -%**: La métrica bajó. Señal de atención según contexto
- **◆ Gris**: Variación mínima (menor a 0.5%). Estabilidad
- **Barra verde de cumplimiento**: >95% del presupuesto = en objetivo
- **Barra naranja**: 85-95% = atención
- **Barra roja**: <85% = crítico

---

*Dashboard Comercial v2.3 · Centro de Comando · Frontend desacoplado · Preparado para IA real*