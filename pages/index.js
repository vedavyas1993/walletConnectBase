import React, { useState, useEffect } from "react";
import Contract from "web3-eth-contract";
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
  // console.log("name", name());

  const [showModal, setShowModal] = useState(false);
  const [loggedin, setLoggedIn] = useState();
  const onConfirm = () => {
    setShowModal(false);
  };

  useEffect(() => {
    name();
    if (typeof window !== "undefined") {
      // Perform localStorage action
      setLoggedIn(JSON.parse(localStorage.getItem("isLoggedIn")));
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
  return (
    <div className={styles.container}>
      <Header
        setShowModal={setShowModal}
        hooks={hooks}
        connectors={connectors}
        loggedin={loggedin}
        setLoggedIn={setLoggedIn}
      />
      {showModal && (
        <Modal
          onConfirm={onConfirm}
          hooks={hooks}
          connectors={connectors}
          loggedin={loggedin}
          setLoggedIn={setLoggedIn}
        />
      )}
      <div>{tokenName}</div>
      <Footer />
    </div>
  );
}
