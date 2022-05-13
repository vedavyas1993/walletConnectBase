import { useEffect } from "react";
import { hooks, walletConnect } from "../../connectors/walletConnect";
import { Accounts } from "../Accounts";
import { Card } from "../Card";
import { Chain } from "../Chain";
import { ConnectWithSelect } from "../ConnectWithSelect";
import { Status } from "../Status";

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

export default function WalletConnectCard(props: any) {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();
  const ENSNames = useENSNames(provider);
  const loggedIn = props.loggedIn;
  const setLoggedIn = props.setLoggedIn;
  const loggedInFrom = props.loggedInFrom;
  // attempt to connect eagerly on mount
  // useEffect(() => {
  //   if (sessionStorage.getItem("LoggedInFrom") == "walletConnect") {
  //     void walletConnect.connectEagerly();
  //   }
  // }, []);

  return (
    <Card>
      <div>
        <b>WalletConnect</b>
        <Status isActivating={isActivating} error={error} isActive={isActive} />
        <div style={{ marginBottom: "1rem" }} />
        {/* <Chain chainId={chainId} /> */}
        <Accounts
          accounts={accounts}
          provider={provider}
          ENSNames={ENSNames}
          chainId={chainId}
        />
      </div>
      <div style={{ marginBottom: "1rem" }} />
      <ConnectWithSelect
        connector={walletConnect}
        chainId={chainId}
        isActivating={isActivating}
        error={error}
        isActive={isActive}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        loggedInFrom={loggedInFrom}
      />
    </Card>
  );
}
