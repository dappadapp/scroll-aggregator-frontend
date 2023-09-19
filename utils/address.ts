import { Address, getAddress } from 'viem'

export const formatAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

export function validateAndParseAddress(address: string): Address {
  const checksummedAddress = getAddress(address)
  if (address !== checksummedAddress) {
    console.log('Address is not checksummed')
  }
  return checksummedAddress
}

export const toFixedValue = (value: string, decimals: number) => {
  const dotPos = value.indexOf('.');
  if( dotPos === -1 ) return value;

  return `${value.slice(0, dotPos + 1)}${value.slice(dotPos + 1, dotPos + 1 + decimals)}`;
};
