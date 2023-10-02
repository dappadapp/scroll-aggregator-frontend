import axios from "axios";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest) {
  const query = request.query;
  const { chain } = query;
  const response = await axios
    .get(`https://faucet.aggre.io/api/faucetAddress`, {
      params: {
        chain,
      },
    })
    .catch((e) => console.log("errorrrr", e));

  return NextResponse.json(response?.data);
}
