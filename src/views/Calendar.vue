<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import firebase from 'firebase'

import NotesModal from '../views/NotesModal.vue'
import Navbar from '../views/Navbar.vue'
import { onUnmounted, ref } from '@vue/runtime-core'

var clickData;
let email;

firebase.auth().onAuthStateChanged(function(user)     //if someone is logged in, what is their username?
{
if (user != null)
{
  sessionStorage.setItem('email', user.email);        // store it in a session storage in case firebase messes up
  email = user.email
  //console.log(email, "1")
}
else{
  email = sessionStorage.getItem('email');            // retrieve it from session storage ...
  console.log("Warning, retrieved user email from session storage!")
  //console.log(email, "2")
}
});

//firebase db
const db = firebase.firestore();
const eventCollection = db.collection('CalendarEvents'); //our data will be saved into this firebase collection

export const createEvent = event => {
  return eventCollection.add(event);
}

export const getEvent = async id => {
  const event = await eventCollection.doc(id).get();
  return event.exists ? event.data() : null;
}

export const updateEvent = (id, event) => {
  var query = eventCollection.where('id', '==', id);
  query.get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      doc.ref.update(event);
    })
  });
  return eventCollection.doc(id).update(event);
}

// add error message for not being able to delete event
export const deleteEvent = id => {
  var query = eventCollection.where('id', '==', id);
  return query.get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      doc.ref.delete();
    })
  });
  // return 0;
}

export const useLoadEvents = () => {
  const events = ref([]);
  const close = eventCollection.onSnapshot(snapshot => {
    events.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
  onUnmounted(close);
  //console.log("useLoadEvents result: ", events.data());
  return events;
}


//calendar stuff
export default {

  components: {
    FullCalendar,       // make the <FullCalendar> tag available, calendar component
    NotesModal,         // Pop up notes modal, fades calendar and navbar
    Navbar,            // Show navbar above calendar
  },

  data: function() {
    return {
      isModalVisible: false,        // notes modal is not visible
      noteTitle: '',                // Notes title
      dateInfo: '',                 // Notes date
      message: '',                  // Notes message
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
          listPlugin
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth, timeGridWeek, timeGridDay, listWeek'
        },
        initialView: 'dayGridMonth',
        events: this.getAllEvents,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        /* you can update a remote database when these fire: */
        //eventAdd:,
        eventChange: this.updateEventDates,         
        //eventRemove: 
      },
      currentEvents: [],
    }
  },

  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },

    handleDateSelect(selectInfo) {
      let title = ''; //add input from modal component for title
      let text = '';// = this.message;// take text from NotesModal
      let temp = eventCollection.doc().id
      let calendarApi = selectInfo.view.calendar
      calendarApi.unselect() // clear date selection
      calendarApi.addEvent({
        id: temp,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        text,
        email: email
      })
      //firebase
      createEvent({
        id: temp,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        text,
        email: email
      })
    },

    // If user presses an event, call show modal function.
    handleEventClick(selectInfo) {
      clickData = selectInfo;   // save event object, in case I have to delete it
      this.showModal();
    },

    // function to call when delete button is pressed
     handleDeleteButton() {
      var clickInfo = clickData;    // retrieve event object, so I can delete it
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
        this.closeModal();
      }
      deleteEvent(clickInfo.event.id);
    },

    handleEvents(events) {
      this.currentEvents = events
    },

    async updateEventDates(clickData){
      let event = await this.getAllEvents()
      let i = 0;
      let temp;
      //console.log(clickData)
      for (; i < event.length; i++)
      {
        if (clickData.event.id == event[i].id)
        {
          event[i].start = clickData.event.startStr;
          event[i].end = clickData.event.endStr;
          temp = event[i]

        }
      }
      this.isModalVisible = false;

     this.updateEventToDB(temp); //now we send our newly-constructed object to the DB, so it replaces what we were editing.
    },

    async updateEventToDB(clickInfo){
      //firebase
      await updateEvent(clickInfo.id, clickInfo);
    },

    // make modal visible
    // and update data that is shown in the notes modal
    showModal() {
      this.isModalVisible = true;
      this.noteTitle = clickData.event.title
      this.dateInfo = clickData.event.startStr + " to " + clickData.event.endStr
      this.message = clickData.event.extendedProps.text
    },

    // close modal for taking notes
    // update any changes to the events from the notes modal
    async closeModal() {
      let i = 0;
      this.isModalVisible = false;
      let event = await this.getAllEvents()
      let temp;
      //console.log(event)
      for (; i < event.length; i++)
      {
        //console.log(event)
        if (clickData.event.id == event[i].id)
        {
          event[i].text = this.message;
          event[i].title = this.noteTitle;
          temp = event[i]

        }
      }
      await this.updateEventToDB(temp); //now we send our newly-constructed object to the DB, so it replaces what we were editing.
      location.reload()
    },

    async getAllEvents(){
        const snapshot = await eventCollection.get()
        this.events = snapshot.docs.map(doc => doc.data());
        let temp = []
        let i = 0
        for (; i < this.events.length; i++){
          if (this.events[i].email == email)
          {
            temp.push(this.events[i])
          }
        }
        return temp;
      }
  },
}
</script>

<template>
  <div class='demo-app'>
      <NotesModal
            v-show = "isModalVisible"
            @close = "closeModal"
            @deleteEvent = "handleDeleteButton"
            :title = "noteTitle"
            :date = "dateInfo"
            :msg = "message"
            @noteTitleChanged = "noteTitle = $event"
            @messageChanged = "message = $event"
      />
      <Navbar
      v-if="isModalVisible == false"
       />
      <div class='demo-app-main'>
      <FullCalendar
      v-if="isModalVisible == false"
      class ='demo-app-calendar'
      :options='calendarOptions'   
      >
        <template v-slot:eventContent='arg' >
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
      </div>
  </div>
</template>

<style lang='css'>

h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b { /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: block;
  min-height: 80%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  background-color: white;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc { /* the calendar root */
  max-height: 800px;
  max-width: 1600px;
  margin: 0 auto;
}

body {
    color: black;
}

</style>