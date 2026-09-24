import { pageCopy } from "@/content/visuals";
import { HeroFrame } from "../frame/HeroFrame";

/** Hero /cases: три результата из реальных кейсов (не образцы, не «в работе»). */
export function CasesHero() {
  return (
    <HeroFrame kind="cases" copy={pageCopy.cases}>
      <div className="absolute inset-0 grid place-items-center rounded-xl border border-dashed border-border text-muted">
        <span className="ill-t-md">cases</span>
      </div>
    </HeroFrame>
  );
}
