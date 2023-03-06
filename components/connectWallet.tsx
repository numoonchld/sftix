import { FC } from 'react'
import dynamic from "next/dynamic";


const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

const ConnectWallet: FC = () => {


    return <>            <div
        className='w-100 d-flex justify-content-center align-items-center bg-white'
        style={{ height: "91.5vh" }}
    >
        <WalletMultiButtonDynamic />
    </div>
    </>;

}

export default ConnectWallet