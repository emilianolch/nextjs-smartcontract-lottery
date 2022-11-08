import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import Button from "./Button";

export default function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled, isWeb3EnableLoading, Moralis } =
    useMoralis();
  const connect = async () => {
    await enableWeb3();
    localStorage.setItem("connected", "injected");
  };

  useEffect(() => {
    if (!isWeb3Enabled && localStorage.getItem("connected")) enableWeb3();
  }, []);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (account == null) localStorage.removeItem("connected");
    });
  });

  return (
    <div className="p-3 flex justify-end">
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <Button
          text="Connect"
          action={connect}
          disabled={isWeb3EnableLoading}
        />
      )}
    </div>
  );
}
