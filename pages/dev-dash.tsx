import { FC, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import ConnectWallet from '@/components/connectWallet'
import BalanceAlert from '@/components/balanceAlert';
import kp from '../public/assets/event-organizer-storage-account.json'

declare const window: any;

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;


// const network = clusterApiUrl('devnet');

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

const programID = new PublicKey("3jzh7PNNdypeTQiDgxHJxxatdReKWdzEpByZKAupT44g");

const preflightCommitment = 'processed'
const commitment = 'processed'


const DevDash: FC = () => {
    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();

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

    const getEventOrganizersAddressVector = async () => {
        try {
            const program = await getProgram();
            const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

            console.log("Got the account", account)


        } catch (error) {
            console.log("Error in getEventOrganizersAddressVector: ", error)

        }
    }

    const createEventOrganizersAddressVectorStorageAccount = async () => {
        try {
            const provider = getProvider();
            const program = await getProgram();

            console.log("Trying storage account creation!")
            await program.rpc.initialize({
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [baseAccount]
            });
            console.log("Created a new storage BaseAccount w/ address:", baseAccount.publicKey.toString())
            await getEventOrganizersAddressVector()

        } catch (error) {
            console.log("Error creating storage BaseAccount account:", error)
        }
    }

    useEffect(() => {
        if (connected) {
            getEventOrganizersAddressVector()
        }
    }, [connection])

    return <>
        {!connected && <ConnectWallet />}
        {connected &&
            <section className="container">
                <h1 className='text-center mt-5 text-danger bg-white'> CAUTION! </h1>
                <BalanceAlert />
                <div>
                    <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={createEventOrganizersAddressVectorStorageAccount}
                    >
                        Initialize / Re-initialize Storage Account
                    </button>
                </div>
            </section >
        }</>
}

export default DevDash