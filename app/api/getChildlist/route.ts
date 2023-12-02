import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_AGGRE_API_KEY,
  };

  const statusDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_AGGRE_API_URL}/childlist`,
    {
      headers,
    }
  );

  return NextResponse.json(statusDataResponse.data);
}