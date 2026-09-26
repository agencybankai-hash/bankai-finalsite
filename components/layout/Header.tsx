"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import { contacts, siteMeta } from "@/content/site";
import { ui } from "@/content/ui";
import type { Locale, NavItem } from "@/content/types";
import { switchHref } from "@/lib/i18n";
import { cn, keepHyphens, nbsp } from "@/lib/utils";

/* Подпись языка - на нём самом, чтобы читалась в любой локали. */
const localeName: Record<Locale, string> = { ru: "Русский", en: "English" };
const locales: Locale[] = ["ru", "en"];

/* Hover-intent панелей: открытие с задержкой, чтобы бар не мигал при проходе
   мышью; закрытие - с запасом на путь курсора от пункта до панели. */
const OPEN_DELAY = 80;
const CLOSE_DELAY = 200;
/* Мобильный бар прячется при скролле вниз, но не у самого верха страницы. */
const HIDE_AFTER = 120;
const HIDE_STEP = 6;

/** Открытая панель десктопа: индекс группы в nav; hover закрывается уходом
 *  курсора, click - только явно; instant - смена группы без анимации. */
type Menu = { index: number | null; via: "hover" | "click"; instant: boolean };
const CLOSED: Menu = { index: null, via: "hover", instant: false };

/* Появление панелей и мобильного меню: display переключается дискретно, вход -
   через @starting-style. Закрытые ссылки не в раскладке, Next их не префетчит,
   но в SSR-HTML они есть - сквозная перелинковка на услуги сохраняется. */
const reveal =
  "transition-[opacity,translate,display] transition-discrete duration-300 ease-osmo starting:-translate-y-2 starting:opacity-0 motion-reduce:transition-none";

const navItem =
  "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-ink transition-colors duration-300 ease-osmo hover:bg-surface";

/** Клик по ссылке внутри закрывает меню - и при переходе на ту же страницу.
 *  С модификатором (новая вкладка) пользователь остаётся здесь - не закрываем. */
function closeOnLink(e: React.MouseEvent, close: () => void) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if ((e.target as Element).closest("a")) close();
}

/** Главный пункт группы и остальные; колонки - если у пунктов есть подпункты. */
function splitGroup(group: NavItem) {
  const items = group.children ?? [];
  const rest = items.filter((item) => !item.featured);
  return {
    featured: items.find((item) => item.featured),
    rest,
    columns: rest.some((item) => item.children?.length),
  };
}

/** Типографика подписей: предлоги не висят, слова через дефис не рвутся.
 *  Один span-обёртка: во flex с gap куски keepHyphens стали бы отдельными элементами. */
function Typo({ text }: { text: string }) {
  return <span>{keepHyphens(nbsp(text))}</span>;
}

/** Маркер «вы здесь» - коралловая точка у текущей страницы. */
function CurrentDot() {
  return <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />;
}

/** Марка (молния из app/icon.svg) и название. */
function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="group flex items-center gap-2 text-ink">
      <svg
        viewBox="0 0 64 64"
        aria-hidden
        className="h-6 w-6 text-accent-bright transition-transform duration-300 ease-osmo group-hover:-rotate-12 motion-reduce:transition-none"
      >
        <path fill="currentColor" d="M37 4 12 37h17l-4 23 27-35H34z" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">{siteMeta.name}</span>
    </Link>
  );
}

/** Переключатель локали: сегменты RU|EN, текущая - подложкой, вторая - ссылкой на парную страницу. */
function LocaleSwitch({ locale, href }: { locale: Locale; href: string }) {
  const segment = "inline-flex h-7 items-center rounded-full px-2.5";
  return (
    <div className="inline-flex items-center rounded-full border border-border p-0.5 text-xs font-semibold">
      {locales.map((l) =>
        l === locale ? (
          <span key={l} aria-current="true" className={cn(segment, "bg-surface-2 text-ink")}>
            {l.toUpperCase()}
          </span>
        ) : (
          <Link
            key={l}
            href={href}
            hrefLang={l}
            aria-label={localeName[l]}
            className={cn(segment, "text-muted transition-colors duration-300 ease-osmo hover:text-ink")}
          >
            {l.toUpperCase()}
          </Link>
        ),
      )}
    </div>
  );
}

/** Карточка главного пункта группы: название, описание, стрелка. */
function FeaturedCard({
  item,
  current,
  compact,
  className,
}: {
  item: NavItem;
  current: boolean;
  compact?: boolean;
  className?: string;
}) {
  // Десктоп: текст сверху (в линию с колонками каналов), стрелка в нижнем углу -
  // узкая карточка на lg не выдавливает её за край. Мобилка: стрелка справа.
  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "group/card flex justify-between gap-4 rounded-xl bg-surface transition-colors duration-300 ease-osmo hover:bg-surface-2",
        compact ? "items-center p-4" : "flex-col p-6",
        className,
      )}
    >
      <span className="block">
        <span
          className={cn(
            "flex items-center gap-2 font-display font-semibold leading-tight tracking-tight text-ink",
            compact ? "text-lg" : "text-xl",
          )}
        >
          <Typo text={item.label} />
          {current && <CurrentDot />}
        </span>
        {item.description && (
          <span className="mt-1.5 block text-balance text-sm leading-snug text-ink-2">
            <Typo text={item.description} />
          </span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-bg text-ink transition-colors duration-300 ease-osmo group-hover/card:border-ink group-hover/card:bg-ink group-hover/card:text-bg",
          compact ? "h-8 w-8" : "h-9 w-9 self-end",
        )}
      >
        <Icon name="arrow" className="h-4 w-4" />
      </span>
    </Link>
  );
}

/** Десктоп-панель группы: карточка главного пункта слева, справа - колонки
 *  каналов с подуслугами или строки ссылок. Колонки на subgrid: хайрлайн над
 *  подуслугами идёт одной линией, даже если название канала перенеслось. */
function PanelContent({ group, isCurrent }: { group: NavItem; isCurrent: (href: string) => boolean }) {
  const { featured, rest, columns } = splitGroup(group);
  const current = (href: string) => (isCurrent(href) ? "page" : undefined);

  return (
    <div className="grid grid-cols-12 gap-8 py-8">
      {featured && (
        <FeaturedCard
          item={featured}
          current={isCurrent(featured.href)}
          className="col-span-3 xl:col-span-4"
        />
      )}
      {columns ? (
        <div className="col-span-9 grid grid-cols-3 grid-rows-[auto_1fr] gap-x-8 xl:col-span-8">
          {rest.map((item) => (
            <div key={item.href} className="row-span-2 grid grid-rows-subgrid">
              <Link href={item.href} aria-current={current(item.href)} className="group/item block">
                <span className="flex items-center gap-2 text-base font-semibold text-ink">
                  <Typo text={item.label} />
                  {isCurrent(item.href) ? (
                    <CurrentDot />
                  ) : (
                    <Icon
                      name="arrow"
                      className="h-4 w-4 -translate-x-1 opacity-0 transition duration-300 ease-osmo group-hover/item:translate-x-0 group-hover/item:opacity-100"
                    />
                  )}
                </span>
                {item.description && (
                  <span className="mt-1 block text-balance text-sm leading-snug text-ink-2">
                    <Typo text={item.description} />
                  </span>
                )}
              </Link>
              {item.children && (
                <ul className="mt-4 border-t border-border pt-2">
                  {item.children.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        aria-current={current(sub.href)}
                        className="flex items-center gap-2 py-1.5 text-sm text-ink-2 transition-colors duration-300 ease-osmo hover:text-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
                      >
                        <Typo text={sub.label} />
                        {isCurrent(sub.href) && <CurrentDot />}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ul className="col-span-9 grid grid-cols-2 gap-x-8 self-start border-t border-border xl:col-span-8">
          {rest.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current(item.href)}
                className="group/item flex items-center justify-between gap-4 border-b border-border py-3.5 text-base font-medium text-ink"
              >
                <span className="flex items-center gap-2">
                  <Typo text={item.label} />
                  {isCurrent(item.href) && <CurrentDot />}
                </span>
                <Icon
                  name="arrow"
                  className="h-4 w-4 shrink-0 text-muted transition duration-300 ease-osmo group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-ink"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Раскрытая группа в мобильном меню: карточка главного пункта, каналы с
 *  подуслугами-чипами или список ссылок. */
function MobileGroupBody({ group, isCurrent }: { group: NavItem; isCurrent: (href: string) => boolean }) {
  const { featured, rest, columns } = splitGroup(group);
  const current = (href: string) => (isCurrent(href) ? "page" : undefined);

  return (
    <div className="space-y-5 pb-6 pt-1">
      {featured && <FeaturedCard item={featured} current={isCurrent(featured.href)} compact />}
      {columns ? (
        rest.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              aria-current={current(item.href)}
              className="flex items-center justify-between gap-4 py-1 text-base font-semibold text-ink"
            >
              <span className="flex items-center gap-2">
                <Typo text={item.label} />
                {isCurrent(item.href) && <CurrentDot />}
              </span>
              <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted" />
            </Link>
            {item.children && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {item.children.map((sub) => (
                  <Pill key={sub.href} href={sub.href} active={isCurrent(sub.href)}>
                    {sub.label}
                  </Pill>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <ul>
          {rest.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current(item.href)}
                className="flex items-center justify-between gap-4 py-2.5 text-base text-ink-2 aria-[current=page]:text-ink"
              >
                <span className="flex items-center gap-2">
                  <Typo text={item.label} />
                  {isCurrent(item.href) && <CurrentDot />}
                </span>
                <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Header({ locale = "ru" }: { locale?: Locale }) {
  const pathname = usePathname();
  const { nav, headerCta, home, menuLabel, closeLabel, telegramLabel } = ui(locale);
  const uid = useId();
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  const [menu, setMenu] = useState<Menu>(CLOSED);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);

  // Шапка живёт в layout и переживает переходы между страницами: закрываем
  // меню при смене адреса, какой бы ссылкой его ни вызвали.
  // Сброс в рендере, а не в эффекте: так рекомендует React и требует линтер.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenu(CLOSED);
    setMobileOpen(false);
  }

  const otherLocaleHref = switchHref(pathname, locale);
  const isCurrent = (href: string) => pathname === href;
  const inSection = (href: string) =>
    href === home ? pathname === home : pathname === href || pathname.startsWith(`${href}/`);

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };
  const closeMenu = () => {
    clearTimers();
    setMenu(CLOSED);
  };
  // Наведение: при уже открытой панели - мгновенная смена группы, иначе
  // открытие после паузы. Уход курсора закрывает только открытое наведением.
  const hoverOpen = (index: number) => {
    clearTimers();
    if (menu.index !== null) {
      setMenu((m) => (m.index === index ? m : { index, via: m.via, instant: true }));
      return;
    }
    openTimer.current = window.setTimeout(
      () => setMenu({ index, via: "hover", instant: false }),
      OPEN_DELAY,
    );
  };
  const hoverLeave = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(
      () => setMenu((m) => (m.via === "hover" ? CLOSED : m)),
      CLOSE_DELAY,
    );
  };
  // Клик закрепляет панель (в том числе открытую наведением), повторный - закрывает.
  const toggleMenu = (index: number) => {
    clearTimers();
    setMenu((m) =>
      m.index === index && m.via === "click"
        ? CLOSED
        : { index, via: "click", instant: m.index !== null && m.index !== index },
    );
  };
  // Мобильное меню открывается с раскрытым разделом текущей страницы.
  const toggleMobile = () => {
    if (mobileOpen) {
      setMobileOpen(false);
      return;
    }
    const active = nav.findIndex((item) => item.children && inSection(item.href));
    setExpanded(active === -1 ? null : active);
    setHidden(false);
    setMobileOpen(true);
  };

  // Escape закрывает меню и возвращает фокус на кнопку, которая его открыла.
  useEffect(() => {
    if (menu.index === null && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mobileOpen) {
        setMobileOpen(false);
        burgerRef.current?.focus();
      } else if (menu.index !== null) {
        setMenu(CLOSED);
        document.getElementById(`${uid}-trigger-${menu.index}`)?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu.index, mobileOpen, uid]);

  // Нажатие вне пункта с открытой панелью закрывает её (в том числе по затемнению).
  useEffect(() => {
    if (menu.index === null) return;
    const item = document.getElementById(`${uid}-item-${menu.index}`);
    const onDown = (e: PointerEvent) => {
      if (item && !item.contains(e.target as Node)) setMenu(CLOSED);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu.index, uid]);

  // Под открытым мобильным меню страница не скроллится. Ширину пропавшего
  // скроллбара компенсируем отступом, чтобы контент не прыгал.
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const { overflow, paddingRight } = root.style;
    const gap = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
    return () => {
      root.style.overflow = overflow;
      root.style.paddingRight = paddingRight;
    };
  }, [mobileOpen]);

  // Смена раскладки (поворот планшета, ресайз окна) - закрываем оба меню,
  // иначе мобильное осталось бы открытым невидимым и держало блокировку скролла.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const reset = () => {
      setMobileOpen(false);
      setMenu(CLOSED);
    };
    mq.addEventListener("change", reset);
    return () => mq.removeEventListener("change", reset);
  }, []);

  // Частично липкий бар (только < lg): уходит при скролле вниз, возвращается при скролле вверх.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y <= HIDE_AFTER) {
        setHidden(false);
        lastY = y;
      } else if (Math.abs(y - lastY) > HIDE_STEP) {
        setHidden(y > lastY);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  // Фокус-трап открытого мобильного меню: Tab ходит по бару и меню по кругу.
  const trapFocus = (e: React.KeyboardEvent) => {
    if (!mobileOpen || e.key !== "Tab" || !headerRef.current) return;
    const nodes = Array.from(
      headerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    ).filter((el) => el.getClientRects().length > 0 && !el.closest("[inert]"));
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const solid = menu.index !== null || mobileOpen;

  return (
    <header
      ref={headerRef}
      onKeyDown={trapFocus}
      onFocus={() => setHidden(false)}
      data-lenis-prevent={mobileOpen || undefined}
      className={cn(
        "sticky top-0 z-50 transition-[translate] duration-300 ease-osmo motion-reduce:transition-none",
        hidden && !mobileOpen && "max-lg:-translate-y-full",
      )}
    >
      {/* Фон бара отдельным слоем: backdrop-filter (как и transform) на самом
          header сделал бы его точкой отсчёта для fixed-меню внутри. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 border-b border-border transition-colors duration-300 ease-osmo",
          solid ? "bg-bg" : "bg-bg/85 backdrop-blur-md",
        )}
      />
      {/* Затемнение страницы под открытой панелью */}
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 -z-20 hidden bg-ink/10 transition-opacity duration-300 ease-osmo motion-reduce:transition-none lg:block",
          menu.index !== null ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <Container>
        <div className="flex h-14 items-center justify-between gap-6 lg:h-16">
          <Logo href={home} />

          {/* Десктоп-навигация. Пункты-группы не позиционированы: панель
              отсчитывается от header и встаёт на всю ширину под баром. */}
          <nav aria-label={menuLabel} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item, i) =>
                item.children ? (
                  <li
                    key={item.href}
                    id={`${uid}-item-${i}`}
                    className="flex h-16 items-center"
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") hoverOpen(i);
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === "mouse") hoverLeave();
                    }}
                    onBlur={(e) => {
                      const next = e.relatedTarget as Node | null;
                      if (menu.index === i && next && !e.currentTarget.contains(next)) closeMenu();
                    }}
                  >
                    <button
                      id={`${uid}-trigger-${i}`}
                      type="button"
                      aria-expanded={menu.index === i}
                      aria-controls={`${uid}-panel-${i}`}
                      onClick={() => toggleMenu(i)}
                      className={cn(
                        navItem,
                        (menu.index === i || inSection(item.href)) && "bg-surface",
                      )}
                    >
                      {item.label}
                      <Icon
                        name="chevron"
                        strokeWidth={2}
                        className={cn(
                          "h-3.5 w-3.5 text-ink-2 transition-transform duration-300 ease-osmo",
                          menu.index === i && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      id={`${uid}-panel-${i}`}
                      tabIndex={-1}
                      onClick={(e) => closeOnLink(e, closeMenu)}
                      className={cn(
                        "absolute inset-x-0 top-full border-b border-border bg-bg outline-none",
                        reveal,
                        menu.index === i ? "block" : "hidden -translate-y-2 opacity-0",
                        menu.instant && "duration-0",
                      )}
                    >
                      <Container>
                        <PanelContent group={item} isCurrent={isCurrent} />
                      </Container>
                    </div>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={cn(navItem, inSection(item.href) && "bg-surface")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LocaleSwitch locale={locale} href={otherLocaleHref} />
            <a
              href={contacts.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={telegramLabel}
              title={telegramLabel}
              className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-ink transition-colors duration-300 ease-osmo hover:bg-surface"
            >
              <Icon name="send" className="h-4.5 w-4.5" />
            </a>
            <Button href={headerCta.href} variant="accent" className="group">
              {headerCta.label}
              <Icon
                name="arrow"
                className="h-4 w-4 transition-transform duration-300 ease-osmo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Button>
          </div>

          {/* Бургер с подписью: две линии морфятся в крест, подписи
              «Меню»/«Закрыть» лежат в одной ячейке - ширина не прыгает. */}
          <button
            ref={burgerRef}
            type="button"
            aria-label={mobileOpen ? closeLabel : menuLabel}
            aria-expanded={mobileOpen}
            aria-controls={`${uid}-sheet`}
            onClick={toggleMobile}
            className="inline-flex h-10 items-center gap-2.5 rounded-full border border-border pl-3.5 pr-4 text-sm font-medium text-ink transition-colors duration-300 ease-osmo hover:bg-surface lg:hidden"
          >
            <span aria-hidden className="relative h-2.5 w-4">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-0.5 rounded-full bg-current transition-[translate,rotate] duration-300 ease-osmo motion-reduce:transition-none",
                  mobileOpen && "translate-y-1 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-current transition-[translate,rotate] duration-300 ease-osmo motion-reduce:transition-none",
                  mobileOpen && "-translate-y-1 -rotate-45",
                )}
              />
            </span>
            <span aria-hidden className="grid">
              <span
                className={cn(
                  "transition-opacity duration-300 [grid-area:1/1]",
                  mobileOpen && "opacity-0",
                )}
              >
                {menuLabel}
              </span>
              <span
                className={cn(
                  "transition-opacity duration-300 [grid-area:1/1]",
                  !mobileOpen && "opacity-0",
                )}
              >
                {closeLabel}
              </span>
            </span>
          </button>
        </div>
      </Container>

      {/* Мобильное меню: во всю высоту под баром, список скроллится,
          CTA и быстрый контакт закреплены снизу. */}
      <div
        id={`${uid}-sheet`}
        data-lenis-prevent
        onClick={(e) => closeOnLink(e, () => setMobileOpen(false))}
        className={cn(
          "fixed inset-x-0 bottom-0 top-14 flex-col bg-bg lg:hidden",
          reveal,
          mobileOpen ? "flex" : "hidden -translate-y-2 opacity-0",
        )}
      >
        <nav aria-label={menuLabel} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <Container>
            <ul>
              {nav.map((item, i) => (
                <li
                  key={item.href}
                  className="border-b border-border transition-[opacity,translate] duration-500 ease-osmo starting:translate-y-3 starting:opacity-0 motion-reduce:transition-none"
                  style={{ transitionDelay: `${60 + i * 40}ms` }}
                >
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={expanded === i}
                        aria-controls={`${uid}-group-${i}`}
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        className="flex h-14 w-full items-center justify-between gap-4 text-left font-display text-2xl font-semibold tracking-tight text-ink"
                      >
                        <span className="flex items-center gap-2.5">
                          {item.label}
                          {inSection(item.href) && <CurrentDot />}
                        </span>
                        <Icon
                          name="chevron"
                          className={cn(
                            "h-5 w-5 shrink-0 text-muted transition-transform duration-300 ease-osmo",
                            expanded === i && "rotate-180",
                          )}
                        />
                      </button>
                      <div
                        id={`${uid}-group-${i}`}
                        inert={expanded !== i}
                        className={cn(
                          "grid transition-[grid-template-rows] duration-300 ease-osmo motion-reduce:transition-none",
                          expanded === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <div className="overflow-hidden">
                          <MobileGroupBody group={item} isCurrent={isCurrent} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className="flex h-14 items-center justify-between gap-4 font-display text-2xl font-semibold tracking-tight text-ink"
                    >
                      <span className="flex items-center gap-2.5">
                        {item.label}
                        {inSection(item.href) && <CurrentDot />}
                      </span>
                      <Icon name="arrow" className="h-5 w-5 shrink-0 text-muted" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </nav>

        <div
          className="border-t border-border"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <Container className="flex flex-col gap-3 pt-4">
            <Button href={headerCta.href} variant="accent" size="lg" className="w-full">
              {headerCta.label}
              <Icon name="arrow" className="h-4 w-4" />
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={contacts.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border px-4 text-sm font-medium text-ink transition-colors duration-300 ease-osmo hover:bg-surface"
              >
                <Icon name="send" className="h-4 w-4" />
                {telegramLabel}
              </a>
              <LocaleSwitch locale={locale} href={otherLocaleHref} />
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
