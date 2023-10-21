import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const data = await request.json();
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_NEW_API_KEY,
      };      

  const statusDataResponse = await axios.get(`${process.env.NEXT_PUBLIC_NEW_BASE_URL}/dropbase/leaderboard?amount=${data?.pagination}&page=${data?.page}`, {
    headers,
  });


  return NextResponse.json(statusDataResponse.data);
}
