import { Button } from '@/components/ui/button'

const CreatePollButton = ({ onClick }) => {
  return (
    <Button
      variant="default"
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Create Poll
    </Button>
  )
}

export default CreatePollButton
