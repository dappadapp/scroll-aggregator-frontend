import { Currency } from '@/types/token/currency'
import { Token } from '@/types/token/token'
import { NativeCurrency } from '@/types/token/nativeCurrency'
import { WNATIVE, NATIVE } from '@/constants/tokens/common'

/**
 *
 * Native is the main usage of a 'native' currency, i.e. for BSC mainnet and all testnets
 */
export class Native extends NativeCurrency {
  protected constructor({
    chainId,
    decimals,
    name,
    symbol,
  }: {
    chainId: number
    decimals: number
    symbol: string
    name: string
  }) {
    super(chainId, decimals, symbol, name)
  }

  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId as keyof typeof WNATIVE]
    return wnative
  }

  private static cache: { [chainId: number]: Native } = {}

  public static onChain(chainId: number): Native {
    if (chainId in this.cache) {
      return this.cache[chainId]
    }
    const { decimals, name, symbol } = NATIVE[chainId as keyof typeof WNATIVE]
    // eslint-disable-next-line no-return-assign
    return (this.cache[chainId] = new Native({ chainId, decimals, symbol, name }))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
