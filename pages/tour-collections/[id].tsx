import { FC, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
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


const TourCollections: FC = () => {
    const router = useRouter()
    console.log(router)
    const { id: collectionID } = router.query
    console.log(collectionID)

    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();

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

    const [tourCollectionNFT, setTourCollectionNFT] = useState<any>(null)

    const getTourCollectionNFTDetails = async () => {
        const tourCollectionNFTMintAddress = new PublicKey(collectionID!)
        setTourCollectionNFT(await metaplex.nfts().findByMint({ mintAddress: tourCollectionNFTMintAddress }));
    }

    useEffect(() => {
        getTourCollectionNFTDetails()
    }, [])
    useEffect(() => {
        console.log(tourCollectionNFT)
        console.log(metaplex.identity())
    }, [tourCollectionNFT])

    const [eventLocation, setEventLocation] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [eventCapacity, setEventCapacity] = useState('')
    const handleCreateTourEventSubmit = () => {

    }
    const getTodaysDate = () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        return `${yyyy}-${mm}-${dd}`
    }
    return <>
        <section
            className="d-flex flex-column align-items-center"
        >
            {tourCollectionNFT &&
                <div className="card my-5 w-75 d-flex flex-column align-items-center p-5">
                    <img
                        src={tourCollectionNFT.json.image}
                        width={250}
                        className="image-fluid"
                        al
                    />
                    <h3>{tourCollectionNFT.json.name}</h3>
                    <small>
                        <a href={`https://explorer.solana.com/address/${collectionID}?cluster=devnet`} target="_blank">
                            {collectionID}
                        </a>
                    </small>
                    <hr />


                </div>
            }


            <div
                className="card w-75">

                <div className="card-header">
                    Each tour has several events
                </div>
                <div className="card-body">
                    <h5 className="card-title">Create tour event</h5>
                    <form onSubmit={handleCreateTourEventSubmit}>
                        <div className="form-group mb-3">
                            <label
                                htmlFor="tourNameTextInput">
                                Event Location
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="tourNameTextInput"
                                aria-describedby="emailHelp"
                                placeholder=""
                                value={eventLocation}
                                onChange={e => setEventLocation(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label
                                htmlFor="artistNameTextInput">
                                Event date
                            </label>
                            <input
                                type="date"
                                min={getTodaysDate()}
                                className="form-control"
                                id="artistNameTextInput"
                                aria-describedby="emailHelp"
                                placeholder=""
                                value={eventDate}
                                onChange={e => setEventDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label
                                htmlFor="artistNameTextInput">
                                Event capactiy (6500 max)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="6500"
                                className="form-control"
                                id="artistNameTextInput"
                                aria-describedby="emailHelp"
                                placeholder=""
                                value={eventCapacity}
                                onChange={e => setEventCapacity(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >Create</button>
                    </form>
                </div>
            </div>
        </section>
    </>
}

export default TourCollections