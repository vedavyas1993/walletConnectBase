import React, { useState } from "react";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";

// hooks and instances of wallets
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";
import {
  hooks as coinBaseHooks,
  coinbaseWallet,
} from "../connectors/coinbaseWallet";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../connectors/walletConnect";

function MyApp({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState();

  const hooks = {
    metaMaskHooks,
    coinBaseHooks,
    walletConnectHooks,
  };

  const connectors = {
    metaMask,
    coinbaseWallet,
    walletConnect,
  };

  const logging = {
    loggedIn,
    setLoggedIn,
  };

  const WalletHooks = React.createContext({});
  const WalletConnectors = React.createContext({});
  const LoggedIn = React.createContext({});

  const mmProvider = metaMaskHooks.useProvider();
  const cbProvider = coinBaseHooks.useProvider();
  const wcProvider = walletConnectHooks.useProvider();
  const mm = {
    chainId: metaMaskHooks.useChainId(),
    accounts: metaMaskHooks.useAccounts(),
    error: metaMaskHooks.useError(),
    isActivating: metaMaskHooks.useIsActivating(),
    isActive: metaMaskHooks.useIsActive(),
    provider: metaMaskHooks.useProvider(),
    ENSNames: metaMaskHooks.useENSNames(mmProvider),
  };
  const cb = {
    chainId: coinBaseHooks.useChainId(),
    accounts: coinBaseHooks.useAccounts(),
    error: coinBaseHooks.useError(),
    isActivating: coinBaseHooks.useIsActivating(),
    isActive: coinBaseHooks.useIsActive(),
    provider: coinBaseHooks.useProvider(),
    ENSNames: coinBaseHooks.useENSNames(cbProvider),
  };
  const wc = {
    chainId: walletConnectHooks.useChainId(),
    accounts: walletConnectHooks.useAccounts(),
    error: walletConnectHooks.useError(),
    isActivating: walletConnectHooks.useIsActivating(),
    isActive: walletConnectHooks.useIsActive(),
    provider: walletConnectHooks.useProvider(),
    ENSNames: walletConnectHooks.useENSNames(wcProvider),
  };

  return (
    // <LoggedIn.Provider value={logging}>
    //   <WalletConnectors.Provider value={connectors}>
    //     <WalletHooks.Provider value={hooks}>
    <Component {...pageProps} />
    //     </WalletHooks.Provider>
    //   </WalletConnectors.Provider>
    // </LoggedIn.Provider>
  );
}

export default MyApp;
