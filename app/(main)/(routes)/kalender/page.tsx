'use client'
import {
  Week,
  Month,
  Agenda,
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  EventSettingsModel,
  ResourcesDirective,
  ResourceDirective,
  Inject,
  Resize,
  DragAndDrop,
  Year,
  TimelineYear,
  EventClickArgs,
  PopupOpenEventArgs,
} from '@syncfusion/ej2-react-schedule'
import { timelineResourceData } from '@/lib/kalender/data2'
// import { timelineResourceData } from '@/lib/kalender/data'
import { registerLicense, createElement } from '@syncfusion/ej2-base'
import { DropDownList } from '@syncfusion/ej2-dropdowns'

import { useEffect, useState } from 'react'
import { db } from '@/lib/db'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Registering Syncfusion license key
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxfeXVWRmNYWUd+XUQ='
)

export default function Kalender() {
  //   const eventSettings: EventSettingsModel = { dataSource: timelineResourceData }
  //   const group = { byGroupID: false, resources: ['Projects', 'Categories'] }

  //   const projectData: Object[] = [
  //     { text: 'PROJECT 1', id: 1, color: '#cb6bb2' },
  //     { text: 'PROJECT 2', id: 2, color: '#56ca85' },
  //     { text: 'PROJECT 3', id: 3, color: '#df5286' },
  //   ]
  //   const categoryData: Object[] = [
  //     { text: 'Development', id: 1, color: '#1aaa55' },
  //     { text: 'Testing', id: 2, color: '#7fa900' },
  //   ]

  const [events, setEvents] = useState([]) // State to hold fetched events
  const [id, setId] = useState([]) // State to hold fetched events

  const { data: kalenderEvents, error } = useSWR('/api/kalender', fetcher)

  //   console.log('kalenderEvents: ', kalenderEvents)

  useEffect(() => {
    if (kalenderEvents) {
      setEvents(kalenderEvents)
    }
  }, [kalenderEvents])

  // console.log('events: ', events)
  //   const eventSettings: EventSettingsModel = { dataSource: kalenderEvents || [] }

  const save =
    'e-event-create e-text-ellipsis e-control e-btn e-lib e-flat e-primary'
  const saveEvent = 'e-control e-btn e-lib e-primary e-event-save e-flat'
  const saveMore =
    'e-schedule-dialog e-control e-btn e-lib e-primary e-event-save e-flat'
  const saveMobile = 'e-save-icon e-icons'
  const moreDetails =
    'e-event-details e-text-ellipsis e-control e-btn e-lib e-flat'
  const deleteQuickEvent =
    'e-quick-dialog e-control e-btn e-lib e-quick-alertok e-flat e-primary e-quick-dialog-delete'
  // e-lib e-dialog e-control e-device e-schedule-dialog e-dlg-modal e-popup e-popup-close
  // @ts-ignore
  const handleEventCreate = async (args) => {
    console.log('args: ', args)
    console.log('args.event.target.className: ', args)
    console.log('args.data: ', args.data)
    setId(args.data.Id)

    const classNameSave = args.event.target.className
    // Extract event data from args (e.g., args.data)
    const eventData = {
      Id: args.data.Id || id, // Assuming Id is unique and provided by the frontend
      Subject: args.data.Subject,
      StartTime: args.data.StartTime,
      EndTime: args.data.EndTime,
      IsAllDay: args.data.IsAllDay || false, // Default value if not provided
      IsReadonly: args.data.IsReadonly || false, // Default value if not provided
      EventType: args.data.EventType, // Default value if not provided
    }

    // console.log('eventData in kalender : ', eventData)

    if (
      args.event.target.className !== moreDetails ||
      args.event.target.className === moreDetails
    ) {
      if (
        classNameSave === save ||
        classNameSave === saveEvent ||
        classNameSave === saveMore ||
        classNameSave === saveMobile
      ) {
        // save event
        try {
          const response = await fetch('/api/kalender', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData), // Corrected to use newCard instead of { title, columnId }
            // body: JSON.stringify(eventData), // Corrected to use newCard instead of { title, columnId }
          })

          if (!response.ok) {
            throw new Error('Failed to create event')
          }

          // If successful, update the UI accordingly
          // For example, you can fetch the updated list of cards
          // and update the local state (setCards) to reflect the changes
          // setCards((prevCards) => [...prevCards, newCard])

          // setAdding(false) // Hide the form after successful creation
        } catch (error) {
          console.error('Error creating event:', error)
          // Handle error, show error message to user, etc.
        }
      } else if (classNameSave === deleteQuickEvent) {
        // delete event
        console.log('In delete')
        try {
          const response = await fetch('/api/kalender', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData), // Corrected to use newCard instead of { title, columnId }
            // body: JSON.stringify(eventData), // Corrected to use newCard instead of { title, columnId }
          })

          if (!response.ok) {
            throw new Error('Failed to delete event')
          }

          // If successful, update the UI accordingly
          // For example, you can fetch the updated list of cards
          // and update the local state (setCards) to reflect the changes
          // setCards((prevCards) => [...prevCards, newCard])

          // setAdding(false) // Hide the form after successful creation
        } catch (error) {
          console.error('Error deleting event:', error)
          // Handle error, show error message to user, etc.
        }
      }
    }
  }

  if (error) return <div>Error fetching events</div>

  const onPopupOpen = (args: PopupOpenEventArgs): void => {
    if (args.type === 'Editor') {
      // Create required custom elements in initial time
      const formElement = args.element.querySelector('.e-schedule-form')
      if (formElement) {
        const row: HTMLElement = createElement('div', {
          className: 'custom-field-row',
        })
        formElement?.firstChild?.insertBefore(
          row,
          formElement.firstChild?.firstChild
        )
        const container: HTMLElement = createElement('div', {
          className: 'custom-field-container',
        })
        const inputEle: HTMLInputElement = createElement('input', {
          className: 'e-field',
          attrs: { name: 'EventType' },
        }) as HTMLInputElement
        container.appendChild(inputEle)
        row.appendChild(container)
        const dropDownList: DropDownList = new DropDownList({
          dataSource: [
            { text: 'Workshop', value: 'workshop' },
            { text: 'Hackerdays', value: 'hackerdays' },
            { text: 'Fortbildung', value: 'fortbildung' },
            { text: 'Nachhilfe', value: 'nachhilfe' },
          ],
          fields: { text: 'text', value: 'value' },
          value: args.data?.EventType as string,
          floatLabelType: 'Always',
          placeholder: 'Event Type',
        })
        dropDownList.appendTo(inputEle)
        inputEle.setAttribute('name', 'EventType')
      }
    }
  }

  return (
    <div className="p-8">
      <h2 className="py-4">MiSHN Kalender</h2>
      <ScheduleComponent
        width="100%"
        height="550px"
        currentView="Month"
        selectedDate={new Date()}
        eventSettings={{ dataSource: events }}
        // actionBegin={handleEventCreate} // Handle event creation
        popupOpen={onPopupOpen}
        popupClose={handleEventCreate}
        // group={group}
      >
        <ViewsDirective>
          <ViewDirective option="Week" displayName="Woche" />
          <ViewDirective option="Month" displayName="Monat" />
          <ViewDirective option="Year" displayName="Jahr" />
          <ViewDirective option="TimelineYear" displayName="Jahr Horizontal" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>
        {/* <ResourcesDirective>
          <ResourceDirective
            field="ProjectId"
            title="Choose Project"
            name="Projects"
            allowMultiple={false}
            dataSource={projectData}
            textField="text"
            idField="id"
            colorField="color"
          ></ResourceDirective>
          <ResourceDirective
            field="TaskId"
            title="Category"
            name="Categories"
            allowMultiple={true}
            dataSource={categoryData}
            textField="text"
            idField="id"
            colorField="color"
          ></ResourceDirective>
        </ResourcesDirective> */}
        <Inject
          services={[
            Week,
            Month,
            Year,
            TimelineYear,
            Agenda,
            Resize,
            DragAndDrop,
          ]}
        />
      </ScheduleComponent>
    </div>
  )
}
