import Link from 'next/link'
import { Navbar } from './_components/navbar'
import { Sidebar } from './_components/sidebar'

type LandingpageLayoutProps = {
  children: React.ReactNode
}

const LandingpageLayout = ({ 
    children 
}: LandingpageLayoutProps) => {

  return (
    <div className="h-full">
      {/* <div className="h-[80px]  fixed inset-y-0 w-full z-50">
        <Navbar />
      </div> */}
      {/* <div
        className="hidden md:flex h-full w-56 flex-col 
            fixed inset-y-0 z-50"
      >
        <Sidebar />
      </div> */}

      <main className="h-full">{children}</main>
    </div>
  )
}

export default LandingpageLayout
