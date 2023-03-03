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
            <nav className="navbar navbar-expand-md navbar-light bg-light px-3">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
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
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item active">
                            <Link className="navbar-brand nav-link" href="/">
                                Ticket counter
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="navbar-brand nav-link" href="/organizer-dashboard">
                                Organizer dashboard
                            </Link>
                        </li>

                    </ul>
                    <div style={{ marginLeft: "auto" }}>
                        <WalletMultiButtonDynamic />
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar