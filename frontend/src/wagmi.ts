import { configureChains, createConfig } from "wagmi";
import {
  goerli,
  mainnet,
  sepolia,
  baseGoerli,
  polygonMumbai,
} from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";

import { publicProvider } from "wagmi/providers/public";

import { Chain } from "wagmi";

export const bitfinity = {
  id: 355113,
  name: "Bitfinity",
  network: "bitfinity",
  nativeCurrency: {
    decimals: 18,
    name: "Bitfinity Network Testnet",
    symbol: "BFT",
  },
  rpcUrls: {
    public: { http: ["https://testnet.bitfinity.network"] },
    default: { http: ["https://testnet.bitfinity.network"] },
  },
  blockExplorers: {
    etherscan: { name: "Bitfinity", url: "https://explorer.bitfinity.network" },
    default: { name: "Bitfinity", url: "https://explorer.bitfinity.network" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    sepolia,
    baseGoerli,
    polygonMumbai,
    bitfinity,
    ...(import.meta.env?.MODE === "development" ? [bitfinity] : []),
  ],
  [
    alchemyProvider({ apiKey: "ix0-fxmVivwaIWYHtIpwVZB7wC8TpxEm" }),
    publicProvider(),
  ]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: "wagmi",
    //   },
    // }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: "Injected",
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  publicClient,
  webSocketPublicClient,
});
