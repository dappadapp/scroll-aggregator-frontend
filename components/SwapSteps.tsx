import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Props = {
  hasNext?: boolean;
  tokenImage: string;
  value: number;
  type?: string;
};

export const SwapSteps: React.FC<Props> = (props) => {
  return (
    <div className={`flex gap-3 ${props.hasNext ? "min-w-[150px]" : ""}`}>
      <div className="flex gap-1 flex-col items-center">
        <Image
          src={props.tokenImage}
          alt={props.tokenImage + "-swap-steps"}
          width={32}
          height={32}
          className="rounded-full w-8 h-8"
        />
        <span className="text-sm">{props.value}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center items-center">
        {props.hasNext ? (
          <div className="flex flex-row w-full items-center gap-[2px]">
            <div className="w-full border h-[1px] border-dashed"></div>
            <FontAwesomeIcon icon={faArrowRight} className="h-6" />
          </div>
        ) : null}
        {props.type ? <span className="text-[#AAA]">{props.type}</span> : null}
      </div>
    </div>
  );
};
