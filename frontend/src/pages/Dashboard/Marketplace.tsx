import React, { useEffect, useState } from "react";
import { useContractEvent, useContractRead } from "wagmi";
import { formatUnits } from "viem";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { formatDate } from "../../utils";
import {
  MARKETPLACE_ADDRESS,
  MarketPlaceABI,
  WASTEWISE_ADDRESS,
  WASTEWISE_TOKEN_ADDRESS,
} from "../../../constants";
import { ethers } from "ethers";

type Props = {};

const Marketplace = (props: Props) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    const allActiveItems = await contract.getAllActiveItemInfo();
    if (allActiveItems) {
      for (let i = 0; i < allActiveItems.length; i++) {
        items.push(allActiveItems[i]);
      }
      setListings(items);
    }
  };

  useEffect(() => {
    ert();
  }, []);

  // const { isLoading, isFetchedAfterMount } = useContractRead({
  //   address: MARKETPLACE_ADDRESS,
  //   abi: MarketPlaceABI,
  //   functionName: "getAllActiveItemInfo",
  //   // enabled: false,
  //   blockTag: "safe",
  //   // suspense: true,
  //   select: (data) => console.log("selected data", data),
  //   onError(data: any) {
  //     console.log(data);
  //   },
  //   onSuccess(data: any) {
  //     console.log("Fetched marketplace active info", data);
  //     setListings(data);
  //   },
  // });
  // console.log(isFetchedAfterMount);
  useContractEvent({
    address: MARKETPLACE_ADDRESS,
    abi: MarketPlaceABI,
    eventName: "ListingCreated",
    listener(log) {
      console.log(log);
    },
  });
  return (
    <div className="my-8">
      {false && listings.length == 0 && (
        <p className="text-lg font-semibold text-center">
          No Items Available To Purchase
        </p>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {false ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          listings.map((item, index) => {
            console.log(item);
            return (
              <Link to={`event/${item ? item[6] : ""}`} key={index}>
                <div className="card w-80 sm:w-[28rem] md:w-80 bg-base-100 shadow-xl">
                  <figure>
                    <img src={item ? item[2] : ""} alt="Shoes" />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title capitalize">
                      {item ? item[0] : ""}
                      <div className="badge badge-success text-white">NEW</div>
                    </h2>
                    <p>
                      <span className="font-bold">Desc: </span>{" "}
                      {item ? item[1] : ""}
                    </p>
                    <p>
                      <span className="font-bold text-red-500">Ends: </span>{" "}
                      {formatDate(Number(item ? item[4] : 0))}
                    </p>
                    <div className="card-actions justify-between items-center mt-3">
                      <p className="text-lg text-[#026937]">Available</p>
                      <h3 className="font-bold text-lg">
                        {formatUnits(item ? item[3] : 0, 18)}{" "}
                        <span>$RWISE</span>
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Marketplace;
