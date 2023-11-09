import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_NEW_API_KEY,
    "Access-Control-Allow-Origin": "*"
  };

  const statsDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_NEW_BASE_URL}/aggre/mainnet/stats`,
    {
      headers,
    }
  );

  return NextResponse.json(statsDataResponse.data);
}
