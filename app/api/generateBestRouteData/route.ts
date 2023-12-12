import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_AGGRE_API_KEY,
  };
  const statusDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_AGGRE_API_URL}/generate`,
    {
      chainId: data.chainId, 
      single: data.single, 
      tokenInAddress: data.tokenInAddress, 
      tokenOutAddress: data.tokenOutAddress, 
      amountIn: data.amountIn, 
      fee: data.fee, 
      convertToNative: data.convertToNative,
      slippage: data.slippage, 
      deadline: data.deadline
    },
    {
      headers,
    }
  );

  return NextResponse.json(statusDataResponse.data);
}
