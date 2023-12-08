import React, { useState, useRef, useEffect } from 'react'
import axios from '../../../../store/axios-secure'
import './index.scss'
import { format } from 'date-fns'
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import CustomModal from '../../../Common/Modal'
import Button from '../../../Common/Button'
import Loader from '../../../Common/Loader'

const NotePopup = ({ clientId, username, onClose }) => {
    const [newNote, setNewNote] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [editableNote, setEditableNote] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [noteToDeleteId, setNoteToDeleteId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [noteLoading, setNoteLoading] = useState(false)
    const [notes, setNotes] = useState(null)
    const notesListRef = useRef(null)

    const handleClickOutside = (event) => {
        const popupContent = document.querySelector('.notePopup-content')
        const modalContent = document.querySelector('.custom-modal-content') // Replace with the actual class name of the modal content

        if (
            popupContent &&
            !popupContent.contains(event.target) &&
            !modalContent?.contains(event.target)
        ) {
            if (newNote.trim() !== '') {
                handleAddNote()
            }
            if (editableNote && editMode) {
                console.log('Insideditablenote: ', editableNote)
                handleSaveNote(editableNote._id)
            }
            onClose() // Close the NotePopup
        }
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [newNote, showDeleteModal, editableNote])

    const handleKeyDown = (event) => {
        if (event.key === 'Escape' || (event.altKey && event.key === 'a')) {
            if (newNote.trim() !== '') {
                handleAddNote()
            }
            if (editableNote && editMode) {
                console.log('Insideditablenote: ', editableNote)
                handleSaveNote(editableNote._id)
            }
            onClose() // Close the NotePopup
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [newNote, editableNote])

    useEffect(() => {
        if (notesListRef.current) {
            notesListRef.current.scrollTop = notesListRef.current.scrollHeight
        }
    }, [newNote])
    // useEffect(() => {
    //     document.body.style.overflow = 'hidden';
    //     return () => {
    //         document.body.style.overflow = 'auto !important'; // Reset overflow when the component is unmounted
    //     };
    // }, []);

    const handleAddNote = async () => {
        setNoteLoading(true)
        try {
            await axios.post(`trainers/addNotes?clientId=${clientId}`, {
                note: newNote,
            })
            const response = await axios.get(
                `trainers/getNotes?clientId=${clientId}`,
            )
            const updatedNotes = response.data
            setNotes(updatedNotes)
            setNewNote('')
        } catch (error) {
            console.log(error)
        } finally {
            setNoteLoading(false)
        }
    }
    const removeNote = async () => {
        try {
            await axios.delete(`trainers/deleteNotes/${noteToDeleteId}`)
            const updatedNotes = notes.filter(
                (note) => note._id !== noteToDeleteId,
            )
            setNotes(updatedNotes)
        } catch (error) {
            console.log(error)
        } finally {
            setShowDeleteModal(false) // Close the delete modal after deletion
        }
    }

    const handleEditNote = (noteId) => {
        const noteToEdit = notes.find((note) => note._id === noteId)
        setEditableNote(noteToEdit)
        setEditMode(true)
        console.log('edit|||Note,,,,,,,', editableNote)
    }

    const handleSaveNote = async (noteId) => {
        setNoteLoading(true)
        try {
            await axios.put(`trainers/updateNotes/${noteId}`, {
                note: editableNote.note,
            })
            const response = await axios.get(
                `trainers/getNotes?clientId=${clientId}`,
            )
            const updatedNotes = response.data
            setNotes(updatedNotes)
            setEditMode(false)
            setEditableNote(null)
        } catch (error) {
            console.log(error)
        }
        setNoteLoading(false)
    }
    const fetchNotes = async () => {
        try {
            const response = await axios.get(
                `trainers/getNotes?clientId=${clientId}`,
            )
            setNotes(response.data)
        } catch (error) {
            console.error('Error fetching notes:', error)
        }
        setLoading(false)
    }

    const handleCancelEdit = () => {
        setEditMode(false)
        setEditableNote(null)
    }
    useEffect(() => {
        fetchNotes()
    }, [])

    return (
        <div className="notePopup">
            <div className="notePopup-content">
                <div className="username">{username}</div>

                {/* Conditionally render based on loading state */}
                {loading ? (
                    <Loader />
                ) : (
                    notes.length > 0 && (
                        <div className="notesList" ref={notesListRef}>
                            {/* ... (map notes as before) */}
                            {notes.map((note) => (
                                <div className="noteContainer" key={note._id}>
                                    <div className="noteDate">
                                        {format(
                                            new Date(note.date),
                                            'dd-MMM-yyyy  HH:mm  ',
                                        )}
                                        IST
                                        {editMode &&
                                        editableNote?._id === note._id ? (
                                            <>
                                                <span className="saveNote">
                                                    {noteLoading ? (
                                                        <Loader />
                                                    ) : (
                                                        <FaSave
                                                            onClick={() =>
                                                                handleSaveNote(
                                                                    note._id,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </span>
                                                <span className="cancelNote">
                                                    <FaTimes
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                    />
                                                </span>
                                            </>
                                        ) : (
                                            <span className="editNote">
                                                <FaEdit
                                                    onClick={() =>
                                                        handleEditNote(note._id)
                                                    }
                                                />
                                            </span>
                                        )}
                                        <span className="deleteNote">
                                            <FaTrashAlt
                                                onClick={() => {
                                                    setNoteToDeleteId(note._id)
                                                    setShowDeleteModal(true)
                                                }}
                                            />
                                        </span>
                                    </div>
                                    <div className="noteField">
                                        {editMode &&
                                        editableNote?._id === note._id ? (
                                            <textarea
                                                value={editableNote.note}
                                                onChange={(e) =>
                                                    setEditableNote({
                                                        ...editableNote,
                                                        note: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            <>{note.note}</>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* {notes.length > 0 && ( // Conditionally render notesList field if there are notes
                    <div className="notesList" ref={notesListRef}>
                        
                    </div>
                )} */}
                <div className="addNoteField">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add notes..."
                    />
                    <div className="buttons">
                        {/* {(loading && newNote.trim() !== '') ? <Loader /> : <button onClick={handleAddNote}>Save</button>}

            <button onClick={onClose}>Back</button> */}

                        <span className="addNote">
                            {noteLoading && newNote.trim() !== '' ? (
                                <Loader />
                            ) : (
                                <button onClick={handleAddNote}>Save</button>
                            )}
                        </span>
                        {/* <span className="backNote">
                            <button>Back</button>
                        </span> */}
                    </div>
                </div>
            </div>
            <div></div>
            <CustomModal
                title={'Delete Note'}
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                width="small"
                dark={false}
                className="custom-modal-content"
            >
                <div>
                    <p>Are you sure you want to delete the note?</p>
                    <div className="d-flex">
                        <Button
                            text={'Yes'}
                            color="green"
                            size="s"
                            onClick={removeNote}
                        />
                        <Button
                            text={'No'}
                            color="red"
                            size="s"
                            onClick={() => setShowDeleteModal(false)}
                        />
                    </div>
                </div>
            </CustomModal>
        </div>
    )
}

export default NotePopup
