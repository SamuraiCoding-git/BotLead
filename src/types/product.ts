import type { ScoreKey } from "./test";

export type Product = {
  key: ScoreKey;
  title: string;
  /** 3-5 short bullet points describing what's inside the protocol. */
  bullets: string[];
  discountPrice: number;
  fullPrice: number;
  discountUrl: string;
  fullUrl: string;
  currency: string;
};

export type ProductMap = Record<ScoreKey, Product>;
