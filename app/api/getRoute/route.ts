import axios from "axios";
import { NextResponse } from "next/server";
import {findBestRoute} from "./core/search"
import {swap} from "./core/swap"
import contracts from "./constants/contracts"
export async function POST(request: Request) {
 
console.log("request",request)

const res = {};

const data = await request.json();

/*
const amountIn = data.amount;
const tokenIn = data.tokenIn;
const tokenOut = data.tokenOut;*/

const amountIn = "100000000000000000";

const tokenIn = {
  symbol: "WETH",
  address: "0x5300000000000000000000000000000000000004",
  decimals: 18
};
const tokenOut = {
  symbol: "USDC",
  address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
  decimals: 6
};

const fee = 0;
const slippage = 0.01;
const single = false;

console.log("data",data?.sign)


const result = await findBestRoute(contracts, single, tokenIn, tokenOut, amountIn, fee, slippage);

console.log("result",result)
  return NextResponse.json(res);
}
