import { pageCopy } from "@/content/visuals";
import { HeroFrame } from "../frame/HeroFrame";

/** Hero /contacts: первые шаги после заявки. Только десктоп - на мобиле форма выше. */
export function ContactsHero() {
  return (
    <HeroFrame kind="contacts" copy={pageCopy.contacts} mobile="hide">
      <div className="absolute inset-0 grid place-items-center rounded-xl border border-dashed border-border text-muted">
        <span className="ill-t-md">contacts</span>
      </div>
    </HeroFrame>
  );
}
