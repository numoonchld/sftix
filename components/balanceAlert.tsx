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

    const reloadBalance = async () => {
        await connection.getBalance(publicKey!).then(
            data => setBalance(data)
        )
    }

    return <>
        <div
            className="alert alert-secondary my-5 d-flex justify-content-between align-items-center"
            role="alert"
        >
            Wallet Balance: {balance / LAMPORTS_PER_SOL} SOL
            <button
                type='button'
                className='btn btn-light'
                onClick={reloadBalance}
            >
                &#8635;
            </button>
        </div></>
}

export default BalanceAlert