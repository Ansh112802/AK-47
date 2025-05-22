// routes/assignment.js
import express from 'express';
import Assignment from '../models/Assignment.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("Request Body:", req.body); // 🔍 DEBUG
    const newAssignment = new Assignment(req.body);
    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET: Fetch all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
