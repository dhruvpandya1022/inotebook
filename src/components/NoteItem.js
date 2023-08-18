import React,{useContext} from 'react'
import noteContext from '../context/NoteContext';

const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    const handleDelete=()=>{
        deleteNote(note._id);
        props.showAlert("Note Deleted Successfully", "success");
    }
    return (
        <div className="col-md-3">
            <div className="card my-3">
                    <div className="card-body">
                        <h5 className="card-title">{note.title}</h5><h6><span className="badge bg-secondary">{note.tag}</span></h6>
                        <p className="card-text">{note.description}</p>
                        <i className="fa-solid fa-trash-can mx-2" onClick={handleDelete}></i>
                        <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
                    </div>
            </div>
        </div>
    )
}   

export default NoteItem