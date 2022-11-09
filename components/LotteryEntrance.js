import { useEffect, useState } from "react";
import { contractAddresses, abi } from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled, Moralis } = useMoralis();
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

  useEffect(() => {
    if (isWeb3Enabled) {
      getEntranceFee().then((entranceFee) => setEntranceFee(entranceFee || 0));
    }
  }, [isWeb3Enabled, chainId]);

  return (
    <div>
      {contractAddress ? (
        <div className="flex space-x-3">
          <button
            onClick={async () => await enterLottery()}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enter lottery
          </button>
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
