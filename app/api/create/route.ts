import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const response = await axios
    .post(
      `${process.env.NEXT_PUBLIC_API_URL}/aggre/mainnet/create`,
      {
        timestamp: Math.floor(Date.now() / 1000),
        userWalletAddress: data.wallet,
        txHash: data.txHash,
        fromTokenAddress: data.fromTokenAddress,
        toTokenAddress: data.toTokenAddress,
        fromAmount: data.fromAmount,
        toAmount: data.toAmount,
        chainId: data.chainId,
        sourceDex: data.sourceDex,
        dexType: data.dexType,
      },
      {
        headers: {
          "x-api-key": "f30fka0bv3jskfffzettta",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
    .catch((e) => console.log("errorrrr", e));

  return NextResponse.json(response?.data);
}
