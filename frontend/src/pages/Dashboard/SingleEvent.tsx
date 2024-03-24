import { useEffect, useRef, useState } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { formatEther, formatUnits, parseEther } from "viem";
import { formatDate } from "../../utils";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  MARKETPLACE_ADDRESS,
  MarketPlaceABI,
  TokenABI,
  WASTEWISE_TOKEN_ADDRESS,
  WASTEWISE_TOKEN_ABI,
} from "../../../constants";
import { toast } from "sonner";
import { ethers } from "ethers";

const SingleEvent = () => {
  let { id } = useParams();
  const [listing, setListing] = useState<any>();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingA, setLoadingA] = useState<boolean>(false);
  const [disablePay, setDisablePay] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1);
  const [total, settotal] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [allowanceAmount, setAllowanceAmount] = useState<number>(0);
  const allowanceAmountRef = useRef(0);
  const [itemLoading, setItemLoading] = useState(false);
  const [BuyListing, setBuyListingTx] = useState<any>();
  const [approve, setApproveTx] = useState<any>();

  const navigate = useNavigate();

  const increase = () => {
    setAmount(amount + 1);
  };

  const decrease = () => {
    if (amount == 1) {
      setAmount(1);
    } else {
      setAmount(amount - 1);
    }
  };

  const providers = new ethers.providers.JsonRpcProvider(
    `https://testnet.bitfinity.network`
  );

  const wproviders = new ethers.providers.Web3Provider(window.ethereum);

  const contract1 = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    MarketPlaceABI,
    providers
  );
  const contract2 = new ethers.Contract(
    WASTEWISE_TOKEN_ADDRESS,
    WASTEWISE_TOKEN_ABI,
    providers
  );

  const ert = async () => {
    setItemLoading(true);
    try {
      const item = await contract1.getItemInfo(id);
      console.log(item);
      setListing(item);
      setPrice(Number(formatUnits(item ? item[3] : 0, 18)));
      settotal(amount * Number(formatUnits(item ? item[3] : 0, 18)));
      setItemLoading(false);
    } catch (error) {
      console.log(error);
      setItemLoading(false);
    }
  };

  const brt = async () => {
    try {
      const balanceTx = await contract2.balanceOf(address);
      setBalance(Number(balanceTx));
    } catch (error) {
      console.log(error);
    }
  };

  const zst = async () => {
    setLoading(true);
    toast.info("Payment process... Might take few minutes");
    try {
      let signer = wproviders.getSigner();
      const contract4 = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MarketPlaceABI,
        signer
      );
      console.log(listing[6], amount);
      const buyListingTx = await contract4.buyListing(listing[6], amount);
      setBuyListingTx(buyListingTx);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occured when paying for item");
    }
  };

  useWaitForTransaction({
    hash: BuyListing?.hash,
    onSettled(data, error) {
      if (data?.blockHash) {
        toast.success("Item successfully purchased");
        setLoading(false);
        navigate(`/dashboard/purchases`);
      }
    },
  });

  useEffect(() => {
    ert();
    brt();
  }, []);

  const handleDisable = () => {
    let dateNow = Math.floor(Date.now() / 1000);
    if (listing && listing[4] < dateNow) {
      return true;
    } else {
      return false;
    }
  };

  const handleBalance = () => {
    if (balance < Number(parseEther(`${total}`))) {
      toast.error("Insufficient RWISE balance");
      return true;
    } else {
      return false;
    }
  };

  const handlePay = async () => {
    zst?.();
  };

  useEffect(() => {
    settotal(amount * price);
    window.localStorage.setItem("itemAmount", `${amount}`);
  }, [amount]);
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start gap-x-8">
        {itemLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div className="card mb-5 w-[95%] max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto bg-base-100 shadow-xl lg:shadow-2xl pt-4">
            <figure>
              <img src={listing ? listing[2] : ""} alt="Shoes" />
            </figure>
            <div className="card-body">
              <h2 className="card-title capitalize lg:text-3xl">
                {listing ? listing[0] : ""}
                <div className="badge badge-success text-white">NEW</div>
              </h2>
              <p>
                <span className="font-bold text-lg">Description: </span>
                {listing ? listing[1] : ""}
              </p>
              <p>
                <span className="font-bold text-red-500">Ends: </span>{" "}
                {formatDate(Number(listing ? listing[4] : 0))}
              </p>
              <div className="card-actions justify-between items-center mt-5">
                <div className="grid grid-cols-3 gap-x-5 items-center">
                  <button className="" onClick={decrease}>
                    <FaMinus />
                  </button>
                  <h2 className="text-center text-lg font-semibold">
                    {amount}
                  </h2>
                  <button className="" onClick={increase}>
                    <FaPlus />
                  </button>
                </div>
                <h3 className="font-bold text-lg">
                  {listing ? formatUnits(listing ? listing[3] : 0, 18) : ""}{" "}
                  <span>RWISE</span>
                </h3>
              </div>
              {/* <div className="divider"></div> */}
              <div className="overflow-x-auto my-4">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>ListingId</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <td>
                        {listing ? Number(listing ? listing[6] : 0) : "-"}
                      </td>
                      <td>
                        {listing
                          ? formatUnits(listing ? listing[3] : 0, 18)
                          : 0}{" "}
                        RWISE
                      </td>
                      <td>{amount}</td>
                      <td>{total} RWISE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                className="btn bg-[#026937] hover:bg-[#026937] text-white"
                onClick={handlePay}
                disabled={handleDisable() || handleBalance()}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : handleDisable() ? (
                  "Expired"
                ) : handleBalance() ? (
                  "Insufficient Balance"
                ) : (
                  "Pay Now"
                )}
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="mb-5 stats hidden lg:block stats-vertical w-full shadow-xl lg:shadow-2xl">
            <div className="stat">
              <div className="stat-figure text-success-content dark:text-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-value text-success-content dark:text-success">
                {/* {listing && Number(listing ? listing[7] : 0)} */}645
              </div>
              <div className="stat-title">Items sold</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Transactions</div>
              <div className="stat-value text-secondary">2.6M</div>
            </div>
          </div>

          <section className="p-2 lg:p-8 hidden lg:block shadow-xl lg:shadow-2xl">
            <div className="font-bold text-2xl">Transactions</div>
            <div className="overflow-x-auto my-4">
              <table className="table table-xs lg:table-md">
                {/* head */}
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr className="h-16">
                    <th>7-Nov-2023</th>
                    <td>0xB5119738BB5Fe8BE39aB592539EaA66F03A77174</td>
                    <td>40</td>
                  </tr>
                  <tr className="h-16">
                    <th>18-Jun-2023</th>
                    <td>0xB5119738BB5Fe8BE39aB592539EaA66F03A77174</td>
                    <td>12</td>
                  </tr>
                  <tr className="h-16">
                    <th>14-Mar-2023</th>
                    <td>0xB5119738BB5Fe8BE39aB592539EaA66F03A77174</td>
                    <td>4</td>
                  </tr>
                  <tr className="h-16">
                    <th>9-Feb-2023</th>
                    <td>0xB5119738BB5Fe8BE39aB592539EaA66F03A77174</td>
                    <td>11</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SingleEvent;
