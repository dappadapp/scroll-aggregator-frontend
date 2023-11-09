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
    logo
  }: {
    chainId: number
    decimals: number
    symbol: string
    name: string
    logo: string
  }) {
    super(chainId, decimals, symbol, name, logo)
  }

  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId as keyof typeof WNATIVE]
    return wnative
  }

  private static cache: { [chainId: number]: Native } = {}

  public static onChain(chainId: number): Native {

    console.log("chainId",chainId)
    if (chainId in this.cache) {
      return this.cache[chainId]
    }
   
    const { decimals, name, symbol, logo } = NATIVE[chainId as keyof typeof WNATIVE]

    return (this.cache[chainId] = new Native({ chainId, decimals, symbol, name, logo }))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
