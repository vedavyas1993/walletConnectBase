import React, { useEffect, useState, useContext } from "react";
import styles from "../../styles/Header.module.css";

function Header({ setShowModal, hooks, loggedIn, setLoggedIn }) {
  const { metaMaskHooks, coinBaseHooks, walletConnectHooks } = hooks;
  const mmProvider = metaMaskHooks.useProvider();
  const cbProvider = coinBaseHooks.useProvider();
  const wcProvider = walletConnectHooks.useProvider();
  // const [isLoggedIn, setIsLoggedIn] = useState();
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

  const walletsArrayData = [mm, cb, wc];
  console.log("mm", mm);
  console.log("cb", cb);
  console.log("wc", wc);

  const metaMaskConnected = !wc.chainId && !cb.chainId && mm.chainId;
  const walletConnectConnected = !mm.chainId && !cb.chainId && wc.chainId;
  const coinbaseWalletConnected = !mm.chainId && !wc.chainId && cb.chainId;

  let connectedWalletDetails = [];
  walletsArrayData.map((wallet) => {
    if (wallet.isActive == true) {
      connectedWalletDetails.push(wallet);
    }
  });
  if (
    !metaMaskConnected &&
    !walletConnectConnected &&
    !coinbaseWalletConnected
  ) {
    connectedWalletDetails = [];
  }

  useEffect(() => {
    if (mm.isActive) {
      setLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("LoggedInFrom", "metamask");
    }
    if (cb.isActive) {
      setLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("LoggedInFrom", "walletConnect");
    }
    if (wc.isActive) {
      setLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("LoggedInFrom", "coinbasewallet");
    }
  }, [mm.isActive, cb.isActive, wc.isActive]);
  console.log("wallet", loggedIn);

  return (
    <div className={styles.header}>
      <span>logo</span>
      <div>
        {/* <span style={{ marginRight: "30px" }}>
          {mm.chainId
            ? "METAMASK"
            : wc.chainId
            ? "WALLET CONNECT"
            : cb.chainId
            ? "COINBASE"
            : "NOT CONNECTED"}
        </span> */}
        <button onClick={() => setShowModal(true)}>
          {typeof loggedIn !== "undefined" && loggedIn == true
            ? "VIEW DETAILS"
            : "CONNECT WALLET"}
        </button>
      </div>
    </div>
  );
}

export default Header;
