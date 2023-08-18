import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/NoteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(noteContext);
    let navigate = useNavigate();
    const { notes, getNotes, editNote } = context;
    const [note, setnote] = useState({id:"", etitle: "", edescription:"", etag:""});
    useEffect(() => {
        if(localStorage.getItem('token')) {
            getNotes();
        }
        else {
            navigate("/login");
        }
    }, [])
    const ref = useRef(null);
    const refClose = useRef(null);

    const updateNote = (currentnote) => {
        ref.current.click();
        setnote({id: currentnote._id, etitle: currentnote.title, edescription: currentnote.description, etag: currentnote.tag});
    }

    const handleClick = (e)=>{
        refClose.current.click();
        editNote(note.id, note.etitle, note.edescription, note.etag);
        props.showAlert("Note Edited Successfully", "success");
    }

    // const handleClick = (e)=>{
    //     e.preventDefault();
    //     addNote(note.title, note.description, note.tag="default");
    // }
    const onChange = (e)=>{
        setnote({...note, [e.target.name]: e.target.value})
    }

    
    return (
        <>
            <AddNote showAlert={props.showAlert} />
            {/* <!-- Button trigger modal --> */}
            <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div me="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" onChange={onChange} value={note.etitle} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" onChange={onChange} value={note.edescription} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" onChange={onChange} value={note.etag} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" ref={refClose} data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleClick}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h2>Your Notes</h2>
                <div className="container mx-2">
                    {notes.length === 0 && 'No notes to display'}
                </div>
                {notes.map((note) => {
                    return <NoteItem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert}/>;
                })}
            </div>
        </>
    )
}

export default Notes