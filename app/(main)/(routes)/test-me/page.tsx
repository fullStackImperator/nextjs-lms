import type { Metadata } from 'next'
import Playground from './_components/playground'

export const metadata: Metadata = {
  title: 'Playground | Math Editor',
  description: 'Test drive the editor',
}

const page = () => (
  <div className='py-6 px-6'>
    <Playground />
  </div>
)

export default page
