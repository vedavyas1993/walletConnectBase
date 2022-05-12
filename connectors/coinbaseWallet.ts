import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";
import { URLS } from "../chains";

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) => {
    console.log(URLS[1][0]);
    return new CoinbaseWallet(actions, {
      url: URLS[1][0],
      appName: "web3-react",
    });
  }
);
