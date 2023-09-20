import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className={"flex justify-between bottom-0 items-center"}>
      <p className={"text-[#fff] font-light"}>Aggregator</p>
      <div className={"flex gap-4 text-xl text-gray-400 "}>
        <a
          href="https://twitter.com/aggreio"
          target="_blank"
          className={"hover:text-gray-100 transition-all"}
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          href={"https://discord.gg/a6pQcrZQ"}
          target="_blank"
          className={"hover:text-gray-100 transition-all"}
        >
          <FontAwesomeIcon icon={faDiscord} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
