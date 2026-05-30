# Дизайн-система Bankai

Эстетический донор — [Osmo](https://osmo.supply). Принцип: иерархия строится **размером и отступами**, палитра минимальная, акцент точечный. Единый источник правды — токены в `app/globals.css` (`@theme`). Хардкода значений в компонентах нет.

## Токены (`app/globals.css`)

### Цвет — тёплая нейтраль (near-black, как у Osmo)
| Токен | Hex | Назначение |
|---|---|---|
| `--color-bg` | `#faf8f5` | тёплый off-white, база страницы |
| `--color-surface` | `#f2f0ec` | подложка чередующихся секций |
| `--color-surface-2` | `#e9e6e0` | глубже |
| `--color-border` | `#e2dfd8` | границы |
| `--color-muted` | `#9c968c` | подписи/плейсхолдеры |
| `--color-ink-2` | `#57534d` | вторичный текст |
| `--color-ink` | `#1c1a18` | near-black, основной текст |
| `--color-accent` | `#f14736` | коралл — точечно: CTA, марка, маркер |
| `--color-accent-fg` | `#ffffff` | текст на акценте |

Утилиты: `bg-*`, `text-*`, `border-*` (`bg-ink`, `text-ink-2`, `border-border`, `bg-accent`, `text-accent-fg` …).

**Инверсия секций** — класс `.tone-ink` локально переопределяет нейтрали, поэтому `text-ink`/`bg-surface`/`border-border` внутри инвертируются автоматически. Через `<Section tone="ink">`.

### Типографика — Inter, fluid `clamp()`, иерархия размером+трекингом
| Утилита | Размер | line-height | tracking | weight |
|---|---|---|---|---|
| `text-display` | clamp(2.75→6rem) | 0.98 | −0.03em | 600 |
| `text-h1` | clamp(2.25→3.75rem) | 1.02 | −0.025em | 600 |
| `text-h2` | clamp(1.875→3rem) | 1.05 | −0.02em | 600 |
| `text-h3` | clamp(1.375→1.75rem) | 1.15 | −0.015em | 600 |
| `text-lead` | clamp(1.125→1.375rem) | 1.5 | −0.01em | 400 |
| `text-label` | 0.75rem | 1 | 0.08em | 500 |
| body (base) | 1rem | 1.6 | — | 400 |

`text-label` — eyebrow-ярлык над заголовками (донор Osmo), применять с `uppercase`. Размеры `text-sm`/`text-xs`/`text-base` и т.д. — дефолты Tailwind.

### Радиусы (ужаты к «точному» Osmo)
`--radius-md`/`--radius-lg` = 6px (кнопки), `--radius-xl` = 8px (карточки), `--radius-2xl` = 12px. Меняя токен — меняешь сквозь весь сайт.

### Ритм
`--section-y: clamp(4rem, 8vw, 8rem)` — вертикальный отступ секций (порт 7.5em Osmo). Внутри `<Section>`.

### Моторика
`--ease-osmo: cubic-bezier(0.625,0.05,0,1)` (сигнатура донора), `--ease-out`. Длительности: `--dur-fast .3s`, `--dur-base .6s`, `--dur-slow .9s`. Зеркало в `lib/motion.ts` (`EASE`, `DUR`).

## Motion-слой (GSAP + Lenis)
- `lib/motion.ts` — источник правды: `registerGsap()`, `EASE`, `DUR`, `REVEAL`, `prefersReducedMotion()`.
- `components/motion/MotionProvider.tsx` — регистрирует плагины, запускает Lenis, синхронит со ScrollTrigger. Смонтирован в `app/layout.tsx`.
- `components/motion/Reveal.tsx` — **главный примитив входной анимации**: `<Reveal stagger>` оборачивает контент серверной секции (children проходят насквозь). Старт-состояние ставится в layout-эффекте — без вспышки.
- `components/motion/SplitReveal.tsx` — **masked line reveal** (донор Osmo «Masked Text Reveal»): строки заголовка выезжают из-под маски (GSAP SplitText `mask:"lines"`, `autoSplit`). Для крупных заголовков (`text-display`/`text-h2`), `trigger="load"|"scroll"`. Класс `.split-line` (globals.css) даёт маске место под выносные элементы кириллицы — иначе режет «р/у/д».
- `components/motion/Marquee.tsx` — **бесконечная лента** (донор Osmo «CSS Marquee»/«Logo Wall Cycle»): дубль контента, трек на −50%, slow-on-hover. Отступы несут сами дети. Применён в `ClientsBar`.
- `components/motion/CountUp.tsx` — **count-up на скролле** (донор Osmo «Number Odometer»): парсит число из строки, тикает с 0, сохраняет префикс/суффикс. Через `<Stat animate>`; применён в `TrustBar`.
- Макро: `Preloader.tsx`, `Cursor.tsx` (pointer:fine), `app/template.tsx` (enter-переход страниц).
- **Intro-гейт** (`introReady`/`markIntroDone` в `lib/motion.ts`): анимации первого экрана с `trigger="load"` (Hero `SplitReveal`/`Reveal`, `HeroVisual`) ждут окончания прелоадера и раскрываются синхронно с уходом занавеса, а не за ним. После первой загрузки гейт открыт — на внутренних переходах не ждут. Прелоадер играет на каждой полной загрузке (~2с, по времени), на SPA-переходах не ремаунтится.

**Правила моторики**
- Анимации — только в client-компонентах; плагины регистрируются один раз через `registerGsap()`.
- Easing/длительности — всегда из `lib/motion.ts`, не задавать заново.
- `prefers-reduced-motion: reduce` → Lenis off, reveal-ы мгновенные, прелоадер/курсор выключены.
- Моторика не должна тормозить первый экран и мешать конверсии.

## Инвентарь компонентов
**UI-kit (`components/ui/`)** — на токенах: `Button` (варианты primary/accent/secondary/ghost, `data-cursor`), `Section` (tone default/surface/ink) + `SectionHeader` (eyebrow/title/lead), `Card`, `Badge`, `Stat`, `Container`, `MediaPlaceholder`, `InfoTooltip`.
**Секции (`components/sections/`)** — 22 шт., композятся на страницах из `content/*.ts`.
**Motion (`components/motion/`)** — `MotionProvider`, `Reveal`, `Preloader`, `Cursor`.

## Workflow расширения
Донор → Hi-Fi → финал, этапы не перепрыгивать. Новый стиль — через токены; новый компонент — только если ничего не подходит, и сразу переиспользуемым, на токенах, в kit. Моторика секций — через `<Reveal>` и общий easing, а не заново в каждом компоненте.
