import React, { useState, useEffect, useLayoutEffect } from "react";
import Contract from "web3-eth-contract";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import AaveAbi from "../contracts/AaveAbi.json";
import Header from "../components/Header/Header";
import Modal from "../components/UI/Modal";
import Footer from "../components/Footer/Footer";
import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.css";
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";
import {
  hooks as coinBaseHooks,
  coinbaseWallet,
} from "../connectors/coinbaseWallet";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../connectors/walletConnect";

export default function Home() {
  const [tokenName, setTokenName] = useState("");
  const [metaMaskPresent, setMetaMaskPresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState();
  const onConfirm = () => {
    setShowModal(false);
  };

  Contract.setProvider(
    `https://mainnet.infura.io/v3/84842078b09946638c03157f83405213`
  );
  // const web3 = new Web3(
  //   `https://mainnet.infura.io/v3/84842078b09946638c03157f83405213`
  // );
  // let contract = new web3.eth.Contract(
  let contract = new Contract(
    AaveAbi,
    "0xC13eac3B4F9EED480045113B7af00F7B5655Ece8"
  );
  let name = async () => {
    let res = await contract.methods.name().call();
    setTokenName(res);
  };

  useEffect(() => {
    console.log(tokenName);
  }, []);
  useEffect(() => {
    name();
    if (typeof window !== "undefined") {
      // Perform local Storage action
      setLoggedIn(JSON.parse(sessionStorage.getItem("isLoggedIn")));
    }
  }, []);

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

  // code to detect metamask
  const detectMetaMask = async () => {
    setLoading(true);
    try {
      let provider = await detectEthereumProvider();
      console.log("provider", provider.isMetaMask);
      if (provider.isMetaMask) {
        setMetaMaskPresent(true);
      }
    } catch (e) {
      setMetaMaskPresent(false);
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    detectMetaMask();
  }, []);
  return (
    <div className={styles.container}>
      <Header
        setShowModal={setShowModal}
        hooks={hooks}
        connectors={connectors}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
      />
      {showModal && (
        <Modal
          onConfirm={onConfirm}
          hooks={hooks}
          connectors={connectors}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          metaMaskPresent={metaMaskPresent}
          loading={loading}
        />
      )}
      <Footer />
    </div>
  );
}
