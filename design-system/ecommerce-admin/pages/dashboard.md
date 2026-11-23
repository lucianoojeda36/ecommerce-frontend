# Override — Dashboard `/admin`

Este archivo prevalece sobre `MASTER.md` para la vista de dashboard.

---

## Estructura (de arriba abajo)

1. **Topbar contextual** (la provee `AdminLayout`): breadcrumb `Admin / Resumen`, chip de
   "Actualizado hace X", botón `Exportar` (ghost) y `Nueva orden` (primary).
2. **Banner de acción** (solo si `pending > 0`): una línea, fondo acento suave, borde izquierdo
   2px acento, icono + copy + CTA "Ver órdenes". Sin ilustraciones.
3. **KPI grid**: 4 cards — Facturación, Órdenes, Clientes, Productos.
   - Facturación incluye delta porcentual + sparkline.
   - El resto muestra número + detalle textual ("en los últimos 30 días").
4. **Panel principal** (`1.6fr`): Ingresos — título + periodo + leyenda + `RevenueChart`.
5. **Panel lateral** (`1fr`): Órdenes por estado — barras horizontales con número y porcentaje.
6. **Paneles inferiores** (`1.6fr / 1fr`): Últimas órdenes (tabla) y Top productos (lista).

---

## KPI cards

- Grid: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`, gap 12px.
- Eyebrow: 11px uppercase, tracking .06em, `--a-text-3`, icono SVG 14px a la izquierda.
- Valor: 26px/600, tracking -0.03em, tabular.
- Delta: chip 11px con `↗ +12.4%` en `--a-success` / `↘ -3.1%` en `--a-danger`, seguido de
  "vs. período anterior" en `--a-text-3`.
- Altura mínima 116px; padding 16–20px.

## RevenueChart

- Alto fijo 220px desktop / 180px mobile.
- Grid: 4 líneas horizontales, `--a-border` a 60% de opacidad, `stroke-dasharray="3 4"`.
- Línea: 2px `--a-accent`, con `pathLength={1}` y animación `chart-draw` 600ms
  (`stroke-dasharray: 1; stroke-dashoffset: 1 → 0`).
- Área: gradiente vertical `--a-accent` 18% → 0%.
- Tooltip: fondo `--a-text`, texto `--a-surface`, radius 6px, 11px, sin sombra; teclado
  ArrowLeft/Right/Home/End ya soportado — mantener `aria-live`.
- Eje X: 4–6 fechas visibles, 11px `--a-text-3`. Eje Y: 3 valores compactos (`$12k`).

## Órdenes por estado

- Cada fila: label 12px, track 6px radius full con fondo `--a-surface-2`, fill con el token
  `--s-<status>`, valor y porcentaje tabular a la derecha.
- Orden fijo: pending → confirmed → preparing → shipped → delivered → cancelled.
- Estados con 0 órdenes se muestran atenuados (no se ocultan).

## Tabla de últimas órdenes

- Columnas: Orden (mono 12px) · Cliente · Estado (badge) · Total (tabular, right) · Fecha.
- 5 filas máximo; link "Ver todas" al pie.

## Top productos

- 4–5 filas: nombre truncado, barra relativa 4px en acento, cantidad + monto.

## Estados

- Loading: mismos tamaños con `.skeleton` (shimmer), sin layout shift.
- Error: panel centrado con mensaje + botón `Reintentar` (outline).
- Empty: icono SVG 20px + texto en `--a-text-2`, sin ilustraciones.

## Responsive

- `<768px`: KPI 1 col, gráfico debajo del panel de estados, tabla con `overflow-x-auto`.
- `≥1280px`: `grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]` en ambas filas de paneles.

## Checklist específico

- [ ] Sin `bg-*` de colores Tailwind; todo vía `var(--a-*)`
- [ ] Tooltip accesible por teclado y `aria-live`
- [ ] Animación del gráfico desactivada con reduced-motion
- [ ] Delta con signo explícito + color + texto
