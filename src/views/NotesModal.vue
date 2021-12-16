<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header
          class="modal-header"
          id="modalTitle"
        >
          <input type = "text" id = "titleInfo" placeholder="edit event title" :value="title"
          @input = "changeNoteTitle">

          <input type = "text" id = "dateInfo" :value= "date" readonly>
          
          <button
            type="button"
            class="btn-delete"
            @click="deleteEvent"
            aria-label="Delete modal"
          >
            <i class="fas fa-trash-alt"></i>
          </button>
        </header>

        <section
          class="modal-body"
          id="modalDescription"
        >
          <textarea id = "textBox" type="text" placeholder="add details here" :value="msg"
          @input = "changeMessage"></textarea>
        </section>

        <footer class="modal-footer">
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close modal"
          >
            Close and Save Note
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>


<script>
  export default {
    name: 'NotesModal',
    props: ['title','date','msg'],
    data(){
      return{
        noteTitle: '',
        message: '',
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      deleteEvent(){
        this.$emit('deleteEvent');
      },
      changeNoteTitle(event){
        this.noteTitle = event.target.value;
        this.$emit('noteTitleChanged', this.noteTitle);
      },
      changeMessage(event){
        this.message = event.target.value;
        this.$emit('messageChanged', this.message);
      }
    },
  };
</script>

<style>


  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #2c3e50; 
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #edf8ff;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    height: 600px;
    width: 600px;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    position: relative;
    border-bottom: 1px solid #edf8ff;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #edf8ff;
    flex-direction: column;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-delete {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    /*font-size: 30px;*/
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: rgb(206, 49, 49);
    background: #ffd8d8;
    border: 1px solid #ff0000;
    border-radius: 2px;
    font-size: 1.5em;
  margin: 5px;
  }

  .btn-close {
    color: white;
    background: #0395b9;
    border: 1px solid #0395b9;
    border-radius: 2px;
  }

  #textBox{
    height: 410px;
    width: 540px;
    font-family: Georgia, Times, serif;
    font-size: 16px;
    border: 5px solid lightblue;
    padding: 10px;
  }

  #titleInfo{
    font-family: Georgia, Times, serif;
    font-size: 16px;
    border: solid lightblue;
  }
  

  #dateInfo{
    width: 200px;
    margin-right: 90px;
    margin-left: 30px;
    font-family: Georgia, Times, serif;
    font-size: 16px;
    border: solid lightblue;
  }

</style>