"use client";
import React, { useEffect, useState } from "react";
import Avvvatars from "avvvatars-react";
import { useAccount } from "wagmi";
import formatAddress from "@/utils/formatAddress";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { useBalance } from 'wagmi'
import useContract from "@/hooks/useContract";
import { ethers } from "ethers";
interface Token {
  balance: string;
  contractAddress: string;
  decimals: string;
  name: string;
  symbol: string;
  type: string;
}

interface TokenData extends Token {
  totalValueUSD: number;
}
interface LeaderboardResponse {
  wallets: number;
  data: any;
}

interface UserResponse {
  wallet: string;
  data: any;
}
const deadline = "October, 31, 2023, 03:40";

export default function LeaderBoard() {
  const { address } = useAccount();
  const [totalUsers, setTotalUsers] = React.useState<any>(0);
  const [leaderboard, setLeaderboard] = React.useState<any>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [user, setUser] = React.useState<any>([]);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const contractAddr = useContract();

  const [tokenData, setTokenData] = useState<TokenData[] | null>(null);
  const [totalUSDValue, setTotalUSDValue] = useState<number>(0);

  useEffect(() => {
    // Define the API URL to fetch token balances
    const apiUrl = 'https://blockscout.scroll.io/api?module=account&action=tokenlist&address=0xf11F67e9e019C6bEc24E3f51f5153dEBe7d2c93C';

    // Fetch data from the API
    axios.get(apiUrl)
      .then((response) => {
        setTokenData(response?.data?.result);
      })
      .catch((error) => {
        console.error('Error fetching token data:', error);
      });
  }, []);

  useEffect(() => {

    const symbolMappings: Record<string, string> = {

      'WBTC': 'wrapped-bitcoin',
      'WETH': 'weth',
      'PUNK': 'punkswap',
      // Add more mappings as needed
    };
    // Function to fetch token prices from CoinGecko

    const fetchTokenPrices = async () => {
      if (!tokenData) return;

      const tokenSymbols = tokenData.map((token) => {
        return symbolMappings[token.symbol] || token.symbol; // Use the mapping if available, otherwise use the original symbol
      });

      const tokenPrices: Record<string, number> = {};

      for (const symbol of tokenSymbols) {
        try {
          const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`);
          tokenPrices[symbol] = response.data[symbol.toLowerCase()].usd;
        } catch (error) {
          console.error(`Error fetching ${symbol} price:`, error);
        }
      }
      return tokenPrices;
    };
    // Calculate the total USD value
    fetchTokenPrices().then((tokenPrices) => {
      console.log("tokenPrices", tokenPrices);
      if (!tokenData) return;
      if (!tokenPrices) return;

      let totalValueUSD = 0;

      tokenData.forEach((token) => {
        const price = tokenPrices[symbolMappings[token.symbol] || token.symbol] || 1; // Use 0 if price data is not available
        const balanceInUSD = Number(ethers.utils.formatUnits(token.balance, parseInt(token.decimals, 10))) * price;
        totalValueUSD += balanceInUSD;
      });

      setTotalUSDValue(totalValueUSD);
    });
  }, [tokenData]);

  const itemsPerPage = 10; // Set the number of items per page
  // Calculate the total number of pages based on the totalUsers and itemsPerPage
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Handle pagination changes
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    getLeaderboard(page);
  };

  useEffect(() => {
    getTime();
    getSingleUser();
    getLeaderboard(1);
  }, []);

  const getLeaderboard = async (page: any) => {
    try {
      const response = await axios.post<LeaderboardResponse>("/api/getLeaderboard", {
        pagination: itemsPerPage,
        page: page,
      });
      const total = response.data;

      console.log("total", total);
      if (total) {
        setTotalUsers(total?.wallets);
        setLeaderboard(total?.data);
      }
    } catch (error) {
      // Handle errors
    }
  };

  const getSingleUser = async () => {
    if (!address) return;
    try {
      const response = await axios.post<UserResponse>("/api/getSingleUser", {
        wallet: address,
      });

      if (response) {
        setUser(response.data);
      }
    } catch (error) {
      // Handle errors
    }
  };

  function renderPaginationButton(page: any, onClick: any) {
    const isActive = page === currentPage;
    return (
      <button
        key={page}
        onClick={onClick}
        className={`mx-1 focus:outline-none ${isActive
            ? "bg-[#ff7c5c] text-[white] shadow-lg hover:shadow-xl"
            : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out"
          } rounded-full flex justify-center items-center w-10 h-10 text-sm`}
      >
        {page}
      </button>
    );
  }
  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
  };
  // Show a fixed number of pages
  const maxVisiblePages = 9;

  // Calculate the range of pages to display
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  return (
    <div className="flex w-full flex-col gap-5 mt-[25px] lg:mt-12 mb-10">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-center border p-12 py-20 border-white border-opacity-5 bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[48px]">
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-3">
            <span className="text-[#FFF0DD] text-5xl lg:text-5xl mr-5">Leaderboard</span>
          </div>
          <span className="text-[#FFF0DD]/90 break-words mt-4">
            Get rewarded with a portion of our monthly revenue share.{" "}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Avvvatars
            value={address ? formatAddress(address) : ""}
            style="shape"
            size={80}
          />
          <div className="flex flex-col text-lg text-[#FFF0DD]">
            <span className="font-semibold text-grey-cool-500 text-grey-cool-500 text-lg lg:text-3xl">
              Your Ranking:
            </span>

            <div className="flex items-center mt-1 gap-3">
              <div className="bg-[#ff7c5c] text-[#FFF0DD] rounded-md w-10 h-10 justify-center items-center flex text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                {user?.sortIndex || "-"}
              </div>
              <span className="text-[#858585] text-2xl mt-1">/ {totalUsers}+</span>
              <FontAwesomeIcon
                icon={faSync}
                className={`text-[#888888] hover:cursor-pointer items-center ${isRefreshing ? "refreshing" : ""
                  }`}
              // onClick={() => refreshData()}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-full flex flex-col gap-1 lg:gap-2 justify-between items-center border p-5 lg:p-12  border-white border-opacity-5 bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[48px]">
          <span className="md:text-5xl text-[#FFF0DD]">Total Reward</span>
          <span className="text-center text-[#ff7c5c]  md:text-3xl font-bold mt-2">{totalUSDValue?.toFixed(2)} USD</span>
        </div>
        <div className="w-full flex gap-3 flex-col lg:gap-2 justify-center items-center border p-5 lg:p-12  border-white border-opacity-5 bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[48px]">
          <span className=" md:text-5xl text-[#FFF0DD]">Epoch #1</span>
          <div className="text-center text-[#ff7c5c]  md:text-3xl font-bold mt-2">
            {days >= 10 ? Number(days) : "0" + days} days{" "}
            {hours >= 10 ? hours : "0" + hours} hours{" "}
            {minutes > 10 ? minutes : "0" + minutes} minutes
          </div>
        </div>
      </div>
      <table className="overflow-y-scroll border-separate border-spacing-y-1 text-xl md:text-base w-full">
        <tbody className="overflow-y-scroll block table-fixed w-full mx-auto h-[auto]">
          <tr className="bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[48px] w-[80%] text-[#FFF0DD] ">
            <td className="overflow-hidden w-[20%] whitespace-nowrap pl-2 py-3"></td>
            <td className="overflow-hidden w-[40%] whitespace-nowrap pl-2 py-3">
              Address
            </td>
            <td className="w-[40.6%] py-3">Volume</td>
            <td className=" table-cell w-[40.6%] pr-4 py-3">Transactions</td>
          </tr>
          {leaderboard?.map((item: any, index: number) => (
            <tr
              key={item.user}
              className={`pt-4  w-[80%] shadow-inner rounded-lg ${item?.user.toLowerCase() === address?.toString().toLowerCase()
                  ? "bg-[#ff7c5c] text-[#000]"
                  : "text-[#AAA]"
                }`}
            >
              <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
                <span
                  className={`rounded-full py-1 px-3 ${item?.index === 1
                      ? "bg-[#FFAD0E]"
                      : item?.index === 2
                        ? "bg-[#AD5707]"
                        : item?.index === 3
                          ? "bg-[#939393]"
                          : item?.index === 4
                            ? "bg-gray-600"
                            : "bg-gray-800"
                    } text-[#FFF0DD]`}
                >
                  {item?.index}
                </span>
              </td>
              <td className="table-cell w-[40.6%] flex items-center">
                <div className="flex items-center">
                  <Avvvatars value={item?.user} style="shape" />
                  <span className="whitespace-nowrap ml-3">
                    {formatAddress(item.user)}
                  </span>
                </div>
              </td>
              <td className="lg:text-base table-cell w-[40%]">
                {item?.amount.toFixed()} USD
              </td>
              <td className=" pr-2 w-[40%] text-right rounded-r-lg lg:text-base pr-4">
                {item?.count} TX
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center">
        <button
          onClick={() => handlePageChange(1)}
          className={`mx-1 focus:outline-none ${currentPage === 1
              ? "bg-[#ff7c5c] text-[#FFF0DD] shadow-lg hover:shadow-xl"
              : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out"
            } rounded-full px-2 py-1 text-sm`}
        >
          First
        </button>

        {startPage > 1 && (
          <button
            onClick={() => handlePageChange(startPage - 1)}
            className={`mx-1 focus:outline-none bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out rounded-full w-10 h-10 justify-center items-center text-sm`}
          >
            ...
          </button>
        )}

        {pageNumbers
          .slice(startPage, endPage + 1)
          .map((page) => renderPaginationButton(page, () => handlePageChange(page)))}

        {endPage < totalPages && (
          <button
            onClick={() => handlePageChange(endPage + 1)}
            className={`mx-1 focus:outline-none bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out rounded-full w-10 h-10 justify-center items-center text-sm`}
          >
            ...
          </button>
        )}

        <button
          onClick={() => handlePageChange(totalPages)}
          className={`mx-1 focus:outline-none ${currentPage === totalPages
              ? "bg-[#ff7c5c] text-[#FFF0DD] shadow-lg hover:shadow-xl"
              : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out"
            } rounded-full px-2 py-1 text-sm`}
        >
          Last
        </button>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
