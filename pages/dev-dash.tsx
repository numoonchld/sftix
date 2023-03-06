import { FC } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import ConnectWallet from '@/components/connectWallet'
import BalanceAlert from '@/components/balanceAlert';
import kp from '../public/assets/event-organizer-storage-account.json'

// console.log(kp)

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

const programID = new PublicKey("3jzh7PNNdypeTQiDgxHJxxatdReKWdzEpByZKAupT44g");

const DevDash: FC = () => {
    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();

    return <>
        {!connected && <ConnectWallet />}
        {connected &&
            <section className="container">
                <BalanceAlert />
            </section>
        }</>
}

export default DevDash