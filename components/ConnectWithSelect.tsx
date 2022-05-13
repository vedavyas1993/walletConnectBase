import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import type { Web3ReactHooks, useWeb3React } from "@web3-react/core";
import { GnosisSafe } from "@web3-react/gnosis-safe";
import type { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import { useCallback, useEffect, useState } from "react";
import { CHAINS, getAddChainParameters, URLS } from "../chains";

function ChainSelect({
  chainId,
  switchChain,
  displayDefault,
  chainIds,
}: {
  chainId: number;
  switchChain: (chainId: number) => void | undefined;
  displayDefault: boolean;
  chainIds: number[];
}) {
  return (
    <select
      value={chainId}
      onChange={(event) => {
        switchChain?.(Number(event.target.value));
      }}
      disabled={switchChain === undefined}
    >
      {displayDefault ? <option value={-1}>Default Chain</option> : null}
      {chainIds.map((chainId) => (
        <option key={chainId} value={chainId}>
          {CHAINS[chainId]?.name ?? chainId}
        </option>
      ))}
    </select>
  );
}

export function ConnectWithSelect({
  connector,
  chainId,
  isActivating,
  error,
  isActive,
  loggedIn,
  setLoggedIn,
  loggedInFrom,
}: {
  connector: MetaMask | WalletConnect | CoinbaseWallet | Network | GnosisSafe;
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  error: ReturnType<Web3ReactHooks["useError"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
}) {
  const isNetwork = connector instanceof Network;
  const displayDefault = !isNetwork;
  const chainIds = (isNetwork ? Object.keys(URLS) : Object.keys(CHAINS)).map(
    (chainId) => Number(chainId)
  );

  const [desiredChainId, setDesiredChainId] = useState<number>(
    isNetwork ? 1 : -1
  );

  // const setSessionStorage = (LoggedInFrom) => {
  //   sessionStorage.setItem("isLoggedIn", true);
  //   sessionStorage.setItem(
  //     "LoggedInFrom",
  //     LoggedInFrom ? LoggedInFrom : loggedInFrom
  //   );
  //   setLoggedIn(true);
  // };

  var connectHandler = (LoggedInFrom) => {
    // setSessionStorage(LoggedInFrom);
    return () =>
      connector instanceof GnosisSafe
        ? void connector.activate()
        : connector instanceof WalletConnect || connector instanceof Network
        ? connector.activate(desiredChainId === -1 ? undefined : desiredChainId)
        : connector.activate(
            desiredChainId === -1
              ? undefined
              : getAddChainParameters(desiredChainId)
          );
  };

  useEffect(() => {
    if (isNetwork) {
      setLoggedIn(true);
    }
  });

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("isLoggedIn")) == true) {
      console.log(
        "xyz",
        typeof connectHandler(sessionStorage.getItem("LoggedInFrom"))
      );
      connectHandler(sessionStorage.getItem("LoggedInFrom"))();
    }
  }, []);
  const switchChain = useCallback(
    async (desiredChainId: number) => {
      connectHandler(sessionStorage.getItem("LoggedInFrom"))();
      setDesiredChainId(desiredChainId);
      // if we're already connected to the desired chain, return
      if (desiredChainId === chainId) return;
      // if they want to connect to the default chain and we're already connected, return
      if (desiredChainId === -1 && chainId !== undefined) return;

      if (connector instanceof WalletConnect || connector instanceof Network) {
        await connector.activate(
          desiredChainId === -1 ? undefined : desiredChainId
        );
      } else {
        await connector.activate(
          desiredChainId === -1
            ? undefined
            : getAddChainParameters(desiredChainId)
        );
      }
    },
    [connector, chainId]
  );

  if (error) {
    sessionStorage.setItem("isLoggedIn", false);
    sessionStorage.setItem("LoggedInFrom", "");
    setLoggedIn(false);
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {!(
          connector instanceof GnosisSafe ||
          connector instanceof WalletConnect ||
          connector instanceof CoinbaseWallet
        ) && (
          <ChainSelect
            chainId={desiredChainId}
            switchChain={switchChain}
            displayDefault={displayDefault}
            chainIds={chainIds}
          />
        )}
        <div style={{ marginBottom: "1rem" }} />
        <button
          onClick={
            () => {
              setLoggedIn(true);
              connectHandler(sessionStorage.getItem("LoggedInFrom"));
              return connector instanceof GnosisSafe
                ? void connector.activate()
                : connector instanceof WalletConnect ||
                  connector instanceof Network
                ? void connector.activate(
                    desiredChainId === -1 ? undefined : desiredChainId
                  )
                : void connector.activate(
                    desiredChainId === -1
                      ? undefined
                      : getAddChainParameters(desiredChainId)
                  );
            }
            // connector.deactivate()
          }
        >
          Try Again?
        </button>
      </div>
    );
  } else if (isActive) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {!(
          connector instanceof GnosisSafe ||
          connector instanceof WalletConnect ||
          connector instanceof CoinbaseWallet
        ) && (
          <ChainSelect
            chainId={desiredChainId === -1 ? -1 : chainId}
            switchChain={switchChain}
            displayDefault={displayDefault}
            chainIds={chainIds}
          />
        )}
        <div style={{ marginBottom: "1rem" }} />
        <button
          onClick={() => {
            sessionStorage.setItem("isLoggedIn", false);
            sessionStorage.setItem("LoggedInFrom", "");
            setLoggedIn(false);
            void connector.deactivate();
          }}
        >
          Disconnect
        </button>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {!(
          connector instanceof GnosisSafe ||
          connector instanceof WalletConnect ||
          connector instanceof CoinbaseWallet
        ) && (
          <ChainSelect
            chainId={desiredChainId}
            switchChain={isActivating ? undefined : switchChain}
            displayDefault={displayDefault}
            chainIds={chainIds}
          />
        )}
        <div style={{ marginBottom: "1rem" }} />
        <button
          onClick={
            () => connectHandler(sessionStorage.getItem("LoggedInFrom"))()
            // isActivating
            //   ? undefined
            //   : () =>
            //       connector instanceof GnosisSafe
            //         ? void connector.activate()
            //         : connector instanceof WalletConnect ||
            //           connector instanceof Network
            //         ? connector.activate(
            //             desiredChainId === -1 ? undefined : desiredChainId
            //           )
            //         : connector.activate(
            //             desiredChainId === -1
            //               ? undefined
            //               : getAddChainParameters(desiredChainId)
            //           )
          }
          disabled={isActivating}
        >
          Connect
        </button>
      </div>
    );
  }
}
