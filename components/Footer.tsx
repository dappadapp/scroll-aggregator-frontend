"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useBlockNumber } from "wagmi";

const Footer = () => {
  const blockNumber = useBlockNumber({});
  return (
    <div
      className={
        "flex flex-col-reverse w-full lg:flex-row gap-5 justify-between bottom-0 items-center mt-2"
      }
    >
      <p className={"text-[#FFF0DD] font-light"}>Aggregator</p>
      <div className="flex flex-col gap-4 items-center">
        <p className={"text-[#FFF0DD] font-light"}>Powered By DappLabs</p>
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
        <p className={"text-[#FFF0DD] font-light"}>{Number(blockNumber?.data)}</p>
      </div>
    </div>
  );
};

export default Footer;
