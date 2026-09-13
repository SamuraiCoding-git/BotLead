# Soul Test — Telegram Mini App

Психологический self-reflection тест (12 вопросов) → результат → продажа практического протокола (990 ₽, 48-часовое окно) через Lava.top.

## Запуск

```bash
npm install
npm run dev
```

Откроется на `http://localhost:5173`. Приложение полностью рабочее и в обычном браузере — Telegram WebApp API используется опционально (см. `src/lib/telegram.ts`).

Для production-сборки:

```bash
npm run build
npm run preview
```

Собранный `dist/` можно захостить на любом статическом хостинге (Netlify, Vercel, GitHub Pages, Cloudflare Pages) и подключить как Telegram Mini App через BotFather.

## Структура

```
src/
  components/   — экраны: Onboarding, Question, Progress, Calculating, Result, Offer, Timer
  data/         — testData.ts (вопросы), results.ts (контент результатов), products.ts (цены/ссылки Lava.top)
  lib/          — scoring.ts, storage.ts, timer.ts, telegram.ts
  types/        — test.ts, product.ts, app.ts
  App.tsx       — явная state machine, связывающая все экраны
```

## Куда смотреть, если нужно поменять цену или ссылку Lava.top

`src/data/products.ts` — единственное место с URL и ценами. Компоненты никогда не хардкодят ссылки.

## Куда смотреть, если нужно отредактировать вопросы или тексты результатов

`src/data/testData.ts` и `src/data/results.ts`.
