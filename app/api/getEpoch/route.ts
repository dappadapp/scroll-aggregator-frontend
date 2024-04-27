import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_NEW_API_KEY,
  };

  const statusDataResponse = null;
  /*
  await axios.get(
    `${process.env.NEXT_PUBLIC_NEW_BASE_URL}/aggre/mainnet/phases`,
    {
      headers,
    }
  );*/

  return NextResponse.json(statusDataResponse);
}
