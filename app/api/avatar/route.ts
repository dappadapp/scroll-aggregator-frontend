import axios from "axios";
import { NextResponse } from "next/server";
export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(request: Request) {
  const data = await request.json();
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_NEW_API_KEY,
  };
  const statusDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_NEW_BASE_URL}/aggre/mainnet/avatar/${data.wallet}`,
    {
      image: data.image,
    },
    {
      headers,
    }
  );

  return NextResponse.json(statusDataResponse.data);
}
