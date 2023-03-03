import Navbar from "@/components/navbar"
import Head from "next/head"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

declare const window: any;


export default function Home() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, connected, sendTransaction } = useWallet();


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
          <section className="">
            <div className="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="d-flex">
                <div className="toast-body">
                  Hello, world! This is a toast message.
                </div>
                <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
            </div>
            Wallet Connected!
            <br />
            Wallet Balance: {balance / LAMPORTS_PER_SOL} SOL
          </section>
        }
      </main>
    </>
  )
}
