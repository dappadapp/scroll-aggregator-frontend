import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_AGGRE_API_KEY,
  };

  try {
    const statusDataResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_AGGRE_API_URL}/swap`,
      {
        amountIn: data?.amountIn,
        single: data?.single,
        fee: data?.fee,
        slippage: data?.slippage,
        tokenIn: data?.tokenIn,
        tokenOut: data?.tokenOut,
      },
      {
        headers,
      }
    );
  
    // Handle the response here if needed
    return NextResponse.json(statusDataResponse.data);
  
  } catch (error) {
    // Handle the error here
    console.error("Error during swap request:", error);
  }

 
}
