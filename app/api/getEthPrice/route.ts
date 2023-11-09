import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  try{
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    const statusDataResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`,
      {headers: headers}
    );
   
    return NextResponse.json(statusDataResponse.data);
  } catch (e) {
    console.log("error", e);
  }

  
}
