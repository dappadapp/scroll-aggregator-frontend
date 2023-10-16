import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = await axios
    .get(`https://faucet.aggre.io/api/getChainConfigs`)
    .catch((e) => console.log("errorrrr", e));

  return NextResponse.json(response?.data);
}
