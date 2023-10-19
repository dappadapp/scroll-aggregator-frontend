import { Currency } from "@/types";

export function CurrencyLogo({
  currency,
  size = 6,
  style,
}: {
  currency?: Currency;
  size?: number;
  style?: React.CSSProperties;
}) {
  return currency?.logo ? (
    <img
      src={currency?.logo}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
      className={`rounded-full  w-${size} h-${size}`}
    />
  ) : (
    <div className={`bg-white/10 rounded-full w-${size} h-${size}`} />
  );
}
