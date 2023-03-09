import Image from "next/image";
import { FC, useState, useEffect } from "react"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
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

import CollectionPane from "@/components/collectionPane";
import Loading from "./loading";


/*
interface CollectionPaneProps {
    nftItem: Metadata
}


const CollectionPane: FC<CollectionPaneProps> = ({ nftItem }) => {
    console.log({ nftItem })
    console.log('NFT mint address: ', nftItem.mintAddress.toString())
    const [isSFTixCollectionItem, setIsSFTixCollectionItem] = useState(false)
    const [tourName, setTourName] = useState('')
    const [tourSymbol, setTourSymbol] = useState('')
    const [tourDescription, setTourDescription] = useState('')
    const [tourImageURL, setTourImageURL] = useState('')
    const [NFTMintAddress] = useState(nftItem.mintAddress.toString())

    const getURIData = async () => {
        const URIData = await fetch(nftItem.uri)
        const URIDataJSON = await URIData.json()
        console.log({ URIDataJSON })
        const { description } = URIDataJSON

        console.log({ description })

        if (description.split(" => ")[0] === "SFTix") {
            setIsSFTixCollectionItem(true)
            setTourName(URIDataJSON.name)
            setTourSymbol(URIDataJSON.symbol)
            setTourDescription(URIDataJSON.description.split(" => ")[1])
            setTourImageURL(URIDataJSON.image)
        }
        else setIsSFTixCollectionItem(false)
    }

    useEffect(() => {
        getURIData()
    }, [])

    console.log(`Token Mint: https://explorer.solana.com/address/${NFTMintAddress}?cluster=devnet`)
    return isSFTixCollectionItem ? <>
        <div className="card p-3">
            <div className="d-flex flex-row">
                <img
                    style={{ objectFit: "cover" }}
                    className="img-fluid"
                    src={tourImageURL}
                    width={175}
                    height={175}
                    alt={`${tourSymbol} image`}
                />
                <div className="mx-3">
                    <h1 className="display-4">{tourSymbol}</h1>
                    <p className="lead">{tourName}</p>
                    <hr className="my-4" />
                    <p>{tourDescription}</p>
                    <p className="lead">
                        <a
                            className="btn btn-primary"
                            href={`https://explorer.solana.com/address/${NFTMintAddress}?cluster=devnet`}
                            role="button" target={"_blank"}
                        >
                            View on Solana Explorer
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </> : <></>

}
*/

const ViewCollections: FC = () => {

    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();

    const collectionAuthority = wallet?.adapter!
    // console.log('Create collection | wallet public key: ', collectionAuthority.publicKey?.toBase58())

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

    const [allCreatedNFTsByCurrentWallet, setAllCreatedNFTsByCurrentWallet] = useState<(Metadata<JsonMetadata<string>> | Nft | Sft)[]>()
    const [isLoadingNFTs, setIsLoadingNFTs] = useState(false)

    const getAllSFTixCollectionsForWallet = async () => {
        setIsLoadingNFTs(true)
        const allCreatedNFTs = await metaplex.nfts().findAllByCreator({ creator: collectionAuthority.publicKey! });
        console.log('all created nfts by current wallet: ', allCreatedNFTs)
        setAllCreatedNFTsByCurrentWallet(allCreatedNFTs)
        setIsLoadingNFTs(false)
    }

    useEffect(() => {
        getAllSFTixCollectionsForWallet()
    }, [connection, wallet])

    return <>
        <div className="card my-5">
            <div className="card-header">
                Tours registered with SFTix
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-start ">
                {isLoadingNFTs && <Loading />}
                {allCreatedNFTsByCurrentWallet?.length === 0 && isLoadingNFTs === false
                    && <p> No tours created by your wallet found! </p>
                }
                {allCreatedNFTsByCurrentWallet?.length !== 0 && isLoadingNFTs === false
                    // @ts-ignore
                    && allCreatedNFTsByCurrentWallet?.map(nftItem => <CollectionPane nftItem={nftItem} />)
                }
            </div>
        </div>
    </>
}

export default ViewCollections