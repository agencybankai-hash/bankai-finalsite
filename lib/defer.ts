/**
 * Отложенный запуск тяжёлых сторонних скриптов (GTM, GA4, Метрика):
 * по первому действию посетителя (скролл, тап, клик, клавиша, движение мыши)
 * либо по таймеру после загрузки страницы. Так они не конкурируют
 * с первой краской и гидратацией и не попадают в окно измерения TBT.
 * Возвращает функцию отмены.
 */
const EVENTS = ["scroll", "pointerdown", "keydown", "touchstart", "mousemove", "wheel"] as const;

export function runOnInteractionOrAfter(fn: () => void, delayMs = 6000): () => void {
  let done = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const fire = () => {
    if (done) return;
    done = true;
    cleanup();
    fn();
  };
  const cleanup = () => {
    if (timer) clearTimeout(timer);
    EVENTS.forEach((e) => window.removeEventListener(e, fire));
  };
  EVENTS.forEach((e) => window.addEventListener(e, fire, { passive: true, once: true }));
  const arm = () => {
    timer = setTimeout(fire, delayMs);
  };
  if (document.readyState === "complete") arm();
  else window.addEventListener("load", arm, { once: true });
  return () => {
    done = true;
    cleanup();
  };
}
