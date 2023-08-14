import { useState } from "react";
import NoteContext from "./NoteContext";
// import { json } from "express";

const NoteState = (props) => {
  const host = 'http://localhost:5000'
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)

  //Get all notes
  const getNotes = async() => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiNGViNDNkYzRjMmM3NzlkMWFjNDkzIn0sImlhdCI6MTY4OTY2MjQ1NX0.jl2m-miqMELMYNsYuVQk3vgLzzObuPvuhUd9jCibGPU"
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  } 

  // Add a note
  const addNote = async (title, description, tag) => {
    
    // TODO: API call
    const response = await fetch(`${host}/api/notes/addnote/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiNGViNDNkYzRjMmM3NzlkMWFjNDkzIn0sImlhdCI6MTY4OTY2MjQ1NX0.jl2m-miqMELMYNsYuVQk3vgLzzObuPvuhUd9jCibGPU"
      },
      body: JSON.stringify({ title, description, tag })
    });

    const json = await response.json();
    console.log(json);
    const note = {
      "_id": "64bca8d9e1a91341a4bc3bb9",
      "user": "64b4eb43dc4c2c779d1ac493",
      "title": title,
      "description": description,
      "tag": <tag></tag>,
      "date": "2023-07-23T04:13:13.551Z",
      "__v": 0
    };
    setNotes(notes.concat(note))
  }

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    // API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiNGViNDNkYzRjMmM3NzlkMWFjNDkzIn0sImlhdCI6MTY4OTY2MjQ1NX0.jl2m-miqMELMYNsYuVQk3vgLzzObuPvuhUd9jCibGPU"
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes))
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }

  // Delete a note
  const deleteNote = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiNGViNDNkYzRjMmM3NzlkMWFjNDkzIn0sImlhdCI6MTY4OTY2MjQ1NX0.jl2m-miqMELMYNsYuVQk3vgLzzObuPvuhUd9jCibGPU"
      },
    });
    const json = response.json();
    console.log(json);

    console.log("Deleting node with id:" + id);
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote, getNotes}}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;