import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("chainchain", request.nextUrl.searchParams);
  const response = await axios
    .get(`https://faucet.aggre.io/api/faucetAddress`, {
      params: {
        chain: request.nextUrl.searchParams.get("chain"),
      },
    })
    .catch((e) => console.log("errorrrr", e));

  return NextResponse.json(response?.data);
}
