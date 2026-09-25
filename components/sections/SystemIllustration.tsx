/*
  Мини-иллюстрации молочной метафоры для карточек SystemSection.
  Line-art на токенах (ink / muted / border / surface-2), как CaseVisual:
  цвет не несёт смысла, единственное accent-пятно - капля сливок у сепаратора.
*/

export type SystemVisual = "market" | "cow" | "separator";

/** Молочный бидон: корпус + крышка + ручки. Рисуется в локальных координатах 0..20×0..24. */
function Can({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* корпус с плечами и горловиной */}
      <path
        d="M3 24 V12 Q3 8 6 7 L7 6 V4 H13 V6 L14 7 Q17 8 17 12 V24 Z"
        className="text-surface-2"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M3 24 V12 Q3 8 6 7 L7 6 V4 H13 V6 L14 7 Q17 8 17 12 V24 Z"
        className="text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* крышка */}
      <path
        d="M6.5 4 H13.5"
        className="text-ink"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.5 4 V1.5 H11.5 V4"
        className="text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* ручки */}
      <path
        d="M3 13 Q0.5 13 0.5 15.5 M17 13 Q19.5 13 19.5 15.5"
        className="text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
}

type VisualProps = { animated: boolean };

/** Движущаяся часть живой версии (обёртка без transform). В статике - без обёртки. */
function Part({ on, children }: { on: boolean; children: React.ReactNode }) {
  return on ? <g>{children}</g> : <>{children}</>;
}

const AWNING_ROOF = "M52 14 L52 8 H228 V14";
const AWNING_FESTOONS =
  "M52 14 Q63 22 74 14 Q85 22 96 14 Q107 22 118 14 Q129 22 140 14 Q151 22 162 14 Q173 22 184 14 Q195 22 206 14 Q217 22 228 14";

/** Рынок: навес-прилавок, бидон, ценник - платишь за каждый литр. */
function Market({ animated }: VisualProps) {
  const awning = {
    className: "text-ink",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round" as const,
  };
  return (
    <>
      {/* навес: штанги + фестоны */}
      <path
        d="M52 30 V14 H228 V30"
        className="text-border"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {animated ? (
        /* живая версия: крыша и фестоны - отдельные контуры, прорисовываются по очереди */
        <>
          <path d={AWNING_ROOF} pathLength={1} {...awning} />
          <path d={AWNING_FESTOONS} pathLength={1} {...awning} />
        </>
      ) : (
        <path d={`${AWNING_ROOF} ${AWNING_FESTOONS}`} {...awning} />
      )}
      {/* прилавок */}
      <line
        x1="60"
        x2="220"
        y1="70"
        y2="70"
        className="text-ink"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M70 70 V86 M210 70 V86"
        className="text-border"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* монета ₸ → бидон: платишь за каждый литр */}
      <Part on={animated}>
        <circle
          cx="92"
          cy="56"
          r="9"
          className="text-surface-2"
          fill="currentColor"
        />
        <circle
          cx="92"
          cy="56"
          r="9"
          className="text-ink"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text
          x="92"
          y="60"
          textAnchor="middle"
          className="text-ink"
          fill="currentColor"
          fontSize="10"
          fontWeight="600"
        >
          ₸
        </text>
      </Part>
      {animated ? (
        /* живая версия: древко прорисовывается, наконечник - отдельным контуром */
        <g
          className="text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M106 56 H122" pathLength={1} />
          <path d="M117 52 L122 56 L117 60" />
        </g>
      ) : (
        <path
          d="M106 56 H122 M122 56 L117 52 M122 56 L117 60"
          className="text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {/* бидон на прилавке */}
      <Part on={animated}>
        <Can x={130} y={42} s={1.15} />
      </Part>
      {/* ценник */}
      <Part on={animated}>
        <rect
          x="172"
          y="46"
          width="36"
          height="18"
          rx="3"
          className="text-bg"
          fill="currentColor"
        />
        <rect
          x="172"
          y="46"
          width="36"
          height="18"
          rx="3"
          className="text-border"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text
          x="190"
          y="58.5"
          textAnchor="middle"
          className="text-muted"
          fill="currentColor"
          fontSize="10"
        >
          ₸/л
        </text>
      </Part>
    </>
  );
}

/* Штрихи линии роста (4 через 5, как strokeDasharray статики) - элемент на штрих:
   живая версия проявляет их каскадом, линия «прорисовывается» по штрихам. */
const TREND: [number, number, number, number][] = (() => {
  const [x0, y0, x1, y1] = [30, 76, 250, 30];
  const len = Math.hypot(x1 - x0, y1 - y0);
  const ux = (x1 - x0) / len;
  const uy = (y1 - y0) / len;
  const r = (n: number) => Math.round(n * 100) / 100;
  const out: [number, number, number, number][] = [];
  for (let s = 0; s + 4 <= len; s += 9) {
    out.push([r(x0 + ux * s), r(y0 + uy * s), r(x0 + ux * (s + 4)), r(y0 + uy * (s + 4))]);
  }
  return out;
})();

/** Своя корова → стадо: восходящая пунктирная линия, бидоны растут. */
function Cow({ animated }: VisualProps) {
  return (
    <>
      {/* база */}
      <line
        x1="28"
        x2="252"
        y1="84"
        y2="84"
        className="text-border"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* восходящий пунктир роста */}
      {animated ? (
        <g
          className="text-muted"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {TREND.map(([xa, ya, xb, yb]) => (
            <line key={`${xa}-${ya}`} x1={xa} y1={ya} x2={xb} y2={yb} />
          ))}
        </g>
      ) : (
        <path
          d="M30 76 L250 30"
          className="text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
      )}
      {/* стрелка на конце */}
      <path
        d="M250 30 L242.5 30.5 M250 30 L246 36.5"
        className="text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* бидоны: 1 → 2 → 3, каждый литр дешевле */}
      <Part on={animated}>
        <Can x={44} y={67} s={0.7} />
      </Part>
      <Part on={animated}>
        <Can x={118} y={56} s={1} />
      </Part>
      <Part on={animated}>
        <Can x={186} y={45} s={1.3} />
      </Part>
    </>
  );
}

/** Сепаратор: молоко из рекламы и SEO → конус → сливки (заявки). */
function Separator() {
  return (
    <>
      {/* подписи источников */}
      <text
        x="92"
        y="14"
        textAnchor="middle"
        className="text-muted"
        fill="currentColor"
        fontSize="10"
      >
        Реклама
      </text>
      <text
        x="188"
        y="14"
        textAnchor="middle"
        className="text-muted"
        fill="currentColor"
        fontSize="10"
      >
        SEO
      </text>
      {/* струи молока в конус */}
      <path
        d="M92 20 V34 M188 20 V34"
        className="text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 4"
        strokeLinecap="round"
      />
      {/* конус-воронка */}
      <path
        d="M76 36 H204 L150 62 H130 Z"
        className="text-surface-2"
        fill="currentColor"
      />
      <path
        d="M76 36 H204 L150 62 H130 Z"
        className="text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* капля сливок - единственный accent в секции */}
      <path
        d="M140 68 Q144 74 144 77 A4 4 0 1 1 136 77 Q136 74 140 68 Z"
        className="text-accent"
        fill="currentColor"
      />
      <text
        x="156"
        y="82"
        textAnchor="start"
        className="text-muted"
        fill="currentColor"
        fontSize="10"
      >
        сливки = заявки
      </text>
    </>
  );
}

const VISUALS: Record<SystemVisual, (p: VisualProps) => React.ReactNode> = {
  market: Market,
  cow: Cow,
  separator: Separator,
};

export function SystemIllustration({
  variant,
  label,
  animated = false,
}: {
  variant: SystemVisual;
  label?: string;
  /** Разметка под сценарий движения (MetaphorCallout): тот же финальный кадр,
      движущиеся части в обёртках, прорисовка - отдельными контурами. */
  animated?: boolean;
}) {
  const Visual = VISUALS[variant];
  return (
    <svg
      viewBox="0 0 280 96"
      className="h-auto w-full"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <Visual animated={animated} />
    </svg>
  );
}
