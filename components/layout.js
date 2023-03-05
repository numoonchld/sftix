
import Navbar from './navbar'
// import Footer from './footer'
import Head from "next/head"

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>SFTix</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Navbar />
            <main>{children}</main>
            {/* <Footer /> */}
        </>
    )
}