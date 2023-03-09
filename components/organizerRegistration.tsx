import { FC, useEffect, useState } from "react"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import kp from '../public/assets/event-organizer-storage-account.json'

declare const window: any;

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

const programID = new PublicKey("3jzh7PNNdypeTQiDgxHJxxatdReKWdzEpByZKAupT44g");

const preflightCommitment = 'processed'
const commitment = 'processed'

const OrganizerRegistration: FC = () => {
    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();
    const [mustDisableRegisterButton, setMustDisableRegisterButton] = useState(false)


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

    const handleEventOrganizerRegistration = async () => {
        const program = await getProgram();
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey)
        // @ts-ignore
        const walletAddressesOnStorage = account.eventOrganizersVec.map((address: any) => address.toString())
        const currentWalletAddress = publicKey?.toString()

        // console.log({ walletAddressesOnStorage, currentWalletAddress })
        // console.log(walletAddressesOnStorage.includes(currentWalletAddress))

        console.log({ getProviderPublicKey: getProvider().publicKey.toString() })

        if (!(walletAddressesOnStorage.includes(currentWalletAddress))) {
            await program.rpc.registerEventOrganizer({
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: getProvider().publicKey,
                },
            })
            setMustDisableRegisterButton(false)

        }
        else {
            setMustDisableRegisterButton(true)
        }
    }

    const fetchRegistrationData = async () => {
        const program = await getProgram();
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey)
        // @ts-ignore
        const walletAddressesOnStorage = account.eventOrganizersVec.map((address: any) => address.toString())
        const currentWalletAddress = publicKey?.toString()

        if (!(walletAddressesOnStorage.includes(currentWalletAddress))) {
            setMustDisableRegisterButton(false)
        } else {
            setMustDisableRegisterButton(true)
        }

    }

    // TO DO: Add useEffect to auto load registration status
    useEffect(() => {
        fetchRegistrationData()
    }, [window.solana.publicKey.toString()])

    return <>
        {mustDisableRegisterButton ? null : <>

            <button
                className="btn btn-success w-100"
                onClick={handleEventOrganizerRegistration}
                disabled={mustDisableRegisterButton}
            >
                Register wallet
            </button>

        </>
        }
    </>

}

export default OrganizerRegistration