// @ts-nocheck
import { FC, useEffect, useState } from "react"
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
    CreateSftInput,
    MetaplexFile,
    CreateCandyMachineInput,
    Metadata,
    Nft,
    Sft,
    toBigNumber,
    toDateTime,
    sol
} from '@metaplex-foundation/js';
import Link from "next/link";

interface SFTPaneProps {
    sftItem: Metadata | Nft | Sft
}

const SFTPane: FC<SFTPaneProps> = ({ sftItem }) => {

    const CAPTCHA_NETWORK = new PublicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6");


    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();

    const collectionAuthority = wallet?.adapter

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

    const { uri } = sftItem

    const [eventName, setEventName] = useState('')
    const [eventVenue, setEventVenue] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [eventImage, setEventImage] = useState('')
    const [eventTicketPrice, setEventTicketPrice] = useState('')
    const [eventSFTAddress, setEventSFTAddress] = useState('')
    const [eventCandyMachineExists, setEventCandyMachineExists] = useState(false)
    const [eventSFTMetadataJSON, setEventSFTMetadataJSON] = useState<JsonMetadata>({})


    const getMetadata = async () => {
        const metadataResponse = await fetch(uri)
        const metadataJSON: JsonMetadata = await metadataResponse.json()

        setEventName(metadataJSON.name)
        setEventVenue(metadataJSON.attributes[0].value)
        setEventDate(metadataJSON.attributes[1].value)
        setEventImage(metadataJSON.image)
        // @ts-ignore
        setEventSFTAddress(sftItem.mintAddress.toString())
        setEventSFTMetadataJSON(metadataJSON)

        if (metadataJSON?.attributes[2]?.value !== "") {
            setEventCandyMachineExists(true)
        } else {
            setEventCandyMachineExists(false)
        }

        setEventTicketPrice(metadataJSON.attributes[3].value)

    }

    const handleCreateCandyMachine = async () => {

        const SFTMintAddress = sftItem.mintAddress.toString()

        if (eventSFTMetadataJSON) {
            // @ts-ignore
            const candyMachineAttribute = eventSFTMetadataJSON.attributes.find(attribute => attribute.trait_type === "Candy machine ID")
            console.log({ candyMachineAttribute })

            if (candyMachineAttribute.value === '') {
                console.log('Candy machine not already created! - proceeding with creating candy machine!')
                const eventCapacityAttribute = eventSFTMetadataJSON.attributes.find(attribute => attribute.trait_type === "Event capacity")
                const itemsAvailableEventCapacity = eventCapacityAttribute ? parseInt(eventCapacityAttribute.value) : 1000

                const eventTicketPriceAttribute = eventSFTMetadataJSON.attributes.find(attribute => attribute.trait_type === "Event ticket price in SOL")
                const eventTicketPriceInSOL = eventCapacityAttribute ? eventTicketPriceAttribute.value.toString() : `1.5`
                setEventTicketPrice(eventTicketPriceInSOL)

                const eventSFT = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(SFTMintAddress) })


                const candyMachineCreateOptions: CreateCandyMachineInput = {
                    itemsAvailable: toBigNumber(itemsAvailableEventCapacity),
                    sellerFeeBasisPoints: 0, // 3.33%
                    collection: {
                        address: new PublicKey(eventSFT.collection?.address.toString()),
                        updateAuthority: metaplex.identity(),
                    },
                    guards: {
                        endDate: {
                            date: toDateTime(`${eventDate}T00:00:00.000Z`),
                        },
                        solPayment: {
                            amount: sol(parseFloat(eventTicketPriceInSOL)),
                            destination: metaplex.identity().publicKey,
                        },
                    }
                }
                console.log({ candyMachineCreateOptions })
                const { candyMachine } = await metaplex.candyMachines().create(candyMachineCreateOptions)

                console.log({ candyMachine })

                console.log(candyMachine.address.toString())

                const newSFTMetadataJSON = {
                    ...eventSFTMetadataJSON,
                    attributes: [
                        {
                            trait_type: "Event location",
                            value: `${eventVenue}`
                        }, {
                            trait_type: "Event date",
                            value: `${eventDate}`
                        },
                        {
                            trait_type: "Candy machine ID",
                            value: `${candyMachine.address.toString()}`
                        }, {
                            trait_type: "Event ticket price in SOL",
                            value: `${eventTicketPriceInSOL}`
                        }, {
                            trait_type: "Event capacity",
                            value: `${itemsAvailableEventCapacity}`
                        }
                    ]
                }

                const { uri: newUri } = await metaplex.nfts().uploadMetadata(newSFTMetadataJSON);

                await metaplex.nfts().update({
                    nftOrSft: eventSFT,
                    uri: newUri
                })

                window.alert('Successfully added to ticket counter!')
                setEventCandyMachineExists(true)
            }
        }


    }

    useEffect(() => {
        getMetadata()
    }, [])

    return <>
        <article className="card bg-dark text-light w-100 d-flex mb-3">
            <div
                className="d-flex flex-row justify-content-between align-items-start w-100 pt-4 px-5 mb-3"
            >
                <div>
                    {eventName}
                    <br />
                    <Link
                        href={`https://explorer.solana.com/address/${eventSFTAddress}?cluster=devnet`}
                        target="_blank"
                    >
                        View on Solana Explorer
                    </Link>

                </div>
                <div>
                    Venue: {eventVenue}
                    <br />
                    Date: {eventDate}
                </div>
                <div>
                    Ticket price:
                    <br />
                    {eventTicketPrice} SOL
                </div>
            </div>
            {!eventCandyMachineExists && <button
                onClick={handleCreateCandyMachine}
                className="btn btn-success mb-3 mx-3"
            >
                Add to ticket counter
            </button>}
        </article>
    </>
}

export default SFTPane