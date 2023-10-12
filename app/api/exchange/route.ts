import axios from "axios";
import { NextResponse } from "next/server";
import { parseUnits } from "@/utils/address";
import SpaceFiAbi from "@/constants/abis/spacefi.json";
import IziSwapQuoterAbi from "@/constants/abis/iziSwapQuoter.json";
import Web3 from "web3";
import { ethers } from "ethers";
import quoter2 from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";
import quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { generatePath } from "@/utils/path";
import { usePublicClient } from "wagmi";

interface Dex {
  name: string;
  id: string;
  router: string;
  abi: any; // Replace with the actual ABI type
  fee: number;
  inFunction: string;
  outFunction: string;
  runInFunction: (amount: any, from: any, to: any) => Promise<any>;
  runOutFunction: (amount: any, from: any, to: any) => Promise<any>;
}
export async function POST(request: Request) {
  const network = "https://sepolia-rpc.scroll.io/";
  const client = new Web3(network);

  const provider = new ethers.providers.JsonRpcProvider(network);

  const data = await request.json();

  const dexs: Record<string, Dex> = {
    spacefi: {
      name: "Space Fi",
      id: "space-fi",
      router: "0xF4EE7c4bDd43F6b5E509204B375E9512e4110C15",
      abi: SpaceFiAbi, // Replace with the actual ABI
      fee: 0,
      inFunction: "getAmountsIn",
      outFunction: "getAmountsOut",
      async runInFunction(amount: any, from: any, to: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        const data = await contract.getAmountsIn(parseUnits(amount, 18), [from, to]);
        return BigInt(data?.[0]);
      },
      async runOutFunction(amount: any, from: any, to: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        const data = await contract.getAmountsOut(parseUnits(amount, 18), [from, to]);
        return BigInt(data?.[1]);
      },
    },
    uniswap: {
      name: "Uniswap",
      id: "uniswap",
      router: "0xd5dd33650Ef1DC6D23069aEDC8EAE87b0D3619B2",
      abi: quoter.abi, // Replace with the actual ABI
      fee: 3000,
      inFunction: "quoteExactInputSingle",
      outFunction: "quoteExactOutputSingle",
      async runOutFunction(amount: any, from: any, to: any) {
        const contract = new ethers.Contract(
          "0xd5dd33650Ef1DC6D23069aEDC8EAE87b0D3619B2",
          quoter2.abi,
          provider
        );
        const params = [from, to, parseUnits(amount, 18), this.fee, 0];

        const res = await contract.callStatic.quoteExactInputSingle(params);

        return BigInt(res.amountOut);
      },
      async runInFunction(amount: any, from: any, to: any) {
        const contract = new ethers.Contract(
          "0xd5dd33650Ef1DC6D23069aEDC8EAE87b0D3619B2",
          quoter2.abi,
          provider
        );
        const params = [from, to, parseUnits(amount, 18), this.fee, 0];
        const data = await contract.callStatic.quoteExactOutputSingle(params);

        return BigInt(data.amountIn);
      },
    },
    iziswap: {
      name: "Iziswap",
      id: "iziswap",
      router: "0xa9754f0D9055d14EB0D2d196E4C51d8B2Ee6f4d3",
      abi: IziSwapQuoterAbi,
      fee: 3000,
      inFunction: "swapDesire",
      outFunction: "swapAmount",
      async runInFunction(amount: any, from: any, to: any) {
        const contract = new ethers.Contract(
          this.router,
          IziSwapQuoterAbi,
          provider
        );

        const { cost, } = await contract.callStatic.swapDesire(parseUnits(amount, 18), generatePath(from, to, this.fee));
        return BigInt(cost);
      },
      async runOutFunction(amount: any, from: any, to: any) {
        const contract = new ethers.Contract(
          this.router,
          IziSwapQuoterAbi,
          provider
        );
        
        const { acquire, } = await contract.callStatic.swapAmount(parseUnits(amount, 18), generatePath(from, to, this.fee));
        return BigInt(acquire);
      },
    },
  };

  async function getBestExchange(amount: any, from: any, to: any, type: string) {
    const temp = [];
    for (const dex in dexs) {
      try {
        const dexData = dexs[dex as keyof typeof dexs];
        if (type === "OUT") {
          const inAmount = await dexData.runInFunction(amount, from, to);
          temp.push({
            dex: dexData.id,
            amount: inAmount.toString(),
          });
        }
        if (type === "IN") {
          const outAmount = await dexData.runOutFunction(amount, from, to);
          temp.push({
            dex: dexData.id,
            amount: outAmount.toString(),
          });
        }

        console.log("temp", temp);
      } catch (e) {
        console.log("error " + e);
      }
    }

    /*
                if type is IN,
                 sort by outAmount
                            GET BIGGER
    
                if type is OUT,
                    sort by inAmount
                            GET BIGGER
    
         */

                            if (type === "IN") {
                              temp.sort((a, b) => {
                                return a.amount < b.amount ? -1 : a.amount > b.amount ? 1 : 0;
                              });
                            } else if (type === "OUT") {
                              temp.sort((a, b) => {
                                return a.amount < b.amount ? 1 : a.amount > b.amount ? -1 : 0;
                              });
                            }
                            

    return temp[0];
  }

  const res = await getBestExchange(data?.amount, data?.from, data?.to, data?.type);

  console.log("res", res);

  return NextResponse.json(res);
}
