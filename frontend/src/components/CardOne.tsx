import { useAccount, useContractRead } from "wagmi";
import { useWasteWiseContext } from "../context";
import {
  TokenABI,
  WASTEWISE_ADDRESS,
  WASTEWISE_TOKEN_ADDRESS,
  WasteWiseABI,
} from "../../constants";
import { formatEther } from "viem";
import { GiToken } from "react-icons/gi";

const CardOne = () => {
  const { address } = useAccount();
  const { currentUser } = useWasteWiseContext();
  const { data } = useContractRead({
    address: WASTEWISE_TOKEN_ADDRESS,
    abi: TokenABI,
    functionName: "totalSupply",
  });

  return (
    <div className="border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:shadow-md dark:bg-boxdark rounded-xl">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-[#026937]">
        <GiToken className="text-white" />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {((data as any) && formatEther(data as bigint)) || 0}
          </h4>
          <span className="text-sm font-medium">Total WasteWise Tokens</span>
        </div>

        {/* <span className="flex items-center gap-1 text-sm font-medium text-[#026937]">
          0.43%
          <svg
            className="fill-[#026937]"
            width="10"
            height="11"
            viewBox="0 0 10 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
              fill=""
            />
          </svg>
        </span> */}
      </div>
    </div>
  );
};

export default CardOne;
