import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Глобальный 404 (URL вне обеих локалей). Root-layout'ов два (RU и EN), поэтому
 * Next рендерит этот файл вне них - html/body подставляет сам, а шрифт, стили
 * и обвязку собираем здесь. Язык - RU как основной; 404 внутри EN-раздела
 * перехватывает app/(en)/en/not-found.tsx.
 */
export default function NotFound() {
  return (
    <div className={`${inter.variable} flex min-h-screen flex-col font-sans`}>
      <MotionProvider>
        <Header />
        <main className="flex-1">
          <Section>
            <div className="max-w-2xl">
              <p className="text-label uppercase text-muted">404</p>
              <h1 className="mt-3 text-h1 text-ink">Такой страницы нет</h1>
              <p className="mt-4 text-lead text-ink-2">
                Ссылка устарела или в адресе опечатка. Вот куда стоит заглянуть
                вместо неё.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/" size="lg">
                  На главную
                </Button>
                <Button href="/cases" variant="secondary" size="lg">
                  Кейсы
                </Button>
                <Button href="/contacts" variant="secondary" size="lg">
                  Контакты
                </Button>
              </div>
            </div>
          </Section>
        </main>
        <Footer />
      </MotionProvider>
    </div>
  );
}
