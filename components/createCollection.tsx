import { FC } from "react"
import { Keypair } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    bundlrStorage,
    keypairIdentity,
    walletAdapterIdentity,
    Metaplex,
    CreatorInput,
    KeypairSigner,
    JsonMetadata,
    CreateSftInput
} from '@metaplex-foundation/js';


const CreateCollection: FC = () => {
    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();

    // const collectionAuthority = Keypair.generate();
    const collectionAuthority = wallet?.adapter!
    console.log('Create collection | wallet public key: ', collectionAuthority.publicKey?.toBase58())
    const metaplex = Metaplex.make(connection)
        .use(
            walletAdapterIdentity(wallet?.adapter!)
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

    return <>
        <div className="card my-5">
            <div className="card-header">
                Collection NFT
            </div>
            <div className="card-body">
                <h5 className="card-title">Create tour </h5>
                <form>
                    <div className="form-group mb-5">
                        <label htmlFor="exampleInputEmail1">Tour name</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="" />
                        <small id="emailHelp" className="form-text text-muted">(Each tour is a Collection NFT)</small>
                    </div>
                    <div className="form-group mb-5">
                        <div className="custom-file row">
                            <label className="custom-file-label" htmlFor="inputGroupFile01">Choose tour artwork</label>
                            <input type="file" className="custom-file-input float-right mx-auto" id="inputGroupFile01" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </form>
            </div>
        </div>
    </>
}

export default CreateCollection