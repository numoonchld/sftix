import { FC } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import ViewCollections from '@/components/viewCollections'
import CreateCollection from '@/components/createCollection'
import ConnectWallet from '@/components/connectWallet'
import BalanceAlert from '@/components/balanceAlert';
import OrganizerRegistration from '@/components/organizerRegistration';

const OrganizerDashboard: FC = () => {
    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();

    return <>
        {!connected && <ConnectWallet />}
        {connected &&
            <section className="container">
                <BalanceAlert />
                <OrganizerRegistration />
                <ViewCollections />
                <CreateCollection />
            </section>
        }
    </>
}

export default OrganizerDashboard