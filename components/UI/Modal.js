import React, { useState, useEffect, useLayoutEffect } from "react";
import Card from "./Card";
import Button from "./Button";
import styles from "./Modal.module.css";

import detectEthereumProvider from "@metamask/detect-provider";

import CoinbaseWalletCard from "../connectorCards/CoinbaseWalletCard";
import GnosisSafeCard from "../connectorCards/GnosisSafeCard";
import MetaMaskCard from "../connectorCards/MetaMaskCard";
import NetworkCard from "../connectorCards/NetworkCard";
import WalletConnectCard from "../connectorCards/WalletConnectCard";
import ProviderExample from "../ProviderExample";
import { Accounts } from "../Accounts";
// const {
//   useChainId,
//   useAccounts,
//   useError,
//   useIsActivating,
//   useIsActive,
//   useProvider,
//   useENSNames,
// } = hooks;

//   const chainId = useChainId();
//   const accounts = useAccounts();
//   const error = useError();
//   const isActivating = useIsActivating();
//   const isActive = useIsActive();
//   const provider = useProvider();
//   const ENSNames = useENSNames(provider);
const Modal = (props) => {
  const { metaMaskHooks, coinBaseHooks, walletConnectHooks } = props.hooks;
  const { metaMask, coinbaseWallet, walletConnect } = props.connectors;
  const metaMaskPresent = props.metaMaskPresent;
  const loading = props.loading;
  const mmProvider = metaMaskHooks.useProvider();
  const cbProvider = coinBaseHooks.useProvider();
  const wcProvider = walletConnectHooks.useProvider();
  console.log("mmp", metaMaskPresent);
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
  console.log("chainid", mm.chainId);

  const chainIds = {
    mmChainId: mm.chainId,
    cbChainId: cb.chainId,
    wcChainId: wc.chainId,
  };
  const metaMaskConnected = !wc.chainId && !cb.chainId;
  const walletConnectConnected = !mm.chainId && !cb.chainId;
  const coinbaseWalletConnected = !mm.chainId && !wc.chainId;

  const walletsArrayData = [mm, cb, wc];
  const connectedWalletDetails = [];
  walletsArrayData.map((wallet) => {
    if (wallet.isActive == true) {
      connectedWalletDetails.push(wallet);
    }
  });
  console.log("connect", sessionStorage.getItem("LoggedInFrom"));

  return (
    <>
      <div className={styles.backdrop} onClick={props.onConfirm}></div>
      {loading && (
        <Card className={styles.modal}>
          <h1>LOADING WALLETS....</h1>
        </Card>
      )}
      {!loading && (
        <Card className={styles.modal}>
          {/* <ProviderExample /> */}
          {(JSON.parse(sessionStorage.getItem("isLoggedIn") == "false") ||
            !sessionStorage.getItem("isLoggedIn")) && (
            <div
              style={{
                display: "flex",
                flexFlow: "wrap",
                fontFamily: "sans-serif",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {metaMaskPresent && (
                <MetaMaskCard
                  loggedIn={props.loggedIn}
                  setLoggedIn={props.setLoggedIn}
                  loggedInFrom="metamask"
                />
              )}

              <WalletConnectCard
                loggedIn={props.loggedIn}
                setLoggedIn={props.setLoggedIn}
                loggedInFrom="walletConnect"
              />
              <CoinbaseWalletCard
                loggedIn={props.loggedIn}
                setLoggedIn={props.setLoggedIn}
                loggedInFrom="coinbasewallet"
              />
              {/* <NetworkCard />
            <GnosisSafeCard /> */}
            </div>
          )}
          {JSON.parse(sessionStorage.getItem("isLoggedIn")) == true && (
            <div>
              {sessionStorage.getItem("LoggedInFrom") === "metamask" &&
                metaMaskPresent && (
                  <MetaMaskCard
                    connectedWalletDetails={connectedWalletDetails}
                    loggedIn={props.loggedIn}
                    setLoggedIn={props.setLoggedIn}
                    loggedInFrom={"metamask"}
                  />
                )}
              {sessionStorage.getItem("LoggedInFrom") === "walletConnect" && (
                <WalletConnectCard
                  loggedIn={props.loggedin}
                  setLoggedIn={props.setLoggedIn}
                  loggedInFrom="walletConnect"
                />
              )}
              {sessionStorage.getItem("LoggedInFrom") === "coinbasewallet" && (
                <CoinbaseWalletCard
                  loggedIn={props.loggedin}
                  setLoggedIn={props.setLoggedIn}
                  loggedInFrom="coinbasewallet"
                />
              )}
              {/* <Accounts
              accounts={connectedWalletDetails[0].accounts}
              provider={connectedWalletDetails[0].provider}
              ENSNames={connectedWalletDetails[0].ENSNames}
              chainIds={chainIds}
            /> */}
            </div>
          )}
          {/* <Button
          onClick={() => {
            if (metaMaskConnected) {
              metaMask.deactivate();
            }
            if (walletConnectConnected) {
              walletConnect.deactivate();
            }
            if (coinbaseWalletConnected) {
              coinbaseWallet.deactivate();
            }
            connectedWalletDetails = [];
          }}
        >
          Disconnect
        </Button> */}
          {/* <Button onClick={props.onConfirm}>okay</Button> */}
        </Card>
      )}
    </>
  );
};

export default Modal;
