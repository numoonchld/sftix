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
import Loading from "./loading";
import TourTicketCounter from "./tourTicketCounter";

declare const window: any;

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

const programID = new PublicKey("3jzh7PNNdypeTQiDgxHJxxatdReKWdzEpByZKAupT44g");

const preflightCommitment = 'processed'
const commitment = 'processed'

const ShowAllTours: FC = () => {

    const [allWalletAddressesOnStorage, setAllWalletAddressesOnStorage] = useState([])
    const [allWalletNFTs, setAllWalletNFTs] = useState<(Metadata<JsonMetadata<string>> | Nft | Sft)[]>([])

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

    const [isLoading, setIsLoading] = useState(false)

    const getAllWalletAddressesOnStorage = async () => {
        setIsLoading(true)
        const program = await getProgram();
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey)
        // @ts-ignore
        const walletAddressesOnStorage = await account.eventOrganizersVec.map((address: any) => address.toString())
        setAllWalletAddressesOnStorage(walletAddressesOnStorage)
        // console.log({ allWalletAddressesOnStorage })
        setIsLoading(false)
    }


    const getAllNFTsForEachWallet = async () => {
        setIsLoading(true)
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
            // console.log({ address })
            const allCreatedNFTsForAddress = await metaplex.nfts().findAllByCreator({ creator: address! });
            // console.log({ allCreatedNFTsForAddress })
            newSetOfCollectionNFTs = newSetOfCollectionNFTs.concat(allCreatedNFTsForAddress)
            // console.log({ newSetOfCollectionNFTs })

        }
        setAllWalletNFTs(newSetOfCollectionNFTs)
        setIsLoading(false)

    }


    // separate out tours based on symbols

    const [tourSymbolsDirectory, setTourSymbolsDirectory] = useState([])

    const getTourSymbolsDirectory = async () => {
        setIsLoading(true)
        const tourCollectionNFTs = allWalletNFTs.filter(walletNFT => walletNFT.collection === null)
        console.log({ tourCollectionNFTs })
        const newTourSymbolDirectory = tourCollectionNFTs
            .map(tourCollectionNFT => {
                return {
                    tourSymbol: tourCollectionNFT.symbol,
                    tourName: tourCollectionNFT.name,
                    tourEvents: allWalletNFTs
                        .filter(walletNFT => walletNFT.collection !== null && walletNFT.symbol === tourCollectionNFT.symbol)
                }
            })

        // @ts-ignore
        setTourSymbolsDirectory(newTourSymbolDirectory)
        console.log({ tourSymbolsDirectory })
        setIsLoading(false)
    }

    // TO-DO: Load all venues 

    useEffect(() => {

        getAllWalletAddressesOnStorage()
    }, [])

    useEffect(() => {

        getAllNFTsForEachWallet()
    }, [allWalletAddressesOnStorage])

    useEffect(() => {

        // console.log({ allWalletNFTs })
        getTourSymbolsDirectory()

    }, [allWalletNFTs])

    return <>
        <div
            className="card"
        >
            {/* {allWalletAddressesOnStorage.map((address) => <p key={address}>{address}</p>)} */}
            <h2
                className="m-3"
            > <u>Tours we have tickets for</u> </h2>
            {isLoading && <Loading />}
            {
                // @ts-ignore
                tourSymbolsDirectory.map(tour => <TourTicketCounter key={tour.tourSymbol} tourDetails={tour} />)
            }
        </div>
    </>
}

export default ShowAllTours