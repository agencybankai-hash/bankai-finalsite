This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Заявки с&nbsp;сайта

Форма на&nbsp;`/contacts` (`components/sections/ContactForm.tsx`) шлёт POST в&nbsp;`app/api/contact/route.ts`.
Роут параллельно отправляет заявку трём получателям, ошибка одного не&nbsp;блокирует остальные
(ответ `ok`, если сработал хотя&nbsp;бы один; сбои видны в&nbsp;логах Vercel как `contact <канал> failed`):

- **Neon**, таблица `leads` - просмотр на&nbsp;`/admin/leads` (Basic Auth: `ADMIN_USER` / `ADMIN_PASSWORD`),
  CSV на&nbsp;`/api/admin/export`, удаление строки кнопкой в&nbsp;таблице (`DELETE /api/admin/leads/:id`).
  Статусов пока нет.
- **Telegram**, группа «Обработка заявок - Bankai.Agency» через бота `@BankaiApplicationsBot`
  (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
- **Почта** через Resend (REST API, `lib/notify.ts`): `RESEND_API_KEY`, отправитель `LEAD_EMAIL_FROM`
  (по умолчанию `Bankai Agency <leads@bankai.agency>`, домен должен быть подтверждён в&nbsp;Resend:
  DNS-записи DKIM и&nbsp;поддомен `send`), получатели `LEAD_EMAIL_TO` через запятую
  (по умолчанию `agency.bankai@gmail.com`). Если контакт лида похож на&nbsp;email, он идёт в&nbsp;Reply-To.

### Защита формы

- **Cloudflare Turnstile.** Включается парой ключей: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (виджет)
  и&nbsp;`TURNSTILE_SECRET_KEY` (проверка в&nbsp;роуте, `lib/turnstile.ts`). Без ключей форма работает
  без проверки. Режим `interaction-only`: посетитель видит виджет, только если Cloudflare
  решит задать проверку. Если сам Cloudflare недоступен, заявка принимается, факт пишется в&nbsp;лог.
  Тестовые ключи для локалки: site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.
- **Origin.** Роут принимает POST только с&nbsp;`bankai.agency`, `*.bankai.agency`, `*.vercel.app`
  и&nbsp;`localhost`; иначе 403. Отсекает примитивные скрипты, настоящая защита - Turnstile.
- **Honeypot** `company` и&nbsp;лёгкий лимит 5&nbsp;заявок за&nbsp;10&nbsp;минут с&nbsp;IP в&nbsp;памяти
  инстанса (на&nbsp;serverless не&nbsp;строгий; строгий лимит - правило Vercel Firewall или Upstash).
- Заголовки безопасности (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`) задаются в&nbsp;`next.config.ts`. Полного CSP нет.

Переменные уведомлений задаются в&nbsp;Vercel для Production (и&nbsp;Preview, если нужны уведомления
с&nbsp;превью). Без них роут пишет только в&nbsp;Neon и&nbsp;логирует ошибку канала.
FormSubmit для почты не&nbsp;подходит: он за&nbsp;Cloudflare и&nbsp;серверам Vercel отдаёт челлендж 403.

## Переменные окружения

Полный список - в `.env.example`, локальные значения кладутся в `.env.local`.

Аналитика подключается только если заданы переменные, иначе скрипты не рендерятся
(локальная разработка и превью остаются чистыми):

- `NEXT_PUBLIC_GA_ID` - GA4 measurement ID, формат `G-XXXXXXXXXX`
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager container ID, формат `GTM-XXXXXXX`

Обе переменные читаются на этапе сборки, поэтому после их изменения в Vercel нужен
редеплой. Форма заявки при успешной отправке шлёт событие `generate_lead`
в `dataLayer` и `gtag` с параметрами `service` и `source`.
