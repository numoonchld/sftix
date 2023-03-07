import { FC, useEffect, useState } from "react"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';

import kp from '../public/assets/event-organizer-storage-account.json'

declare const window: any;

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

const programID = new PublicKey("3jzh7PNNdypeTQiDgxHJxxatdReKWdzEpByZKAupT44g");

const preflightCommitment = 'processed'
const commitment = 'processed'

const ShowAllTours: FC = () => {

    const [allWalletAddressesOnStorage, setAllWalletAddressesOnStorage] = useState([])

    const { connection } = useConnection();

    const getProvider = () => {
        // const connection = new Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(
            connection, window.solana, { preflightCommitment, commitment },
        );
        return provider;
    }

    const getProgram = async () => {
        // Get metadata about your solana program
        const idl = await Program.fetchIdl(programID, getProvider());
        // Create a program that you can call
        return new Program(idl!, programID, getProvider());
    };

    const getAllWalletAddressesOnStorage = async () => {
        const program = await getProgram();
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey)
        // @ts-ignore
        const walletAddressesOnStorage = account.eventOrganizersVec.map((address: any) => address.toString())
        setAllWalletAddressesOnStorage(walletAddressesOnStorage)
    }


    useEffect(() => {
        getAllWalletAddressesOnStorage()
    })

    return <>
        <div
            className="card"
        >
            {allWalletAddressesOnStorage.map((address) => <p key={address}>{address}</p>)}
        </div>
    </>
}

export default ShowAllTours