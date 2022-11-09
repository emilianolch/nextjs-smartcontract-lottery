import Head from "next/head";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";

export default function Home() {
  return (
    <div className="p-3 space-x-3">
      <Head>
        <title>DLottery</title>
        <meta name="description" content="A smart contract lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <LotteryEntrance />
    </div>
  );
}
