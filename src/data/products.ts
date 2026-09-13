import type { ProductMap } from "../types/product";

/**
 * Single source of truth for pricing and Lava.top links.
 * Never hardcode a URL or price inside a UI component — read it from here.
 */
export const products: ProductMap = {
  A: {
    key: "A",
    title: "Протокол выхода из сценария «Отвергнутый»",
    bullets: [
      "Как замечать момент, когда вы уже начали отдаляться",
      "Практика постепенного повышения видимости — без резких скачков",
      "Работа с мыслью «меня всё равно отвергнут»",
      "Короткие ежедневные упражнения на 3–7 минут"
    ],
    discountPrice: 990,
    fullPrice: 2490,
    discountUrl: "https://lava.top/custom-link-a-990",
    fullUrl: "https://lava.top/custom-link-a-2490",
    currency: "₽"
  },
  B: {
    key: "B",
    title: "Протокол выхода из сценария «Покинутый»",
    bullets: [
      "Как отличать реальный сигнал от тревожной интерпретации",
      "Практика выдерживания паузы и расстояния без паники",
      "Работа с внутренним «а вдруг меня оставят»",
      "Короткие ежедневные упражнения на 3–7 минут"
    ],
    discountPrice: 990,
    fullPrice: 2490,
    discountUrl: "https://lava.top/custom-link-b-990",
    fullUrl: "https://lava.top/custom-link-b-2490",
    currency: "₽"
  },
  C: {
    key: "C",
    title: "Протокол выхода из сценария «Униженный»",
    bullets: [
      "Как замечать момент, когда помощь становится самопожертвованием",
      "Практика называть свою цену и просить о справедливом обмене",
      "Работа с убеждением «ценность нужно заслужить страданием»",
      "Короткие ежедневные упражнения на 3–7 минут"
    ],
    discountPrice: 990,
    fullPrice: 2490,
    discountUrl: "https://lava.top/custom-link-c-990",
    fullUrl: "https://lava.top/custom-link-c-2490",
    currency: "₽"
  },
  D: {
    key: "D",
    title: "Протокол выхода из сценария «Преданный»",
    bullets: [
      "Как дозированно передавать контроль без чувства риска",
      "Практика проверенного, постепенного доверия",
      "Работа с установкой «довериться — значит снова пострадать»",
      "Короткие ежедневные упражнения на 3–7 минут"
    ],
    discountPrice: 990,
    fullPrice: 2490,
    discountUrl: "https://lava.top/custom-link-d-990",
    fullUrl: "https://lava.top/custom-link-d-2490",
    currency: "₽"
  },
  E: {
    key: "E",
    title: "Протокол выхода из сценария «Несправедливость»",
    bullets: [
      "Как снижать внутреннюю планку без потери качества",
      "Практика «достаточно хорошо» вместо «идеально»",
      "Работа с внутренним критиком и страхом ошибки",
      "Короткие ежедневные упражнения на 3–7 минут"
    ],
    discountPrice: 990,
    fullPrice: 2490,
    discountUrl: "https://lava.top/custom-link-e-990",
    fullUrl: "https://lava.top/custom-link-e-2490",
    currency: "₽"
  }
};

/**
 * Whether completing the test again (restart) is allowed to grant a fresh
 * 48-hour discount window. Kept as an explicit, easy-to-flip config flag
 * per the product requirement that a simple restart should not, by default,
 * refresh the discount indefinitely.
 */
export const RESTART_REFRESHES_OFFER_DEADLINE = false;

export const OFFER_WINDOW_MS = 48 * 60 * 60 * 1000;
