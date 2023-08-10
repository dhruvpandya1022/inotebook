const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route 1: Get all the notes: fetchallnotes LOGIN REQUIRED
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

// Route 2: Add a note: addnote LOGIN REQUIRED
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter Valid Name").isLength({ min: 3 }),
    body("description", "Enter Valid Email"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      const { title, description, tag } = req.body;
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Update an existing note: updatnote LOGIN REQUIRED
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Enter Valid Name").isLength({ min: 3 }),
    body("description", "Enter Valid Email"),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // create a newNode object;
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      //Find the note to be updated
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found Note");
      }

      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed User");
      }
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 4: Delete an existing note: deletenote LOGIN REQUIRED
router.delete(
  "/deletenote/:id",
  fetchuser,
  [
    body("title", "Enter Valid Name").isLength({ min: 3 }),
    body("description", "Enter Valid Email"),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // create a newNode object;
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      //Find the note to be updated
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found Note");
      }

      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed User");
      }
      note = await Note.findByIdAndDelete(
        req.params.id,
      );
      
      res.json({ "Success":"Note has been deleted", note:note });
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
