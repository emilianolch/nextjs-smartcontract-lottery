import { useEffect, useState } from "react";
import { contractAddresses, abi } from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Button } from "web3uikit";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled, Moralis } = useMoralis();
  const dispatch = useNotification();
  const chainId = parseInt(chainIdHex);
  const contractAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState(0);

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: enterLottery } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  const handleSuccess = async (tx) => {
    showNotification("Transaction sent. Waiting for confirmation...");
    await tx.wait(1);
    showNotification("Transaction complete!");
  };

  const showNotification = (message) => {
    dispatch({
      type: "info",
      message,
      title: "Enter lottery",
      position: "topR",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      getEntranceFee().then((entranceFee) => setEntranceFee(entranceFee || 0));
    }
  }, [isWeb3Enabled, chainId]);

  return (
    <div>
      {contractAddress ? (
        <div className="flex space-x-3">
          <Button
            onClick={async () =>
              await enterLottery({
                onSuccess: handleSuccess,
              })
            }
            text="Enter lottery"
            theme="primary"
          />
          <div>Entrance Fee: {Moralis.Units.FromWei(entranceFee)} ETH</div>
        </div>
      ) : (
        <div>
          {isWeb3Enabled
            ? "This chain is not supported"
            : "Please connect your wallet"}
        </div>
      )}
    </div>
  );
}
