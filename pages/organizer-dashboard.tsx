import { FC } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import ViewCollections from '@/components/viewCollections'
import CreateCollection from '@/components/createCollection'
import BalanceAlert from '@/components/balanceAlert';

const OrganizerDashboard: FC = () => {
    const { connection } = useConnection();
    const { publicKey, connected, wallet, sendTransaction } = useWallet();

    return <>{connected &&
        <section className="container">
            <BalanceAlert />
            <ViewCollections />
            <CreateCollection />
        </section>
    }</>
}

export default OrganizerDashboard