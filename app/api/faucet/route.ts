import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const response = await axios
    .post(
      `https://faucet.aggre.io/api/sendToken`,
      {
        address: data.address,
        token: data.token,
        v2Token: data.v2Token,
        chain: data.chain,
        erc20: data.erc20,
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
