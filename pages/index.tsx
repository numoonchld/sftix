import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from "react";

import CreateCollection from "@/components/createCollection";
import ViewCollections from "@/components/viewCollections";


export default function Home() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, connected, wallet, sendTransaction } = useWallet();




  return (
    <>

    </>
  )
}
