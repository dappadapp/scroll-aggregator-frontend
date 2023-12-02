import { Address, getAddress } from 'viem'

export const formatAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

export function validateAndParseAddress(address: string): Address {
  const checksummedAddress = getAddress(address)
  if (address !== checksummedAddress) {
    // console.log('Address is not checksummed')
  }
  return checksummedAddress
}

export const toFixedValue = (value: string, decimals: number) => {
  const dotPos = value.indexOf('.');
  if( dotPos === -1 ) return value;

  return `${value.slice(0, dotPos + 1)}${value.slice(dotPos + 1, dotPos + 1 + decimals)}`;
};

export function parseUnits(value:string, decimals:number) {
  let [integer, fraction = '0'] = value.split('.')

  const negative = integer.startsWith('-')
  if (negative) integer = integer.slice(1)

  fraction = fraction.replace(/(0+)$/, '')

  if (decimals === 0) {
      if (Math.round(Number(`.${fraction}`)) === 1)
          integer = `${BigInt(integer) + 1n}`
      fraction = ''
  } else if (fraction.length > decimals) {
      const [left, unit, right] = [
          fraction.slice(0, decimals - 1),
          fraction.slice(decimals - 1, decimals),
          fraction.slice(decimals),
      ]

      const rounded = Math.round(Number(`${unit}.${right}`))
      if (rounded > 9)
          fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, '0')
      else fraction = `${left}${rounded}`

      if (fraction.length > decimals) {
          fraction = fraction.slice(1)
          integer = `${BigInt(integer) + 1n}`
      }

      fraction = fraction.slice(0, decimals)
  } else {
      fraction = fraction.padEnd(decimals, '0')
  }

  return BigInt(`${negative ? '-' : ''}${integer}${fraction}`)
}
