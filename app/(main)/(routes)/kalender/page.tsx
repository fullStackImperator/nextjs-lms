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
import {
  NumericTextBoxComponent,
  NumericTextBox,
} from '@syncfusion/ej2-react-inputs'

import { useEffect, useState } from 'react'
import { db } from '@/lib/db'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Registering Syncfusion license key
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxfeXVWRmNYWUd+XUQ='
)

export default function Kalender() {
  //   const eventSettings: EventSettingsModel = { dataSource: timelineResourceData }
  //   const group = { byGroupID: false, resources: ['Projects', 'Categories'] }

  const router = useRouter()

  const { data: kalenderEvents, error } = useSWR('/api/kalender', fetcher)
  console.log('kalenderEvents: ', kalenderEvents)

  useEffect(() => {
    if (kalenderEvents) {
      setEvents(kalenderEvents)
    }
  }, [kalenderEvents])

  const [events, setEvents] = useState(kalenderEvents || []) // State to hold fetched events
  const [id, setId] = useState([]) // State to hold fetched events

  if (!kalenderEvents) return <div>Loading...</div>
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
      Location: args.data.Location,
      StartTime: args.data.StartTime,
      EndTime: args.data.EndTime,
      IsAllDay: args.data.IsAllDay || false, // Default value if not provided
      IsReadonly: args.data.IsReadonly || false, // Default value if not provided
      EventType: args.data.EventType, // Default value if not provided
      MaxParticipants: args.data.MaxParticipants, // Default value if not provided
      Description: args.data.Description, // Default value if not provided
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
      const editorElement = formElement?.querySelector('.e-title-location-row')
      if (formElement) {
        const row: HTMLElement = createElement('div', {
          className: 'event-type-row',
        })
        const col: HTMLElement = createElement('div', {
          className: 'event-max-participants-col py-4',
        })
        formElement?.firstChild?.insertBefore(
          row,
          formElement.firstChild?.firstChild
        )
        // formElement.insertBefore(col, formChildren[4].nextSibling)
        editorElement?.parentNode?.insertBefore(col, editorElement)
        const container: HTMLElement = createElement('div', {
          className: 'event-field-container',
        })
        const containerParticipants: HTMLElement = createElement('div', {
          className: 'event-max-participants-container',
        })
        const inputEle: HTMLInputElement = createElement('input', {
          className: 'e-field',
          attrs: { name: 'EventType' },
        }) as HTMLInputElement
        const inputEleMaxPart: HTMLInputElement = createElement('input', {
          className: 'e-field',
          attrs: { name: 'MaxParticipants' },
        }) as HTMLInputElement
        // const labelElement: HTMLElement = createElement('label', {
        //   className: 'e-float-text e-label-top',
        //   innerHTML: 'MaxParticipants', // Label text
        //   attrs: { for: 'MaxParticipants' },
        // })

        // const inputParentElement = inputEleMaxPart.parentElement

        // // Insert the label before the input field
        // inputParentElement?.insertBefore(labelElement, inputEleMaxPart)

        container.appendChild(inputEle)
        row.appendChild(container)
        // containerParticipants.appendChild(labelElement)
        containerParticipants.appendChild(inputEleMaxPart)
        col.appendChild(containerParticipants)
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
        const numericTextBoxInstance: NumericTextBoxComponent =
          new NumericTextBoxComponent({
            format: 'n0', // You can adjust the format as needed
            // value: 0, // Initial value
            min: 0,
            max: 10000,
            value: args.data?.MaxParticipants as number,
            placeholder: 'Maximale Teilnehmeranzahl',
            label: 'TEST',
          })
        numericTextBoxInstance.appendTo(inputEleMaxPart)
        inputEle.setAttribute('name', 'EventType')

        inputEleMaxPart.setAttribute('name', 'MaxParticipants')
      }
    }
  }

//   // @ts-ignore
//   const handleEventClick = (args) => {
//     // Extract event details
//     const event = args.data

//     // Redirect to the registration page with event details as query parameters
//     router.push(`/courses`)
//     // router.push(`/courses/${courseId}/chapters/${firstChapterId}`)

//     // router.push({
//     //   pathname: '/registration',
//     //   query: {
//     //     eventId: event.Id,
//     //     eventName: encodeURIComponent(event.Subject),
//     //   },
//     // })
//   }

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
        // eventClick={handleEventClick}
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
