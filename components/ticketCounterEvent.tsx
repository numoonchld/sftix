import { FC, useEffect, useState } from "react"
import { PublicKey } from '@solana/web3.js';
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

// @ts-ignore
const TicketCounterEvent: FC = ({ eventDetails }) => {
    // console.log({ eventDetails })
    // const mintAddress = eventDetails.mintAddress.toString()
    const metadataJSONURI = eventDetails.uri
    // console.log({ mintAddress, metadataJSONURI })

    const [areTicketsForSale, setAreTicketsForSale] = useState(false)
    const [candyMachineAddress, setCandyMachineAddress] = useState('')

    const getCandyMachineAddress = async () => {
        const metadataJSONURIFetchResponse = await fetch(metadataJSONURI)
        const metadataJSON = await metadataJSONURIFetchResponse.json()

        console.log({ metadataJSON })

        const extractCandyMachineAddress = metadataJSON.attributes[2].value
        console.log({ extractCandyMachineAddress })
        setCandyMachineAddress(extractCandyMachineAddress.toString())

        // console.log({ candyMachineAddress })

        // setAreTicketsForSale(candyMachineAddress === '' ? false : true)

    }

    const [cleanEventName, setCleanEventName] = useState('')
    const [enableMintTicketButton, setEnableMintTicketButton] = useState(false)

    useEffect(() => {

        getCandyMachineAddress()
        setCleanEventName(eventDetails.name.split(' / ')[1])


    }, [])


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


    const [eventCandyMachineTicketCounter, setEventCandyMachineTicketCounter] = useState()
    const [eventCandyMachineCollectionUpdateAuthority, setEventCandyMachineCollectionUpdateAuthority] = useState('')

    const getCandyMachine = async () => {
        console.log({ candyMachineAddress })


        if (candyMachineAddress !== '') {

            const candyMachine = await metaplex
                .candyMachines()
                .findByAddress({ address: new PublicKey(candyMachineAddress) })

            console.log({ candyMachine })
            // @ts-ignore
            setEventCandyMachineTicketCounter(candyMachine)
            setEventCandyMachineCollectionUpdateAuthority(candyMachine.creators[0].address.toString())

            setEnableMintTicketButton(true)
            setAreTicketsForSale(true)
        }

    }

    useEffect(() => {

        getCandyMachine()


    }, [candyMachineAddress])

    const [mintButtonIsMinting, setMintButtonIsMinting] = useState(false)

    const handleMintTicket = async () => {
        setEnableMintTicketButton(false)
        // @ts-ignore
        console.log(eventCandyMachineTicketCounter.itemsAvailable.toString())
        // @ts-ignore
        console.log(eventCandyMachineTicketCounter.itemsMinted.toString())
        // @ts-ignore
        console.log(eventCandyMachineTicketCounter.itemsRemaining.toString())
        // @ts-ignore
        console.log(eventCandyMachineTicketCounter.maxEditionSupply.toString())
        // @ts-ignore
        console.log(eventCandyMachineTicketCounter.items[1])
        console.log('creator: ', eventCandyMachineCollectionUpdateAuthority)


        // @ts-ignore
        const { sft } = await metaplex.candyMachines().mint({
            // @ts-ignore
            candyMachine: eventCandyMachineTicketCounter,
            // @ts-ignore
            collectionUpdateAuthority: new PublicKey(eventCandyMachineCollectionUpdateAuthority)
        })


        console.log(sft)


        setEnableMintTicketButton(true)
    }

    return <>
        <div className="card my-3 p-3 bg-dark text-light">
            <h3> {cleanEventName}  </h3>
            {areTicketsForSale && <>
                <p> Tickets are for sale! </p>
                <p> {candyMachineAddress} </p>
                <button
                    className="btn btn-success w-100"
                    onClick={handleMintTicket}
                    disabled={!enableMintTicketButton}
                >
                    Mint ticket
                </button>
            </>}
            {!areTicketsForSale && <>
                <p> Check back later! </p>
            </>}
        </div>
    </>
}

export default TicketCounterEvent