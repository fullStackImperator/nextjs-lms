import Image from 'next/image'
import { Loader } from 'lucide-react'
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export const Header = () => {
  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mishn_hh.png" height={70} width={70} alt="Mascot" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-600 tracking-wide">
              MiSHN
            </h1>
            <p className="text-base text-muted-foreground">
              Makerspaces in Schulen Hamburg Netzwerk
            </p>
          </div>
        </div>
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            >
              <Button size="lg" variant="game_primary" className='text-2xl'>
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  )
}
