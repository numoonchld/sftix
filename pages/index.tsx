import Navbar from "@/components/navbar"
import Head from "next/head"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import CreateCollection from "@/components/createCollection";


export default function Home() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, connected, wallet, sendTransaction } = useWallet();


  useEffect(() => {

    if (publicKey !== null) {
      connection.getBalance(publicKey!).then(
        data => setBalance(data)
      );
    }

  }, [connection, publicKey])

  return (
    <>
      <main>
        <Head>
          <title>SFTix</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar />
        {connected &&
          <section className="container">
            Wallet Connected!
            <br />
            Wallet Balance: {balance / LAMPORTS_PER_SOL} SOL
            <CreateCollection />


          </section>
        }
      </main>
    </>
  )
}
