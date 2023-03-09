import { FC, useEffect, useState } from "react"

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
import Link from "next/link";

interface SFTPaneProps {
    sftItem: Metadata | Nft | Sft
}

const SFTPane: FC<SFTPaneProps> = ({ sftItem }) => {
    console.log({ sftItem })

    const { uri } = sftItem

    const [eventName, setEventName] = useState('')
    const [eventVenue, setEventVenue] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [eventImage, setEventImage] = useState('')
    const [eventSFTAddress, setEventSFTAddress] = useState('')
    const [eventSFTMetadataJSON, setEventSFTMetadataJSON] = useState(null)


    const getMetadata = async () => {
        const metadataResponse = await fetch(uri)
        const metadataJSON = await metadataResponse.json()
        console.log({ metadataJSON })
        setEventName(metadataJSON.name)
        setEventVenue(metadataJSON.attributes[0].value)
        setEventDate(metadataJSON.attributes[1].value)
        setEventImage(metadataJSON.image)
        // @ts-ignore
        setEventSFTAddress(sftItem.mintAddress.toString())
        setEventSFTMetadataJSON(metadataJSON)

    }

    const handleCreateCandyMachine = async () => {
        
    }

    useEffect(() => {
        getMetadata()
    }, [])

    return <>
        <article className="card bg-dark text-light w-100 d-flex s">
            <div
                className="d-flex flex-row justify-content-between align-items-start w-100 pt-4 px-5"
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
                    <br />

                </div>
                <div>
                    Venue: {eventVenue}
                    <br />
                    Date: {eventDate}
                </div>

            </div>
            <button
                onClick={handleCreateCandyMachine}
                className="btn btn-success m-3"
            >
                Add to ticket counter
            </button>
        </article>
    </>
}

export default SFTPane