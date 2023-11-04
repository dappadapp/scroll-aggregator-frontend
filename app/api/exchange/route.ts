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
import SkydromeAbi from "@/constants/abis/skydrome.json";
import SyncswapAbi from "@/constants/abis/syncSwapQuote.json";
import SyncSwapClassicAbi from "@/constants/abis/SyncSwapClassicPool.json";
import SyncSwapStableAbi from "@/constants/abis/SyncSwapStablePool.json";
import PunkSwapAbi from "@/constants/abis/punkswap.json";
import KyberSwapQuteAbi from "@/constants/abis/KyberSwapQuote.json";
import CoffeSwapAbi from "@/constants/abis/coffeswapFactory.json";
import CoffeeRouter from "@/constants/abis/coffeeRouter.json";

interface Dex {
  name: string;
  id: string;
  router: string;
  abi: any; // Replace with the actual ABI type
  fee: number;
  inFunction: string;
  outFunction: string;
  runInFunction: (amount: any, from: any, to: any,fromDecimals:any,toDecimals:any) => Promise<any>;
  runOutFunction: (amount: any, from: any, to: any,fromDecimals:any,toDecimals:any) => Promise<any>;
}
export async function POST(request: Request) {
  const network = "https://rpc.scroll.io/";
  const client = new Web3(network);

  const provider = new ethers.providers.JsonRpcProvider(network);

  const data = await request.json();

  const dexs: Record<string, Dex> = {
    spacefi: {
      name: "Space Fi",
      id: "space-fi",
      router: "0x18b71386418A9FCa5Ae7165E31c385a5130011b6",
      abi: SpaceFiAbi, // Replace with the actual ABI
      fee: 0,
      inFunction: "getAmountsIn",
      outFunction: "getAmountsOut",
      async runInFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        const data = await contract.getAmountsIn(parseUnits(amount, toDecimals), [from, to]);
        return BigInt(data?.[0]);
      },
      async runOutFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        console.log("amount parse", parseUnits(amount, fromDecimals));
        const data = await contract.getAmountsOut(parseUnits(amount, fromDecimals), [from, to]);
        console.log("data", [from, to]);
        return BigInt(data?.[1]);
      },
    },
    skydrome: {
      name: "Skydrome",
      id: "skydrome",
      router: "0xAA111C62cDEEf205f70E6722D1E22274274ec12F",
      abi: SkydromeAbi, // Replace with the actual ABI
      fee: 3000,
      inFunction: "getAmountsOut",
      outFunction: "getAmountsOut",
      async runInFunction(amount: any, from: any, to: any,fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);

        const data = await contract.getAmountsOut(parseUnits(amount, toDecimals), [
          {
            from: from,
            to: to,
            stable: true
          }
        ]);
        return BigInt(data?.[0]);
      },
      async runOutFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {

        const contract = new ethers.Contract(this.router, this.abi, provider);
        console.log("amount parse", (parseUnits(amount, 18)));
        const data = await contract.getAmountsOut(parseUnits(amount, fromDecimals), [
          {
            from: from,
            to: to,
            stable: false
          }
        ]);
        console.log("data", BigInt(data?.[1]));
        console.log("data", BigInt(data?.[0]));
        return BigInt(data?.[1]);
      },
    },
    iziswap: {
      name: "Iziswap",
      id: "iziswap",
      router: "0x3EF68D3f7664b2805D4E88381b64868a56f88bC4",
      abi: IziSwapQuoterAbi,
      fee: 3000,
      inFunction: "swapDesire",
      outFunction: "swapAmount",
      async runInFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(
          this.router,
          IziSwapQuoterAbi,
          provider
        );

        const { cost, } = await contract.callStatic.swapDesire(parseUnits(amount, toDecimals), generatePath(from, to, this.fee));
        return BigInt(cost);
      },
      async runOutFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(
          this.router,
          IziSwapQuoterAbi,
          provider
        );

        const { acquire, } = await contract.callStatic.swapAmount(parseUnits(amount, fromDecimals), generatePath(from, to, this.fee));
        return BigInt(acquire);
      },
    },
    syncswap: {
      name: "Skycswap",
      id: "syncswap",
      router: "0x37BAc764494c8db4e54BDE72f6965beA9fa0AC2d",
      abi: SyncswapAbi, // Replace with the actual ABI
      fee: 0,
      inFunction: "getAmountOut",
      outFunction: "getAmountOut",
      async runInFunction(amount: any, from: any, to: any,fromDecimals: any, toDecimals: any) {


   
      },
      async runOutFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        if(from === "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df" && to === "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4" 
        || from === "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4" && to === "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df"){
        const contract = new ethers.Contract("0x2076d4632853FB165Cf7c7e7faD592DaC70f4fe1", SyncSwapStableAbi, provider);

        try {
          const data = await contract.getAmountOut(from,parseUnits(amount, toDecimals), "0x3D6a34D8ECe4640adFf2f38a5bD801E51B07e49C");
          console.log("data1", BigInt(data));
          return BigInt(data);
        }
        catch(e){
          console.log("error",e);
        }
   
      }
      else{
        const contract = new ethers.Contract(this.router, this.abi, provider);

        const data = await contract.getAmountOut(from,parseUnits(amount, toDecimals),"0x3D6a34D8ECe4640adFf2f38a5bD801E51B07e49C");
        console.log("data2", BigInt(data));
        return BigInt(data);
      }
      },
    },
    punkswap: {
      name: "Punkswap",
      id: "punkswap",
      router: "0x26cb8660eefcb2f7652e7796ed713c9fb8373f8e",
      abi: PunkSwapAbi, // Replace with the actual ABI
      fee: 0,
      inFunction: "getAmountsIn",
      outFunction: "getAmountsOut",
      async runInFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        const data = await contract.getAmountsIn(parseUnits(amount, toDecimals), [from, to]);
        return BigInt(data?.[0]);
      },
      async runOutFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        console.log("amount parse", parseUnits(amount, fromDecimals));
        const data = await contract.getAmountsOut(parseUnits(amount, fromDecimals), [from, to]);
        console.log("data", [from, to]);
        return BigInt(data?.[1]);
      },
    },
    kyberswap: {
      name: "Kyberswap",
      id: "kyberswap",
      router: "0x4d47fd5a29904Dae0Ef51b1c450C9750F15D7856",
      abi: KyberSwapQuteAbi, // Replace with the actual ABI
      fee: 300,
      inFunction: "quoteExactInputSingle",
      outFunction: "quoteExactOutputSingle",
      async runOutFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(
          this.router,
          this.abi,
          provider
        );
        const params = [from, to, parseUnits(amount, fromDecimals), this.fee, 0];

      

        const res = await contract.callStatic.quoteExactInputSingle(params);

        console.log("res", res);

        return BigInt(res.returnedAmount);
      },
      async runInFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(
          this.router,
          this.abi,
          provider
        );
        const params = [from, to, parseUnits(amount, toDecimals), this.fee, 0];
        const data = await contract.callStatic.quoteExactOutputSingle(params);

        return BigInt(data.amountIn);
      },
    },
    /*
    coffeswap: {
      name: "Coffeswap",
      id: "coffeswap",
      router: "0xdAF8b79B3C46db8bE754Fc5E98b620ee243eb279",
      abi: CoffeeRouter, // Replace with the actual ABI
      fee: 0,
      inFunction: "getAmountsIn",
      outFunction: "getAmountsOut",
      async runInFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        const data = await contract.getAmountsIn(parseUnits(amount, toDecimals), [from, to]);
        return BigInt(data?.[0]);
      },
      async runOutFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        console.log("amount parse", parseUnits(amount, fromDecimals));
        if(from === "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4" && to === "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df"){
          const data = await contract.getAmountsOut(parseUnits(amount, fromDecimals), [from, to,true]);
          console.log("data out", [from, to]);
          return BigInt(data?.[1]);
        }
        else{
          const data = await contract.getAmountsOut(parseUnits(amount, fromDecimals), [[from, to,false]]);
          console.log("data out", [from, to]);
          return BigInt(data?.[1]);
        }
  
      },
    },*/
    papyrusswap: {
      name: "Papyrusswap",
      id: "papyrusswap",
      router: "0x29ACA061b49753765A3DBC130DBF16D4477bFd3F",
      abi: SpaceFiAbi, // Replace with the actual ABI
      fee: 0,
      inFunction: "getAmountsIn",
      outFunction: "getAmountsOut",
      async runInFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        const data = await contract.getAmountsIn(parseUnits(amount, toDecimals), [from, to]);
        return BigInt(data?.[0]);
      },
      async runOutFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        console.log("amount parse", parseUnits(amount, fromDecimals));
        const data = await contract.getAmountsOut(parseUnits(amount, fromDecimals), [from, to]);
        console.log("data", [from, to]);
        return BigInt(data?.[1]);
      },
    },

    sushiswap: {
      name: "Sushiswap",
      id: "sushiswap",
      router: "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE",
      abi: SpaceFiAbi, // Replace with the actual ABI
      fee: 0,
      inFunction: "getAmountsIn",
      outFunction: "getAmountsOut",
      async runInFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        const data = await contract.getAmountsIn(parseUnits(amount, toDecimals), [from, to]);
        return BigInt(data?.[0]);
      },
      async runOutFunction(amount: any, from: any, to: any, fromDecimals: any, toDecimals: any) {
        const contract = new ethers.Contract(this.router, this.abi, provider);
        console.log("amount parse", parseUnits(amount, fromDecimals));
        try{
          const data = await contract.getAmountsOut(parseUnits(amount, fromDecimals), [from, to]);
          console.log("data", [from, to]);
          return BigInt(data?.[1]);
        }
        catch(e){
          console.log("error",e);
        }
      
      },
    },
  };

  async function getBestExchange(amount: any, from: any, to: any, type: string, fromDecimals: any, toDecimals: any) {
    const temp = [];
    for (const dex in dexs) {
      try {
        const dexData = dexs[dex as keyof typeof dexs];
        if (type === "OUT") {
          const inAmount = await dexData.runInFunction(amount, from, to, fromDecimals, toDecimals);
          temp.push({
            dex: dexData.id,
            amount: inAmount.toString(),
          });
        }
        if (type === "IN") {
          const outAmount = await dexData.runOutFunction(amount, from, to, fromDecimals, toDecimals);
          temp.push({
            dex: dexData.id,
            amount: outAmount.toString(),
          });
        }

        console.log("temp", temp);
      } catch (e) {
        console.log("error "+dex + e);
      }
    }
    temp.sort((a, b) => parseInt(b.amount) - parseInt(a.amount));
    return temp;
  }

  const res = await getBestExchange(data?.amount, data?.from, data?.to, data?.type, data?.fromDecimals, data?.toDecimals);

  console.log("res", res);

  return NextResponse.json(res);
}
