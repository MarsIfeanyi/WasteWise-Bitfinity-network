import { formatDate } from "../../utils";
import { useEffect, useState } from "react";
import { useAccount, useContractEvent, useContractRead } from "wagmi";
import { MARKETPLACE_ADDRESS, MarketPlaceABI } from "../../../constants";
import { formatEther } from "viem";
import { ethers } from "ethers";

type Props = {};

const MyEvents = (props: Props) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const providers = new ethers.providers.JsonRpcProvider(
    `https://testnet.bitfinity.network`
  );

  const contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    MarketPlaceABI,
    providers
  );

  const ert = async () => {
    let items = [];
    const events = await contract.getEventsByUser(address);
    if (events) {
      for (let i = 0; i < events.length; i++) {
        items.push(events[i]);
      }
      console.log(items[0]);
      setEvents(items);
    }
  };

  useEffect(() => {
    ert();
  }, []);

  // const { isLoading } = useContractRead({
  //   address: MARKETPLACE_ADDRESS,
  //   abi: MarketPlaceABI,
  //   functionName: "getEventsByUser",
  //   args: [address],
  //   onError(data: any) {
  //     console.log(data);
  //     setLoading(false);
  //   },
  //   onSuccess(data: any) {
  //     setEvents(data);
  //     setLoading(false);
  //   },
  // });

  useContractEvent({
    address: MARKETPLACE_ADDRESS,
    abi: MarketPlaceABI,
    eventName: "ListingBought",
    listener(log) {
      console.log(log);
    },
  });

  // useEffect(() => {
  //   if (isLoading) {
  //     setLoading(true);
  //   }
  // }, []);

  return (
    <div className="my-8 w-10/12">
      <div className="font-bold text-2xl">Transactions</div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="w-20 mx-auto">
            <span className="loading loading-spinner w-full bg-[#026937]"></span>
          </div>
        ) : (
          <table className="table table-xs lg:table-md">
            {/* head */}
            <thead>
              <tr>
                <th>Date</th>
                <th>ItemId</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Tokens Transferred</th>
              </tr>
            </thead>
            <tbody>
              {events.map((item, index) => (
                <tr key={index}>
                  <th>{item && formatDate(Number(item.date))}</th>
                  <td>{item && Number(item.itemId)}</td>
                  <td>{item && item.itemName}</td>
                  <td>
                    {item && `${Number(formatEther(item.itemPrice))} RWISE`}
                  </td>
                  <td>{item && Number(item.qty)}</td>
                  <td>
                    {item && Number(formatEther(item.amountOfTokensTransfered))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
