'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { motion } from 'framer-motion'
import CreatePollButton from './_components/create-poll-button'
import CreatePollForm from './_components/create-poll-form'
import { MessageCircleQuestion } from 'lucide-react'
import PollDialog from './_components/pollDialog'

type Poll = {
  id: string
  question: string
  options: VoteType[]
}


type VoteType = {
  title: string
  votes: number
  color: string
}

const BarPoll = () => {
  const [votes, setVotes] = useState<VoteType[]>([
    {
      title: 'Tabs',
      votes: 1,
      // NOTE: Color assumes a tailwind CSS class.
      // One off colors could be added using something like:
      // bg-[#6366F1]
      color: 'bg-indigo-500',
    },
    {
      title: 'Spaces',
      votes: 2,
      color: 'bg-fuchsia-500',
    },
    {
      title: 'Who cares bro?',
      votes: 3,
      color: 'bg-violet-500',
    },
  ])

  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')


  // Function to handle opening the dialog and setting the selected badge data
  const handleOpenDialog = (poll: Poll) => {
    setSelectedPoll(poll)
    setDialogMode('edit')
  }

  // Function to handle closing the dialog and resetting the selected badge data
  const handleCloseDialog = () => {
    setSelectedPoll(null)
    setDialogMode('create')
  }

  return (
    <section>
      <div className="text-center mb-8 mt-8">
        <span className="justify-center flex mb-8">
          <MessageCircleQuestion className="h-12 w-12" />
        </span>
        <h1 className="text-2xl text-center  ">Erstelle eine Umfrage</h1>
        {/* <p className="mt-1 text-sm text-slate-600 text-center">
          Der Badge kann anschliessend{' '}
          <Link
            href="/teacher/courses"
            className="underline"
            // target="_blank"
          >
            {' '}
            in den Projekten{' '}
          </Link>{' '}
          an Schüler vergeben werden
        </p> */}
        <PollDialog
          // <BadgesDialog
          open={!!selectedPoll}
          onClose={handleCloseDialog}
          pollData={selectedPoll || undefined}
          mode={dialogMode} // Pass the dialog mode
        />
      </div>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 md:grid-cols-[1fr_400px] md:gap-12">
        <Options votes={votes} setVotes={setVotes} />
        <Bars votes={votes} />
      </div>
    </section>
  )
}

const Options = ({
  votes,
  setVotes,
}: {
  votes: VoteType[]
  setVotes: Dispatch<SetStateAction<VoteType[]>>
}) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0)

  const handleIncrementVote = (vote: VoteType) => {
    const newVote = { ...vote, votes: vote.votes + 1 }

    setVotes((pv) => pv.map((v) => (v.title === newVote.title ? newVote : v)))
  }

  return (
    <div className="col-span-1 py-12">
      <h3 className="mb-6 text-3xl font-semibold text-slate-500">
        What is your opinion?
      </h3>
      <div className="mb-6 space-y-2">
        {votes.map((vote) => {
          return (
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleIncrementVote(vote)}
              key={vote.title}
              className={`w-full rounded-md ${vote.color} py-2 font-medium text-white`}
            >
              {vote.title}
            </motion.button>
          )
        })}
      </div>
      <div className="flex items-center justify-between">
        <span className="mb-2 italic text-slate-400">{totalVotes} votes</span>
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => {
            setVotes((pv) => pv.map((v) => ({ ...v, votes: 0 })))
          }}
          className="rounded-sm bg-slate-700 px-2 py-1.5 text-sm font-medium text-slate-200"
        >
          Reset count
        </motion.button>
      </div>
    </div>
  )
}

const Bars = ({ votes }: { votes: VoteType[] }) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0)

  return (
    <div
      className="col-span-1 grid min-h-[200px] gap-2"
      style={{
        gridTemplateColumns: `repeat(${votes.length}, minmax(0, 1fr))`,
      }}
    >
      {votes.map((vote) => {
        const height = vote.votes
          ? ((vote.votes / totalVotes) * 100).toFixed(2)
          : 0
        return (
          <div key={vote.title} className="col-span-1">
            <div className="relative flex h-full w-full items-end overflow-hidden rounded-2xl bg-gradient-to-b from-slate-700 to-slate-800">
              <motion.span
                animate={{ height: `${height}%` }}
                className={`relative z-0 w-full ${vote.color}`}
                transition={{ type: 'spring' }}
              />
              <span className="absolute bottom-0 left-[50%] mt-2 inline-block w-full -translate-x-[50%] p-2 text-center text-sm text-slate-50">
                <b>{vote.title}</b>
                <br></br>
                <span className="text-xs text-slate-200">
                  {vote.votes} votes
                </span>
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BarPoll
