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
