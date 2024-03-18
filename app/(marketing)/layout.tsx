import { Footer } from "./footer"
import { Header } from "./header"
import { Shantell_Sans } from 'next/font/google'

const fontScribe = Shantell_Sans({ subsets: ['latin'] })


type Props = {
    children: React.ReactNode
}

const MarketingLayout = ({children}: Props) => {
    return (
      <div className="min-h-screen flex flex-col" style={fontScribe.style}>
        <Header />
        <main className=" flex-1 flex flex-col items-center justify-center ">
          {children}
        </main>
        <Footer />
      </div>
    )
}

export default MarketingLayout