'use client'
import React, { useState, FormEvent, useEffect } from 'react'
import { PlusCircle, Trash } from 'lucide-react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Card {
  title: string
  id: string
  columnId: string
}

const CustomKanban = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  )
}

export default CustomKanban

const Board = () => {
  const { data: kanbanCards, error } = useSWR('/api/kanban', fetcher)

  useEffect(() => {
    if (kanbanCards) {
      setCards(kanbanCards)
    }
  }, [kanbanCards])

  const [cards, setCards] = useState<Card[]>(kanbanCards || [])

  if (error) return <div>Failed to load</div>
  if (!kanbanCards) return <div>Loading...</div>

  console.log('cards', cards)
  // console.log('kanbanCards', kanbanCards)
  // console.log('data', data)

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Backlog"
        columnId="1"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="ToDo"
        columnId="2"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In Bearbeitung"
        columnId="3"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Erledigt"
        columnId="4"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  )
}

interface ColumnProps {
  title: string
  headingColor: string
  cards: Card[]
  columnId: string
  setCards: React.Dispatch<React.SetStateAction<Card[]>>
}

const Column: React.FC<ColumnProps> = ({
  title,
  headingColor,
  cards,
  columnId,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false)

  console.log('cards in column: ', cards)

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    card: Card
  ) => {
    if ('dataTransfer' in e) {
      e.dataTransfer.setData('cardId', card.id)
    }
  }

  const handleDragEnd = async (e: React.DragEvent) => {
    const cardId = e.dataTransfer.getData('cardId')

    setActive(false)
    clearHighlights()

    const indicators = getIndicators()
    const { element } = getNearestIndicator(e, indicators)

    const before = element.dataset.before || '-1'

    if (before !== cardId) {
      let copy = [...cards]

      let cardToTransfer = copy.find((c) => c.id === cardId)
      if (!cardToTransfer) return
      cardToTransfer = { ...cardToTransfer, columnId }

      copy = copy.filter((c) => c.id !== cardId)

      const moveToBack = before === '-1'

      if (moveToBack) {
        copy.push(cardToTransfer)
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before)
        if (insertAtIndex === undefined) return

        copy.splice(insertAtIndex, 0, cardToTransfer)
      }

      setCards(copy)

      try {
        const response = await fetch(`/api/kanban`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ columnId, cardId }),
        })

        if (!response.ok) {
          throw new Error('Failed to update card')
        }
      } catch (error) {
        console.error('Error updating card:', error)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    highlightIndicator(e)

    setActive(true)
  }

  const clearHighlights = (els?: HTMLDivElement[]) => {
    const indicators = els || getIndicators()

    indicators.forEach((i: HTMLDivElement) => {
      i.style.opacity = '0'
    })
  }

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators()

    clearHighlights(indicators)

    const el = getNearestIndicator(e, indicators)

    el.element.style.opacity = '1'
  }

  const getNearestIndicator = (
    e: React.DragEvent,
    indicators: HTMLDivElement[]
  ) => {
    const DISTANCE_OFFSET = 50

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect()

        const offset = e.clientY - (box.top + DISTANCE_OFFSET)

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
        } else {
          return closest
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    )

    return el
  }

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${columnId}"]`)
    ) as HTMLDivElement[]
  }

  const handleDragLeave = () => {
    clearHighlights()
    setActive(false)
  }

  const filteredCards = cards
    ? cards.filter((c) => c.columnId === columnId)
    : []

  // const filteredCards = cards.filter((c) => c.column === column)

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />
        })}
        <DropIndicator beforeId={null} columnId={columnId} />
        <AddCard columnId={columnId} setCards={setCards} />
      </div>
    </div>
  )
}

const Card: React.FC<{
  title: string
  id: string
  columnId: string
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    card: Card
  ) => void
}> = ({ title, id, columnId, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} columnId={columnId} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) =>
          // @ts-ignore
          handleDragStart(e as React.DragEvent<HTMLDivElement>, {
            title,
            id,
            columnId,
          })
        }
        onTouchStart={(e) =>
          handleDragStart(e as React.TouchEvent<HTMLDivElement>, {
            title,
            id,
            columnId,
          })
        }
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  )
}

const DropIndicator: React.FC<{
  beforeId: string | null
  columnId: string
}> = ({ beforeId, columnId }) => {
  return (
    <div
      data-before={beforeId || '-1'}
      data-column={columnId}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  )
}

const BurnBarrel: React.FC<{
  setCards: React.Dispatch<React.SetStateAction<Card[]>>
}> = ({ setCards }) => {
  const [active, setActive] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setActive(true)
  }

  const handleDragLeave = () => {
    setActive(false)
  }

  const handleDragEnd = async (e: React.DragEvent) => {
    const cardId = e.dataTransfer.getData('cardId')

    console.log('cardId: ', cardId)

    setCards((pv) => pv.filter((c) => c.id !== cardId))

    setActive(false)

    try {
      const response = await fetch('/api/kanban', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId }),
      })
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? 'border-red-800 bg-red-800/20 text-red-500'
          : 'border-neutral-500 bg-neutral-500/20 text-neutral-500'
      }`}
    >
      {active ? <Flame className="animate-bounce" /> : <Trash />}
    </div>
  )
}

const AddCard: React.FC<{
  columnId: string
  setCards: React.Dispatch<React.SetStateAction<Card[]>>
}> = ({ columnId, setCards }) => {
  const [text, setText] = useState('')
  const [adding, setAdding] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!text.trim().length) return

    const newCard = {
      columnId,
      title: text.trim(),
      id: Math.random().toString(),
    }

    setCards((pv) => [...pv, newCard])

    setAdding(false)

    try {
      const response = await fetch('/api/kanban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard), // Corrected to use newCard instead of { title, columnId }
      })

      if (!response.ok) {
        throw new Error('Failed to create card')
      }

      // If successful, update the UI accordingly
      // For example, you can fetch the updated list of cards
      // and update the local state (setCards) to reflect the changes
      // setCards((prevCards) => [...prevCards, newCard])

      // setAdding(false) // Hide the form after successful creation
    } catch (error) {
      console.error('Error creating card:', error)
      // Handle error, show error message to user, etc.
    }
  }

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <PlusCircle />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <PlusCircle />
        </motion.button>
      )}
    </>
  )
}

// const DEFAULT_CARDS: Card[] = [
// BACKLOG
// { title: 'Look into render bug in dashboard', id: '1', column: 'backlog' },
// { title: 'SOX compliance checklist', id: '2', column: 'backlog' },
// { title: '[SPIKE] Migrate to Azure', id: '3', column: 'backlog' },
// { title: 'Document Notifications service', id: '4', column: 'backlog' },
// // TODO
// {
//   title: 'Research DB options for new microservice',
//   id: '5',
//   column: 'todo',
// },
// { title: 'Postmortem for outage', id: '6', column: 'todo' },
// { title: 'Sync with product on Q3 roadmap', id: '7', column: 'todo' },
// // DOING
// {
//   title: 'Refactor context providers to use Zustand',
//   id: '8',
//   column: 'doing',
// },
// { title: 'Add logging to daily CRON', id: '9', column: 'doing' },
// // DONE
// {
//   title: 'Set up DD dashboards for Lambda listener',
//   id: '10',
//   column: 'done',
// },
// ]
