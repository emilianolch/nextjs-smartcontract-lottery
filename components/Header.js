import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="flex justify-between">
      <h1 className="text-2xl font-medium">DLottery</h1>
      <ConnectButton />
    </div>
  );
}
