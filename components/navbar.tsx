import Image from 'next/image'
import Link from 'next/link'

import { FC } from "react"
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

const Navbar: FC = () => {
    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/">
                        <Image
                            src="/logo-dark.png"
                            alt=""
                            width="48"
                            height="48"
                            className=""
                            priority
                        />
                    </Link>
                    {/* <WalletMultiButtonDynamic className={styles["wallet-adapter-button-trigger"]} /> */}
                    <WalletMultiButtonDynamic />
                </div>
            </nav>
        </>
    )
}

export default Navbar