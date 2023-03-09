import React, { FC, useEffect, FormEvent, useState } from "react"
import { useRouter } from "next/router"
import { Connection, PublicKey, clusterApiUrl, } from '@solana/web3.js';
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
    Sft,
    toBigNumber,
    Metadata
} from '@metaplex-foundation/js';
import SFTPane from "@/components/SFTPane";
import Loading, { LoadingLight } from "@/components/loading";

interface Event<T = EventTarget> {
    target: T;
}


const TourCollections: FC = () => {
    const router = useRouter()
    const { id: collectionID } = router.query


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

    const [allCreatedNFTsByCurrentWallet, setAllCreatedNFTsByCurrentWallet] = useState<(Metadata<JsonMetadata<string>> | Nft | Sft)[]>()
    const [onlySFTByCurrentWallet, setOnlySFTByCurrentWallet] = useState<(Metadata<JsonMetadata<string>> | Nft | Sft)[]>()
    const [isLoadingSFTs, setIsLoadingSFTs] = useState(false)

    const getAllSFTixCollectionsForWallet = async () => {
        setIsLoadingSFTs(true)
        const allCreatedNFTs = await metaplex.nfts().findAllByCreator({ creator: collectionAuthority.publicKey! });
        console.log('all created nfts by current wallet: ', allCreatedNFTs)
        const onlySFTFilter = allCreatedNFTs
            .filter(
                nftItem => nftItem.name.substring(0, 3) === 'SFT' && nftItem.symbol === tourCollectionNFT.symbol
            )
        console.log('all SFT by current wallet: ', onlySFTFilter)
        setAllCreatedNFTsByCurrentWallet(allCreatedNFTs)
        setOnlySFTByCurrentWallet(onlySFTFilter)
        setIsLoadingSFTs(false)
    }

    useEffect(() => {
        getTourCollectionNFTDetails()
    }, [])

    useEffect(() => {
        console.log({ tourCollectionNFT })
        console.log('metaplex identity: ', metaplex.identity())
        getAllSFTixCollectionsForWallet()

    }, [tourCollectionNFT])

    const [eventLocation, setEventLocation] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [eventCapacity, setEventCapacity] = useState('')
    const [isCreatingEvent, setIsCreatingEvent] = useState(false)

    const handleCreateTourEventSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setIsCreatingEvent(true)
        console.log('Begin submitting new tour event!')
        console.log(tourCollectionNFT.json)
        console.log(eventLocation)
        console.log(eventDate)
        console.log(eventCapacity)

        const eventName = `SFT / ${tourCollectionNFT.json.symbol} - ${eventLocation}`
        const eventSymbol = `${tourCollectionNFT.json.symbol}`

        // metadata for tour's collection-NFT
        const eventSFTJSONMetadata: JsonMetadata = {
            name: eventName,
            symbol: eventSymbol,
            description: `SFTix => Metadata upload for ${eventName} ticket SFT`,
            image: tourCollectionNFT.json.image,
            attributes: [{
                trait_type: "Event location",
                value: `${eventLocation}`
            }, {
                trait_type: "Event data",
                value: `${eventDate}`

            }]
        }
        console.log({ eventSFTJSONMetadata })

        const { uri, metadata } = await metaplex
            .nfts()
            .uploadMetadata(eventSFTJSONMetadata);
        console.log('Event SFT metadata and URI: ', uri, metadata)

        // event's ticket-SFT
        const createEventSFTInput: CreateSftInput = {
            uri,
            name: eventName,
            symbol: eventSymbol,
            sellerFeeBasisPoints: 333,
            maxSupply: toBigNumber(eventCapacity),
            collection: new PublicKey(collectionID!),
            isCollection: true,
            collectionAuthority: metaplex.identity(),

        }

        const { nft } = await metaplex
            .nfts()
            .create(createEventSFTInput)

        console.log(
            `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
        )

        setIsCreatingEvent(false)
        getAllSFTixCollectionsForWallet()

    }
    const getTodaysDate = () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            // @ts-ignore
            dd = '0' + dd;
        }

        if (mm < 10) {
            // @ts-ignore
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
                    />
                    <h3>{tourCollectionNFT.json.name}</h3>
                    <small>
                        <a href={`https://explorer.solana.com/address/${collectionID}?cluster=devnet`} target="_blank">
                            {collectionID}
                        </a>
                    </small>
                    <hr />

                    <div className="d-flex flex-column justify-content-center align-items-start w-100">
                        <h4> <u> Events in this tour </u> </h4>
                        {isLoadingSFTs && <Loading />}
                        {onlySFTByCurrentWallet?.length === 0 && isLoadingSFTs === false
                            && <p> No events have been created for this tour! </p>
                        }
                        {onlySFTByCurrentWallet?.map(SFT => <React.Fragment key={SFT.address.toString()}><SFTPane sftItem={SFT} /></React.Fragment>)}
                    </div>

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
                                htmlFor="locationNameTextInput">
                                Event Location
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="locationNameTextInput"
                                aria-describedby="locationName"
                                placeholder=""
                                value={eventLocation}
                                onChange={e => setEventLocation(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label
                                htmlFor="eventDateInput">
                                Event date
                            </label>
                            <input
                                type="date"
                                min={getTodaysDate()}
                                className="form-control"
                                id="eventDateInput"
                                aria-describedby="eventDate"
                                placeholder=""
                                value={eventDate}
                                onChange={e => setEventDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label
                                htmlFor="eventCapacityNumberInput">
                                Event capacity (6500 max)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="6500"
                                className="form-control"
                                id="eventCapacityNumberInput"
                                aria-describedby="evnetCapacity"
                                placeholder=""
                                value={eventCapacity}
                                onChange={e => setEventCapacity(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label
                                htmlFor="entryFeeTextInput">
                                Entry Fee (SOL per ticket)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="entryFeeTextInput"
                                aria-describedby="entryFee"
                                placeholder=""
                                value={eventCapacity}
                                onChange={e => setEventCapacity(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                        >
                            {isCreatingEvent && <LoadingLight />}
                            {!isCreatingEvent && `Create`}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    </>
}

export default TourCollections