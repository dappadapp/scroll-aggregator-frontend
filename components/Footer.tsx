"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useBlockNumber } from "wagmi";

const Footer = () => {
  const blockNumber = useBlockNumber({});
  return (
    <div
      className={
        "flex w-full sm:flex-row flex-col sm:gap-4 gap-2 px-4 sm:justify-between justify-center bottom-0 sm:items-start items-center sm:mt-8 xs:mt-6 mt-2 sm:text-base xs:text-sm text-xs"
      }
    >
      <p className={"text-[#FFF0DD]"}>2023 © aggre! </p>
      <div className="flex flex-col gap-4 items-center">
        <p
          onClick={() => window.open("https://dapplabs.tech/")}
          className={"cursor-pointer text-[#FFF0DD]"}
        >
          Powered By DappLabs
        </p>
        <div className={"flex gap-4 text-xl text-gray-400 "}>
          <a
            href="https://twitter.com/aggreio"
            target="_blank"
            className={"hover:text-gray-100 transition-all"}
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            href={"https://discord.gg/dwBpDBVewX"}
            target="_blank"
            className={"hover:text-gray-100 transition-all"}
          >
            <FontAwesomeIcon icon={faDiscord} />
          </a>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="bg-[#3DAFA5] w-2 h-2 rounded-full"></div>
        <p className={"text-[#FFF0DD]"}>{Number(blockNumber?.data) || "666999"}</p>
      </div>
    </div>
  );
};

export default Footer;
