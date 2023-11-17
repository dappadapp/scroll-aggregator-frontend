"use client";
import React, { useEffect, useState } from "react";
import Avvvatars from "avvvatars-react";
import { useAccount } from "wagmi";
import formatAddress from "@/utils/formatAddress";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { useBalance } from "wagmi";
import useContract from "@/hooks/useContract";
import { ethers } from "ethers";
import Loading from "@/assets/images/loading.svg";
import Button from "@/components/Button";
import Image from "next/image";

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
const deadline = "November, 16, 2023, 23:25";

const PHASES = [1, 2, 3];

export default function LeaderBoard() {
  const { address } = useAccount();
  const [totalUsers, setTotalUsers] = React.useState<any>(0);
  const [leaderboard, setLeaderboard] = React.useState<any>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(2);
  const [user, setUser] = React.useState<any>([]);
  const [file, setFile] = React.useState<any>();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [tokenData, setTokenData] = useState<TokenData[] | null>(null);
  const [totalUSDValue, setTotalUSDValue] = useState<number>(0);
  const [epochData, setEpochData] = useState<any>();

  useEffect(() => {
    // Define the API URL to fetch token balances
    const apiUrl =
      "https://blockscout.scroll.io/api?module=account&action=tokenlist&address=0xf11F67e9e019C6bEc24E3f51f5153dEBe7d2c93C";

    // Fetch data from the API
    axios
      .get(apiUrl)
      .then((response) => {
        setTokenData(response?.data?.result);
      })
      .catch((error) => {
        console.error("Error fetching token data:", error);
      });
  }, []);

  useEffect(() => {
    const symbolMappings: Record<string, string> = {
      WBTC: "wrapped-bitcoin",
      WETH: "weth",
      PUNK: "punkswap",
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
          const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`
          );
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
        const balanceInUSD =
          Number(ethers.utils.formatUnits(token.balance, parseInt(token.decimals, 10))) *
          price;
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
    setLoading(true);
    getSingleUser();
    getEpochData();
    setCurrentPage(1);
    getLeaderboard(1).finally(() => setLoading(false));
  }, [selectedPhase]);

  useEffect(() => {
    const interval = setInterval(() => {
      getTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!epochData) return;
    getTime();
  }, [epochData]);

  const getLeaderboard = async (page: any) => {
    try {
      const response = await axios.post<LeaderboardResponse>("/api/getLeaderboard", {
        pagination: itemsPerPage,
        page: page,
        phase: selectedPhase,
      });
      const total = response.data;

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

  const getEpochData = async () => {
    try {
      const response = await axios.get("/api/getEpoch");
      var result = Object.entries(response.data);
      setEpochData(result);
    } catch (error) {
      // Handle errors
    }
  };

  const handleJoin = async () => {
    if (!address) return;
    try {
      const response = await axios.post("/api/join", {
        wallet: address,
      });

      if (response) {
        toast(
          "Congratulations! You're now in the running to win amazing prizes in our draw. Best of luck, and thank you for joining!",
          { autoClose: 10000 }
        );
        return;
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
        className={`mx-1 focus:outline-none ${
          isActive
            ? "bg-[#ff7c5c] text-[white] shadow-lg hover:shadow-xl"
            : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out"
        } rounded-full flex justify-center items-center w-10 h-10 text-sm`}
      >
        {page}
      </button>
    );
  }
  const getTime = () => {
    const epochEndDate = new Date(epochData[epochData.length - 1][1].end * 1000);
    const time = Date.parse(epochEndDate.toString()) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
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
          <span className="text-[#FFF0DD] break-words mt-4 gap-4">
            Explore our loyalty dashboard designed exclusively for our aggregator,
            {<br></br>} offering decentralized weekly revenue sharing with automatic
            distribution of earnings.{" "}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {address && user?.leaderboard?.index && (
            <input
              type="file"
              onChange={async (e) => {
                if (!e.target.files) return;
                e.preventDefault();
                var reader = new FileReader();
                reader.readAsDataURL(e.target.files![0]);
                reader.onload = async function () {
                  const response = await axios.post("/api/avatar", {
                    wallet: address,
                    image: reader.result,
                  });
                  if (response.status === 200) {
                    setFile(reader.result);
                  }
                };
                reader.onerror = function (error) {
                  console.log("Error: ", error);
                };
              }}
              id="upload"
              accept="image/*"
              style={{ display: "none" }}
            />
          )}
          <label
            htmlFor="upload"
            className="hover:scale-125 transition-all cursor-pointer"
          >
            {!user?.avatar ? (
              <Avvvatars
                value={address ? formatAddress(address) : ""}
                style="shape"
                size={80}
              />
            ) : (
              <Image
                src={file ? file : user?.avatar}
                alt="user-avatar"
                width={80}
                height={80}
                className="rounded-full w-20 h-20"
              />
            )}
          </label>
          <div className="flex flex-col text-lg text-[#FFF0DD]">
            <span className="font-semibold text-grey-cool-500 text-grey-cool-500 text-lg lg:text-3xl">
              Your Ranking:
            </span>

            <div className="flex items-center mt-1 gap-3">
              <div className="bg-[#ff7c5c] text-[#FFF0DD] rounded-md w-10 h-10 justify-center items-center flex text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                {user?.leaderboard?.index || "-"}
              </div>
              <span className="text-[#858585] text-2xl mt-1">/ {totalUsers}+</span>
              <FontAwesomeIcon
                icon={faSync}
                className={`text-[#888888] hover:cursor-pointer items-center ${
                  isRefreshing ? "refreshing" : ""
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
          <span className="text-center text-[#ff7c5c]  md:text-3xl font-bold mt-2">
            {totalUSDValue?.toFixed(2)} USD
          </span>
        </div>
        <div className="w-full flex gap-3 flex-col lg:gap-2 justify-center items-center border p-5 lg:p-12  border-white border-opacity-5 bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[48px]">
          <span className=" md:text-5xl text-[#FFF0DD]">
            Epoch #{epochData && epochData[epochData?.length - 1][0]}
          </span>
          <div className="text-center text-[#ff7c5c]  text-sm lg:text-2xl font-bold mt-2">
            {days >= 10 ? Number(days) : "0" + days} days{" : "}
            {hours >= 10 ? hours : "0" + hours} hours{" : "}
            {minutes >= 10 ? minutes : "0" + minutes} minutes{<br></br>}
            {seconds > 10 ? seconds : "0" + seconds} seconds
          </div>
        </div>
      </div>
      <div className="flex w-full justify-start gap-8">
        {PHASES.map((phase) => (
          <button
            key={"phase" + phase}
            onClick={() => {
              setSelectedPhase(phase);
            }}
            className={` transition-all border-none flex justify-center bg-[#ff7c5c] items-center p-4 text-xl lg:text-4xl text-[#FFF0DD] ${
              selectedPhase === phase ? "bg-opacity-50 rounded-2xl" : "bg-opacity-0 "
            }`}
          >
            Epoch {phase}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center text-white items-center h-[300px] w-full">
          <Loading />
        </div>
      ) : (
        <table className="overflow-y-scroll border-separate border-spacing-y-1 lg:text-xl text-xs w-full">
          <tbody className="overflow-y-scroll block table-fixed w-full mx-auto h-[auto]">
            <tr className="bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[48px] w-[80%] text-[#FFF0DD] ">
              <td className="overflow-hidden w-[13.5%] whitespace-nowrap pl-2 py-3"></td>
              <td className="overflow-hidden w-[18.5%] whitespace-nowrap pl-2 py-3">
                Address
              </td>
              <td className="w-[23.5%] hidden lg:table-cell py-3">Volume</td>
              <td className=" table-cell w-[13.5%] lg: py-3">Transactions</td>
              <td className=" table-cell w-[28.5%] py-3">Loyalty Points</td>
              <td className=" table-cell w-[13.5%] pr-2 py-3 pl-2">Status</td>
            </tr>
            {leaderboard?.map((item: any, index: number) => (
              <tr
                key={item.user}
                className={`pt-4  w-[80%] shadow-inner rounded-lg ${
                  item?.user.toLowerCase() === address?.toString().toLowerCase()
                    ? "bg-[#ff7c5c] text-[#000]"
                    : "text-[#AAA]"
                }`}
              >
                <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
                  <span
                    className={`rounded-full py-1 px-3 ${
                      item?.index === 1
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
                <td className="table-cell w-[21.74%] flex items-center">
                  <div className="flex items-center">
                    <Avvvatars value={item?.user} style="shape" />
                    <span className="whitespace-nowrap ml-3">
                      {formatAddress(item.user)}
                    </span>
                  </div>
                </td>
                <td className="lg:text-base hidden lg:table-cell w-[21.74%]">
                  {item?.amount.toFixed()} USD
                </td>
                <td className="lg:text-base table-cell lg:text-left text-center w-[21.74%]">
                  {item?.count || 0} TX
                </td>
                <td className="lg:text-base table-cell w-[21.74%]">
                  {item?.loyalty.toFixed(2) || 0} P
                </td>
                <td className="w-[40%] text-right rounded-r-lg lg:text-base pr-2">
                  {item?.joined ? (
                    <span className=" text-[#fff]">Joined</span>
                  ) : (
                    <span
                      className={`text-[#fff] lg:w-32`}
                      // onClick={() => {
                      //   handleJoin();
                      // }}
                    >
                      Joinable
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {user?.leaderboard?.index &&
            user?.leaderboard?.index > 10 &&
            !leaderboard.some((item: any) => item?.user === user?.leaderboard?.user) ? (
              <>
                <div className="w-full text-center flex justify-center text-[#fff]">
                  ...
                </div>
                <tr
                  key={user?.leaderboard?.user}
                  className={`pt-4 w-[80%] shadow-inner bg-[#3DAFA5] rounded-lg text-[#000]`}
                >
                  <td className="overflow- whitespace-nowrap w-[17%] lg:w-[20%] py-4 rounded-l-lg  pl-2">
                    <span
                      className={`rounded-full py-1 px-3 ${
                        user?.leaderboard?.index === 1
                          ? "bg-[#FFAD0E]"
                          : user?.leaderboard?.index === 2
                          ? "bg-[#AD5707]"
                          : user?.leaderboard?.index === 3
                          ? "bg-[#939393]"
                          : user?.leaderboard?.index === 4
                          ? "bg-gray-600"
                          : "bg-gray-800"
                      } text-[#FFF0DD]`}
                    >
                      {user?.leaderboard?.index}
                    </span>
                  </td>
                  <td className="table-cell w-[21.74%] flex items-center">
                    <div className="flex items-center">
                      <Avvvatars value={user?.leaderboard?.user} style="shape" />
                      <span className="whitespace-nowrap ml-3">
                        {formatAddress(user?.leaderboard?.user)}
                      </span>
                    </div>
                  </td>
                  <td className="lg:text-base hidden lg:table-cell w-[22.74%]">
                    {user?.leaderboard?.amount.toFixed()} USD
                  </td>
                  <td className="lg:text-base table-cell lg:text-left text-center w-[22.74%]">
                    {user?.leaderboard?.count || 0} TX
                  </td>
                  <td className="lg:text-base table-cell w-[22.74%] lg:w-[16.74%]">
                    {user?.leaderboard?.loyalty.toFixed(2) || 0} P
                  </td>
                  <td className="w-[40%] rounded-r-lg lg:text-base pr-2">
                    {user?.leaderboard?.joined ? (
                      <Button className="text-[#fff]" variant={"disabled"}>
                        Joined
                      </Button>
                    ) : (
                      <Button
                        className={`${
                          user?.leaderboard?.joinable
                            ? "bg-[#000] hover:bg-opacity-50 hover:text-[#000] text-[#FFF0DD]"
                            : "text-[#fff]"
                        } w-12 lg:w-16`}
                        onClick={async () => {
                          await handleJoin();
                          await getSingleUser();
                        }}
                        variant={"primary"}
                      >
                        Join
                      </Button>
                    )}
                  </td>
                </tr>
              </>
            ) : null}
          </tbody>
        </table>
      )}
      <div className="flex justify-center">
        <button
          onClick={() => handlePageChange(1)}
          className={`mx-1 focus:outline-none ${
            currentPage === 1
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
          className={`mx-1 focus:outline-none ${
            currentPage === totalPages
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
