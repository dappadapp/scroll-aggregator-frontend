import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_NEW_API_KEY,
  };

  const statsDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_NEW_BASE_URL}/aggre/mainnet/stats`,
    {
      headers,
    }
  );

  return NextResponse.json(statsDataResponse.data);
}
