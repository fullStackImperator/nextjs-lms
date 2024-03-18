'use client'

// import { Button } from "@/components/ui/button";
// import Link from "next/link";
import axios from 'axios'
import { DataTableUsers } from './_components/data-table-users'
import { columns } from './_components/columns'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import useSwr from 'swr'
// import { mutate } from 'swr'

import { getUsers } from '@/actions/get-users'
import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'

import { RefreshCcw } from 'lucide-react'
import Loading from './loading'



const UsersPage = () => {
  
  const {
    data: users,
    isLoading,
    isValidating,
    mutate,
  } = useSwr('users', getUsers)


  	// if (isLoading) {
    //   return (<p> Loading users... </p>)
    // }


//   console.log('users: ', users)

  const router = useRouter()

  const [isLoadingApi, setIsLoadingApi] = useState(false)
  // State to track isTeacher values for users
  const [userIsTeacher, setUserIsTeacher] = useState<Record<string, boolean>>(
    {}
  )

  // Handler function to update isTeacher value
  const handleIsTeacherChange = (userId: string, value: boolean) => {
    setUserIsTeacher((prevState) => ({
      ...prevState,
      [userId]: value,
    }))
  }

  const onClick = async () => {
    try {
      setIsLoadingApi(true)

      const updateData = Object.keys(userIsTeacher).map((userId) => ({
        userId,
        // userName: users?.find((user) => user.id === userId)?.userName,
        isTeacher: userIsTeacher[userId] as boolean, // Use type assertion to define the type
      }))

      // Send request to update points
      await axios.patch(`/api/users`, updateData)

      toast.success('Rollen geändert')

      // Reset selectedBadges to empty object after successful API call
      setUserIsTeacher({}) // Reset ComboBoxes to empty

      //   router.refresh()
    //   mutate('/api/users') // Trigger re-fetch
      // Trigger re-fetch and log response data
      mutate()

      router.refresh()
    } catch (error) {
      console.error('Error updating roles:', error)
      toast.error('Something went wrong. Error updating roles.')
    } finally {
      setIsLoadingApi(false)
    }
  }

  // Assuming coursesWithEnrolledStudents is an array of Course objects
  const tableData =
    users?.map((user) => ({
      id: user.id,
      username: user.userName || '',
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isTeacher: user.isTeacher || false, // Provide a default value,
    })) || []

  // Call the columns function to get the array of ColumnDef objects
  const tableColumns = columns({ handleIsTeacherChange, userIsTeacher })

  return (
    <div>
      <div className="p-6 flex justify-between">
        <div></div>
        <div>
          <Button onClick={onClick} variant="success" size="sm">
            Rollen übernehmen
          </Button>
        </div>
      </div>
      <div className="py-2 px-6">
        <Suspense fallback={<Loading />}>
          <DataTableUsers
            columns={tableColumns}
            data={tableData}
            handleIsTeacherChange={handleIsTeacherChange}
            userIsTeacher={userIsTeacher}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default UsersPage
