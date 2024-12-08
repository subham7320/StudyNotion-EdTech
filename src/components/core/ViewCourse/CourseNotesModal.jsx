import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  X, 
  Save, 
  Trash2, 
  Edit, 
  CheckCircle 
} from "lucide-react"

const CourseNotesModal = ({ onClose, videoTitle }) => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(`course-notes-${videoTitle}`)
    return savedNotes ? JSON.parse(savedNotes) : []
  })
  const [currentNote, setCurrentNote] = useState("")
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editingNoteText, setEditingNoteText] = useState("")

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(`course-notes-${videoTitle}`, JSON.stringify(notes))
  }, [notes, videoTitle])

  // Add a new note
  const addNote = () => {
    if (currentNote.trim()) {
      const newNotes = [...notes, {
        id: Date.now(),
        text: currentNote,
        timestamp: new Date().toLocaleString(),
        createdAt: new Date().getTime()
      }]
      setNotes(newNotes)
      setCurrentNote("")
    }
  }

  // Delete a note
  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
  }

  // Start editing a note
  const startEditing = (note) => {
    setEditingNoteId(note.id)
    setEditingNoteText(note.text)
  }

  // Save edited note
  const saveEditedNote = () => {
    const updatedNotes = notes.map(note => 
      note.id === editingNoteId 
        ? { ...note, text: editingNoteText, updatedAt: new Date().getTime() } 
        : note
    )
    setNotes(updatedNotes)
    setEditingNoteId(null)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-richblack-700 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-richblack-600">
          <h2 className="text-xl font-semibold text-white">
            Course Notes for {videoTitle}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-yellow-50 transition-colors"
          >
            <X />
          </button>
        </div>

        {/* Notes List */}
        <div className="p-4 flex-grow overflow-y-auto">
          {notes.length === 0 ? (
            <div className="text-center text-richblack-300 py-4">
              No notes yet. Start writing!
            </div>
          ) : (
            notes
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((note) => (
                <motion.div 
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-richblack-800 p-3 rounded-lg mb-3 flex justify-between items-start"
                >
                  {editingNoteId === note.id ? (
                    <div className="flex-grow mr-2">
                      <textarea
                        value={editingNoteText}
                        onChange={(e) => setEditingNoteText(e.target.value)}
                        className="w-full bg-richblack-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-50"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div className="flex-grow">
                      <p className="text-white">{note.text}</p>
                      <small className="text-richblack-300">
                        Created: {new Date(note.createdAt).toLocaleString()}
                        {note.updatedAt && (
                          <span className="ml-2 text-yellow-50">
                            (Edited)
                          </span>
                        )}
                      </small>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {editingNoteId === note.id ? (
                      <button 
                        onClick={saveEditedNote}
                        className="text-green-500 hover:text-green-400 transition-colors"
                      >
                        <CheckCircle />
                      </button>
                    ) : (
                      <button 
                        onClick={() => startEditing(note)}
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        <Edit />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </motion.div>
              ))
          )}
        </div>

        {/* Note Input Area */}
        <div className="p-4 border-t border-richblack-600 flex space-x-2">
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Write your notes here..."
            className="flex-grow bg-richblack-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-50"
            rows={3}
          />
          <button 
            onClick={addNote}
            className="bg-yellow-50 text-richblack-900 p-2 rounded-lg hover:bg-yellow-200 transition-colors self-end"
          >
            <Save />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CourseNotesModal