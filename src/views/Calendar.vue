<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import firebase from 'firebase'

import NotesModal from '../views/NotesModal.vue'
import Navbar from '../views/Navbar.vue'
import Footer from '../views/Footer.vue'

var clickData;          // saving event objects
var email;              // accessing user email 

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

// after creating an event, add it to firebase
export const createEvent = event => {
  return eventCollection.add(event);
}

// for updating an event, whether user dragged event or changed note details
export const updateEvent = (id, event) => {
  var query = eventCollection.where('id', '==', id);
  return query.get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      doc.ref.update(event);
    })
  });
}

// if an event is deleted
export const deleteEvent = id => {
  var query = eventCollection.where('id', '==', id);
  return query.get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      doc.ref.delete();
    })
  });
}


//calendar stuff
export default {

  components: {
    FullCalendar,       // make the <FullCalendar> tag available, calendar component
    NotesModal,         // Pop up notes modal, fades calendar and navbar
    Navbar,            // Show navbar above calendar
    Footer             // Footer component
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
    // In case I want to change weekends displaying or not
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },

    // called when user clicks a new event
    handleDateSelect(selectInfo) {
      let title = ''; //add input from modal component for title
      let description = '';// = this.message;// take description from NotesModal
      let temp = eventCollection.doc().id   // this is an event id
      let calendarApi = selectInfo.view.calendar
      calendarApi.unselect() // clear date selection
      calendarApi.addEvent({  // updates Fullcalendar component DOM
        id: temp,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        description,
        email: email
      })
      
      createEvent({           // updates firebase
        id: temp,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        description,
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
        console.log(clickInfo.event)
        deleteEvent(clickInfo.event.id);
        clickInfo.event.remove()        // firebase is buggy, this works
        this.updateNotes()              // without this, deleted event doesn't delete
        // this.closeModal();
      }
      //location.reload()
    },

    // default code from sample
    handleEvents(events) {
      this.currentEvents = events
    },

    // if user drags event, go ahead and update firebase
    async updateEventDates(clickData){
      let event = await this.getAllEvents()
      let i = 0;
      let temp;
      //console.log(clickData.event.allDay)
      for (; i < event.length; i++)
      {
        if (clickData.event.id == event[i].id)
        {
          event[i].start = clickData.event.startStr;
          event[i].end = clickData.event.endStr;
          event[i].allDay = clickData.event.allDay;
          temp = event[i]

        }
      }
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
      this.message = clickData.event.extendedProps.description
    },

    // update note details to firebase
    async updateNotes()
    {
      let i = 0;
      let event = await this.getAllEvents()
      let temp;
      //console.log(event)
      for (; i < event.length; i++)
      {
        //console.log(event)
        if (clickData.event.id == event[i].id)
        {
          event[i].description = this.message;
          event[i].title = this.noteTitle;
          temp = event[i]
        }
      }
      this.updateEventToDB(temp); //now we send our newly-constructed object to the DB, so it replaces what we were editing.
      this.closeModal();
      this.events = this.getAllEvents();
      setTimeout(function(){      // let firebase update it, before refreshing page
       window.location.reload();
      }, 1000); 
    },

    // close modal for taking notes
    // update any changes to the events from the notes modal
    async closeModal() {
      this.isModalVisible = false;
    },

    // called on page refresh to get all calendar events and store in this.events
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
        this.events = temp;
        return this.events;
      }
  },
}
</script>

<template>
  <div class='demo-app'>
      <NotesModal
            v-show = "isModalVisible"
            @close = "updateNotes"
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
      aria-label="Calendar events" 
      >
        <template v-slot:eventContent='arg' >
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
      </div>
      <Footer />
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