import { FC, ChangeEvent, FormEvent, useState } from "react"
// import { Keypair } from "@solana/web3.js";
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
    CreateNftInput,
    CreateSftInput,
    MetaplexFile,
    NftWithToken,
    Nft,
} from '@metaplex-foundation/js';

interface Event<T = EventTarget> {
    target: T;
}


const CreateCollection: FC = () => {
    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();

    // const collectionAuthority = Keypair.generate();
    const collectionAuthority = wallet?.adapter!
    // const collectionAuthority = wallet!
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

    const [tourName, setTourName] = useState('')
    const [artistName, setArtistName] = useState('')
    const [tourArtworkFile, setTourArtworkFile] = useState<MetaplexFile>()

    const handleTourArtworkUpload = async (event: Event<HTMLInputElement>) => {
        setTourArtworkFile(await toMetaplexFileFromBrowser(event.target.files![0]))
    }

    const handleCreateTourSubmit = async (event: FormEvent) => {
        event.preventDefault()

        /* create a collection NFT for each tour */
        const collectionName = `${tourName} - ${artistName}`
        const collectionSymbol = `${tourName.split(' ').map(piece => piece[0]).join('')}${artistName.split(' ').map(piece => piece[0]).join('')}`
        const sellerFeeBasisPoints = 100

        // upload image to metaplex storage to obtain URI
        const tourArtworkImageURI = await metaplex.storage().upload(tourArtworkFile!)
        console.log("tour artwork uri:", tourArtworkImageURI)

        // metadata for tour's collection-NFT
        const collectionNFTJSONMetadata: JsonMetadata = {
            name: collectionName,
            symbol: collectionSymbol,
            description: `SFTix => Metadata upload for ${tourName} tour artwork`,
            image: tourArtworkImageURI,
        }
        console.log({ collectionNFTJSONMetadata })

        const { uri, metadata } = await metaplex
            .nfts()
            .uploadMetadata(collectionNFTJSONMetadata);
        console.log('Collection NFT metadata and URI: ', uri, metadata)

        // tour's collection-NFT to hold event-NFTs
        const createCollectionNFTInput: CreateNftInput = {
            uri,
            name: collectionName,
            symbol: collectionSymbol,
            sellerFeeBasisPoints,
            isCollection: true,
        }

        const { nft } = await metaplex
            .nfts()
            .create(createCollectionNFTInput)

        console.log(
            `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
        )


    }

    return <>
        <div className="card my-5">
            <div className="card-header">
                Each tour is a Collection-NFT
            </div>
            <div className="card-body">
                <h5 className="card-title">Create tour</h5>
                <form onSubmit={handleCreateTourSubmit}>
                    <div className="form-group mb-3">
                        <label
                            htmlFor="tourNameTextInput">
                            Tour name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="tourNameTextInput"
                            aria-describedby="emailHelp"
                            placeholder=""
                            value={tourName}
                            onChange={e => setTourName(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label
                            htmlFor="artistNameTextInput">
                            Artist name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="artistNameTextInput"
                            aria-describedby="emailHelp"
                            placeholder=""
                            value={artistName}
                            onChange={e => setArtistName(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-5">
                        <div className="custom-file row">
                            <label
                                className="custom-file-label"
                                htmlFor="tourArtworkFileUpload">
                                Choose tour artwork
                            </label>
                            <input
                                type="file"
                                className="custom-file-input"
                                id="tourArtworkFileUpload"
                                accept=".gif, .jpg, .png,"
                                onChange={handleTourArtworkUpload}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >Create</button>
                </form>
            </div>
        </div>
    </>
}

export default CreateCollection