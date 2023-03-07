import { FC, useEffect, useState } from "react"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import {
    bundlrStorage,
    keypairIdentity,
    walletAdapterIdentity,
    Metaplex,
    toMetaplexFileFromBrowser,
    CreatorInput,
    KeypairSigner,
    JsonMetadata,
    CreateSftInput,
    MetaplexFile,
    Metadata,
    Nft,
    Sft,
} from '@metaplex-foundation/js';


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
    const [allCollectionNFTs, setAllCollectionNFTs] = useState<(Metadata<JsonMetadata<string>> | Nft | Sft)[]>([])

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


    const getAllWalletAddressesOnStorage = async () => {
        const program = await getProgram();
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey)
        // @ts-ignore
        const walletAddressesOnStorage = await account.eventOrganizersVec.map((address: any) => address.toString())
        setAllWalletAddressesOnStorage(walletAddressesOnStorage)
        console.log({ allWalletAddressesOnStorage })
    }


    const getAllToursForEachWallet = async () => {
        console.log('Getting all tours for each wallet...')

        const collectionAuthority = wallet?.adapter!

        const metaplex = Metaplex.make(connection)
            .use(
                walletAdapterIdentity(collectionAuthority)
            )
            .use(
                bundlrStorage(
                    {
                        address: 'https://devnet.bundlr.network',
                        providerUrl: 'https://api.devnet.solana.com',
                        timeout: 60000,
                    }
                )
            )

        let newSetOfCollectionNFTs: (Metadata<JsonMetadata<string>> | Nft | Sft)[] = []
        console.log({ newSetOfCollectionNFTs })
        for await (const address of allWalletAddressesOnStorage) {
            console.log({ address })
            const allCreatedNFTsForAddress = await metaplex.nfts().findAllByCreator({ creator: address! });
            console.log({ allCreatedNFTsForAddress })
            newSetOfCollectionNFTs = newSetOfCollectionNFTs.concat(allCreatedNFTsForAddress)
            console.log({ newSetOfCollectionNFTs })

        }
        setAllCollectionNFTs(newSetOfCollectionNFTs)


    }

    // TO-DO: Load all venues 

    useEffect(() => {

        getAllWalletAddressesOnStorage()
    }, [])

    useEffect(() => {

        getAllToursForEachWallet()
    }, [allWalletAddressesOnStorage])

    useEffect(() => {

        console.log({ allCollectionNFTs })
    }, [allCollectionNFTs])

    return <>
        <div
            className="card"
        >
            {allWalletAddressesOnStorage.map((address) => <p key={address}>{address}</p>)}
        </div>
    </>
}

export default ShowAllTours