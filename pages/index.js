import Head from "next/head";
import ManualHeader from "../components/ManualHeader";

export default function Home() {
  return (
    <div>
      <Head>
        <title>DLottery</title>
        <meta name="description" content="A smart contract lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManualHeader />
    </div>
  );
}
