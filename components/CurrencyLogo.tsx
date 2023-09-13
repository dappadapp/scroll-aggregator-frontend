import { useMemo } from "react";
import memoize from "lodash/memoize";
import { Currency, Token, ChainId } from "@/types";

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && token.chainId === ChainId.ETHEREUM) {
      return `https://tokens.pancakeswap.finance/images/aptos/${token.address}.png`; // hex encoding
    }
    return null;
  },
  (t) => (t ? `${t.chainId}#${t.address}` : null)
);

export function CurrencyLogo({
  currency,
  size = 6,
  style,
}: {
  currency?: Currency;
  size?: number;
  style?: React.CSSProperties;
}) {
  const srcUrl: string | null = useMemo(() => {
    if (currency?.isToken) {
      const tokenLogoURL = getTokenLogoURL(currency);

      if (!tokenLogoURL) return null;
      return tokenLogoURL;
    }
    return null;
  }, [currency]);

  return srcUrl ? (
    <img
      src={srcUrl}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
      className={`rounded-full w-${size} h-${size}`}
    />
  ) : (
    <div className={`bg-white/10 rounded-full w-${size} h-${size}`} />
  );
}
