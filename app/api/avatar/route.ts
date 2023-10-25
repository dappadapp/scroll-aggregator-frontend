import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_NEW_API_KEY,
  };
  let wallet = formData.get("wallet");
  let fileData = formData.get("file");
  const newFormData = new FormData();
  newFormData.append("file", fileData!);
  console.log("newForm", newFormData);
  const statusDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_NEW_BASE_URL}/aggre/mainnet/avatar/${wallet}`,
    newFormData,
    {
      headers,
    }
  );

  return NextResponse.json(statusDataResponse.data);
}
