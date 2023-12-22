
type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

type MainNavItem = NavItem

type MarketingConfig = {
  mainNav: MainNavItem[]
}



export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: 'Projekte',
      href: '/pricing',
    },
    {
      title: 'Blog',
      href: '/blog',
    },
  ],
}
