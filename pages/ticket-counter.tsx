import { FC } from 'react'
import { useWallet } from '@solana/wallet-adapter-react';
import ConnectWallet from '@/components/connectWallet'
import BalanceAlert from '@/components/balanceAlert';
import ShowAllTours from '@/components/showAllTours';



const TicketCounter: FC = () => {
    const { connected } = useWallet();

    return <>
        {!connected && <ConnectWallet />}
        {connected &&
            <section className="container">
                <BalanceAlert />
                <ShowAllTours />
            </section>
        }</>
}

export default TicketCounter