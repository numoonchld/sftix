import { FC, useState, useEffect } from "react"

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


export default CollectionPane