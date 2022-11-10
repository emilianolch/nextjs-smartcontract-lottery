import { useEffect, useState } from "react";
import { contractAddresses, abi } from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Button } from "web3uikit";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    web3: provider,
    Moralis,
  } = useMoralis();
  const ethers = Moralis.web3Library;
  const chainId = parseInt(chainIdHex);
  const contractAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  // UI state

  const [entranceFee, setEntranceFee] = useState(0);
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [recentWinner, setRecentWinner] = useState(0);

  const updateUI = () => {
    getEntranceFee().then((entranceFee) => setEntranceFee(entranceFee || 0));
    getNumberOfPlayers().then((n) => setNumberOfPlayers(n));
    getRecentWinner().then((winner) => setRecentWinner(winner));
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
      if (contractAddress) {
        const contract = new ethers.Contract(contractAddress, abi, provider);
        contract.on("WinnerPick", () => {
          updateUI();
          console.log("We've got a winner!");
        });
      }
    }
  }, [isWeb3Enabled, chainId]);

  // Notifications

  const dispatch = useNotification();
  const showNotification = (message) => {
    dispatch({
      type: "info",
      message,
      title: "Enter lottery",
      position: "topR",
    });
  };

  // Contract ABI

  const {
    runContractFunction: enterLottery,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const handleSuccess = async (tx) => {
    showNotification("Transaction sent. Waiting for confirmation...");
    await tx.wait(1);
    showNotification("Transaction complete!");
    updateUI();
  };

  return (
    <>
      {contractAddress ? (
        <>
          <div className="flex space-x-3">
            <Button
              onClick={async () =>
                await enterLottery({
                  onSuccess: handleSuccess,
                })
              }
              text="Enter lottery"
              theme="primary"
              disabled={isLoading || isFetching}
            />
            <p>Entrance fee: {Moralis.Units.FromWei(entranceFee)} ETH</p>
          </div>
          <p>Number of players: {numberOfPlayers?.toString()}</p>
          <p>Recent winner: {recentWinner}</p>
        </>
      ) : (
        <div>
          {isWeb3Enabled
            ? "This chain is not supported"
            : "Please connect your wallet"}
        </div>
      )}
    </>
  );
}
