'use client'
import BadgeList from './_components/badges-list'
import BadgesDialog from './_components/badges-dialog'
import { useState } from 'react'

// Define the Badge type
type Badge = {
  id: string
  name: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

const CreateBadgesPage = () => {
  // State to manage the badge data
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  // Function to handle opening the dialog and setting the selected badge data
  const handleOpenDialog = (badge: Badge) => {
    setSelectedBadge(badge)
    setDialogMode('edit')
  }

  // Function to handle closing the dialog and resetting the selected badge data
  const handleCloseDialog = () => {
    setSelectedBadge(null)
    setDialogMode('create') 
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 flex flex-col  md:items-center md:justify-center p-6">
      <div className="text-center mb-8 ">
        <h1 className="text-2xl text-center  ">Erstelle einen Badge</h1>
        <p className="text-sm text-slate-600 text-center">
          Der Badge kann anschliessend an Schüler vergeben werden
        </p>
        <BadgesDialog
          open={!!selectedBadge}
          onClose={handleCloseDialog}
          badgeData={selectedBadge || undefined}
          mode={dialogMode} // Pass the dialog mode
        />
      </div>

      <p className="text-sm text-slate-600 text-center mt-8 mb-4">
        Vorhandene Badges
      </p>
      <BadgeList onOpenDialog={handleOpenDialog} />
    </div>
  )
}

export default CreateBadgesPage
