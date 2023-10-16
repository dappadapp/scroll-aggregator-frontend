function num2Hex(n: number) {
    if (n < 10) {
        return String(n);
    }
    const str = 'ABCDEF';
    return str[n - 10];
}

function fee2Hex(fee: number) {
    const n0 = fee % 16;
    const n1 = Math.floor(fee/16) % 16;
    const n2 = Math.floor(fee/256) % 16;
    const n3 = Math.floor(fee/4096) % 16;
    const n4 = 0;
    const n5 = 0;
    return '0x' + num2Hex(n5) + num2Hex(n4) + num2Hex(n3) + num2Hex(n2) + num2Hex(n1) + num2Hex(n0);
}

function appendHex(hexString: string, newHexString: string) {
    return hexString + newHexString.slice(2);
}

export const generatePath = (token1: string, token2: string, fee: number) => {
    const token1Addr = (token1).toLowerCase();
    const token2Addr = (token2).toLowerCase();
    let hexString = appendHex(token1Addr, fee2Hex(fee));
    hexString = appendHex(hexString, token2Addr);
    return hexString;
}