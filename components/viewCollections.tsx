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
        <div className="d-flex justify-content-center my-5">
            <>
                {isLoadingNFTs &&
                    <div className="spinner-grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                }
                {allCreatedNFTsByCurrentWallet?.length === 0 && isLoadingNFTs === false
                    ? <p> No NFTs created by your wallet found! </p>
                    : allCreatedNFTsByCurrentWallet?.map(nftItem => console.log(nftItem))
                }
            </>
        </div>
    </>
}

export default ViewCollections