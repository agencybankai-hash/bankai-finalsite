"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  registerGsap,
  prefersReducedMotion,
  introReady,
  EASE,
  DUR,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FloatCard } from "@/components/ui/FloatCard";

/**
 * Правая колонка hero: тёмная панель-«снимок результата». Контраст
 * light/dark (донор Osmo) + смысл под value-prop («видите, сколько
 * заявок и почём»). Бары растут снизу каскадом на входе.
 * Иллюстративная инфографика Hi-Fi-этапа (цифры — из реальных claim'ов).
 */
const BARS = [30, 42, 36, 54, 62, 78, 92]; // % высоты, по нарастающей

export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;
      const bars = el.querySelectorAll<HTMLElement>("[data-bar]");

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        gsap.set(bars, { scaleY: 1, autoAlpha: 1 });
        return;
      }

      // спрятать до краски; раскрыть после прелоадера (синхрон с занавесом)
      gsap.set(el, { autoAlpha: 0, y: 24 });
      gsap.set(bars, { scaleY: 0, transformOrigin: "bottom" });
      introReady(() => {
        const tl = gsap.timeline({ delay: 0.45 });
        tl.to(el, { autoAlpha: 1, y: 0, duration: DUR.base, ease: EASE }).to(
          bars,
          {
            scaleY: 1,
            duration: DUR.base,
            ease: EASE,
            stagger: 0.06,
          },
          "-=0.35",
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative">
      {/* Мягкий коралл-радиал позади панели (донор metatag) */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(120%_120%_at_75%_15%,var(--color-accent-soft),transparent_62%)]"
      />

      {/* Центральная тёмная панель — «снимок результата» */}
      <div className="rounded-2xl bg-ink p-7 text-bg shadow-float">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-label uppercase text-bg/55">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
            Динамика заявок
          </span>
          <span className="text-label uppercase text-bg/40">90 дней</span>
        </div>

        <div className="mt-7 flex h-40 items-end gap-2.5" aria-hidden>
          {BARS.map((h, i) => (
            <span
              key={i}
              data-bar
              style={{ height: `${h}%` }}
              className={cn(
                "flex-1 rounded-t-sm",
                i >= BARS.length - 2 ? "bg-accent" : "bg-bg/15",
              )}
            />
          ))}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 border-t border-bg/10 pt-5">
          <div>
            <div className="text-2xl font-semibold tracking-tight">−40%</div>
            <div className="mt-0.5 text-sm text-bg/55">стоимость заявки</div>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">5.2x</div>
            <div className="mt-0.5 text-sm text-bg/55">ROAS в проектах</div>
          </div>
        </div>
      </div>

      {/* Floating-карточка-отзыв (донор metatag — стеклянные карточки) */}
      <div
        className="float-soft absolute -left-7 -top-9 w-48 rounded-xl border border-border bg-bg p-3.5 shadow-float"
        style={{ animationDelay: "-1.5s" }}
      >
        <div className="flex gap-0.5 text-accent" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-xs">
              ★
            </span>
          ))}
        </div>
        <p className="mt-1.5 text-xs leading-snug text-ink-2">
          «Заявки пошли с первого месяца»
        </p>
      </div>

      {/* Floating-карточка-метрика */}
      <div className="absolute -bottom-6 -right-5 w-44">
        <FloatCard
          float
          style={{ animationDelay: "-3.5s" }}
          label="Заявок / мес"
          value="86"
          delta="↑ 38%"
          icon="trending"
        />
      </div>
    </div>
  );
}
