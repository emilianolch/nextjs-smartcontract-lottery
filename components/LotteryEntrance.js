import { useEffect, useState } from "react";
import { contractAddresses, abi } from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled, Moralis } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const contractAddress = chainId ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState(0);

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      getEntranceFee().then((entranceFee) =>
        setEntranceFee(entranceFee.toString())
      );
    }
  }, [isWeb3Enabled]);

  return <div>Entrance fee: {Moralis.Units.FromWei(entranceFee)}</div>;
}
