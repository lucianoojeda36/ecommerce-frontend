# Design System — Ecommerce Admin

> Fuente de verdad de toda la interfaz (storefront + panel). La paleta global vive en `:root`/`.dark`
> y es inyectada en runtime por `ThemeContext`; el panel consume los mismos tokens a través de aliases
> `.admin`. Al construir una página del dashboard, revisar primero `pages/<page>.md`.

---

**Proyecto:** ecommerce-frontend (SPA React 19 + Vite 8 + TypeScript 6 + Tailwind v4)
**Dirección visual:** premium, inspirada en Linear / Stripe / Vercel
**Dials:** Variance 3/10 (minimal) · Motion 2/10 (sutil) · Density 8/10 (dashboard compacto)
**Stack:** React 19 · Tailwind v4 CSS-first (sin tailwind.config) · CSS custom properties en runtime

---

## 1. Principios

1. **Interfaz de herramienta, no de marketing.** Sin heroes, sin CTA repetidos, sin decoración.
2. **Monocromo con un solo acento.** El color comunica estado, nunca adorna.
3. **Densidad alta con respiración.** Grids de 4/8px, panales con 20–24px de padding.
4. **Jerarquía por tipografía y peso**, nunca por tamaños grandes ni sombras llamativas.
5. **Sin dependencias nuevas.** SVG inline, CSS custom y utilidades Tailwind ya instaladas.
6. **Accesible por defecto.** Foco visible, contraste ≥4.5:1, `prefers-reduced-motion`, teclado.

---

## 2. Color

Paleta neutra fría con acento índigo/azul (Linear/Vercel) y verde caja como color de marca
heredado del negocio. Se mantiene el contrato de variables del storefront (`--color-*`) y del
admin (`--a-*`, `--s-*`) para no romper `ThemeContext`.

### Light (default)

| Rol | Variable | Valor |
|---|---|---|
| Fondo app | `--a-canvas` | `#F7F8FA` |
| Superficie | `--a-surface` | `#FFFFFF` |
| Superficie elevada | `--a-surface-2` | `#F4F5F7` |
| Borde | `--a-border` | `#E6E8EB` |
| Borde fuerte | `--a-border-strong` | `#D5D8DD` |
| Texto principal | `--a-text` | `#16181D` |
| Texto secundario | `--a-text-2` | `#5B606B` |
| Texto terciario | `--a-text-3` | `#8B909A` |
| Acento | `--a-accent` | `#4F46E5` |
| Acento suave | `--a-accent-soft` | `#EEF0FF` |
| Éxito | `--a-success` | `#0F9D6E` |
| Advertencia | `--a-warning` | `#D97706` |
| Peligro | `--a-danger` | `#DC2626` |

### Dark

| Rol | Valor |
|---|---|
| Fondo app | `#0B0C0E` |
| Superficie | `#111317` |
| Superficie elevada | `#17191E` |
| Borde | `#24272E` |
| Borde fuerte | `#343841` |
| Texto principal | `#F2F3F5` |
| Texto secundario | `#A1A6B0` |
| Texto terciario | `#6E747F` |
| Acento | `#7C7BFF` |
| Acento suave | `#1D1E38` |
| Éxito | `#34D399` |
| Advertencia | `#FBBF24` |
| Peligro | `#F87171` |

**Reglas**
- Nunca usar clases de color fijas de Tailwind (`bg-red-50`, `text-gray-500`) en el admin; usar tokens.
- El estado de una orden se expresa con color **+ texto** (badge con label).
- Gradientes: solo el área del gráfico de ingresos con opacidad ≤18%.

---

## 3. Tipografía

**Familia única:** Inter (variable), ya cargada en `index.html`. Instrument Sans queda como fallback
para compatibilidad con el sub-tema anterior. Descartar Cormorant/Montserrat del resultado crudo de
UI Pro Max: no encajan con una herramienta tipo Linear/Stripe/Vercel.

| Nivel | Tamaño | Peso | Tracking | Uso |
|---|---|---|---|---|
| Display | 30px / 36px | 600 | -0.03em | Título del dashboard |
| H2 | 18px / 24px | 600 | -0.015em | Títulos de panel |
| H3 | 14px / 20px | 600 | -0.01em | Subsecciones |
| Body | 13px / 20px | 400 | 0 | Texto general |
| Label | 12px / 16px | 500 | 0.01em | Etiquetas de campos |
| KPI | 26px / 32px | 600 | -0.03em | Números de métricas (`tabular-nums`) |
| Micro | 11px / 14px | 500 | 0.06em | Eyebrows uppercase |

**Reglas**
- `font-feature-settings: "ss01","cv01","cv02","tnum"` global.
- Números siempre `font-variant-numeric: tabular-nums`.
- Máximo 3 niveles de jerarquía por pantalla.

---

## 4. Espaciado y geometría

Escala (dial density 8): `2 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48`.
- Padding de panel: 20px (mobile) → 24px (desktop).
- Gap de grid: 12px (KPIs) → 16px (paneles).
- Sidebar: 232px expandido / 64px colapsado; drawer mobile ≤1023px.
- Topbar: 56px sticky con blur y borde inferior.
- Radius: 6px (chips/inputs) · 8px (botones) · 10px (paneles) · 12px (modal).
- Bordes: 1px siempre; sin sombras en reposo. Shadow solo en overlays y menús.

---

## 5. Componentes

### Panel (`ds-panel`)
Superficie con borde sutil, radio 10px, sin sombra. Header con título H2 y ação opcional.

### KPI Card (`ds-kpi`)
- Eyebrow uppercase 11px + icono 14px.
- Valor 26px tabular.
- Delta con signo y color semántico; texto comparativo en terciario.
- Sparkline opcional SVG de 40px de alto, línea de 1.5px sin relleno o con 12% de área.

### Botones
- Primary: fondo `--a-text`, texto `--a-surface` (o acento en acciones principals).
- Secondary/outline: fondo transparente, borde `--a-border-strong`.
- Ghost: solo texto, hover `--a-surface-2`.
- Alto 32px (compacto) / 36px (default). Radius 8px. Transición 160ms.

### Badges
Altura 22px, radius 6px, 11px/500, fondo soft del color de estado, texto del mismo hue con
contraste verificado. Incluir siempre el label visible.

### Tablas
Header 11px uppercase terciario; filas 44px; hover `--a-surface-2`; borde inferior por fila;
columnas numéricas alineadas a la derecha y tabular.

### Inputs
Alto 36px, borde `--a-border`, focus ring 2px `--a-accent` a 24% + borde acento.

---

## 6. Motion

- Transiciones: `160ms cubic-bezier(.2,.8,.2,1)` para hover/foco; `220ms` para drawers.
- Entrada de paneles: fade + translateY(6px), escalonado 40ms, máximo 4 elementos.
- Gráficos: `stroke-dashoffset` 600ms en el trazo y fade del área; **sin bounce**.
- `@media (prefers-reduced-motion: reduce)`: desactivar todo, estado final inmediato.
- No animar más de 2 elementos relevantes por vista (regla UI Pro Max: Excessive Motion).

---

## 7. Gráficos

- **Tendencia (ingresos 30 días):** Line/Area SVG existente; mejorar con grid más tenue,
  área con gradiente ≤18% y tooltip con teclado (ya implementado).
- **Distribución por estado:** barras horizontales con label + cantidad + porcentaje;
  **no** donut/pie (baja accesibilidad y poca precisión, ver `charts.csv`).
- **Top productos:** filas con barra de progreso relativa + valor.
- Toda serie debe tener etiqueta visible, no depender solo del color.

---

## 8. Responsive

| Breakpoint | Layout |
|---|---|
| <640px | Sidebar drawer, KPIs 1 col, paneles 1 col, tablas con scroll horizontal |
| 640–1023px | Sidebar drawer, KPIs 2 col, paneles 1 col |
| 1024–1279px | Sidebar colapsada (iconos), KPIs 2–4 col |
| ≥1280px | Sidebar expandida, KPIs 4 col, paneles `1.6fr / 1fr` |

---

## 9. Anti-patterns

- ❌ Colores vivos o bloques de marketing; ❌ tipografías serif decorativas;
- ❌ emojis como iconos (usar SVG inline consistente, stroke 1.5);
- ❌ sombras en tarjetas en reposo; ❌ hover que desplaza layout;
- ❌ estados instantáneos sin transición; ❌ foco invisible;
- ❌ contenido debajo de la topbar sticky; ❌ scroll horizontal en mobile.

---

## 10. Checklist de entrega

- [ ] Contraste ≥4.5:1 en light y dark
- [ ] Foco visible y navegación por teclado
- [ ] `prefers-reduced-motion` respetado
- [ ] 375 / 768 / 1024 / 1440px sin desbordes
- [ ] Sin clases de color Tailwind fijas en el admin
- [ ] `npm run build` y `npm run lint` limpios
