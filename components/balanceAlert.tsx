import { FC, useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const BalanceAlert: FC = () => {
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

    return <>
        <div className="alert alert-secondary my-5" role="alert">
            Wallet Balance: {balance / LAMPORTS_PER_SOL} SOL
        </div></>
}

export default BalanceAlert