 const express = require('express'); const mongoose = require('mongoose'); const bodyParser = require('body-parser'); 
const cors = require('cors'); const path = require('path'); 
const app = express(); 
const port = 3000; 
 
app.use(cors()); app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 
 
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student') 
    .then(() => console.log('Connected to MongoDB')) 
    .catch(err => console.error('Failed to connect to MongoDB', err)); 
 
const studentSchema = new mongoose.Schema({     name: String,     age: Number,     course: String,     year: String 
}, { collection: 'stu' }); // Collection name is 'stu' 
 
const Student = mongoose.model('Student', studentSchema); 
 
// Get all students with sorting app.get('/students', async (req, res) => {     try { 
        // Default to ascending if no sortOrder provided         const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;         const students = await Student.find().sort({ age: sortOrder });         res.json(students);     } catch (error) { 
        res.status(500).json({ error: 'Failed to fetch students' });    

 
// Add a new student 
app.post('/students', async (req, res) => {     try { 
 
        const student = new Student(req.body); 
        await student.save();         res.json(student);     } catch (error) { 
        res.status(500).json({ error: 'Failed to add student' });     } 
}); 
 
// Update an existing student 
app.put('/students/:id', async (req, res) => {     try { 
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, 
{ new: true });         res.json(student);     } catch (error) { 
        res.status(500).json({ error: 'Failed to update student' }); 
    } 
}); 
 
// Delete a student 
app.delete('/students/:id', async (req, res) => {     try { 
        await Student.findByIdAndDelete(req.params.id); 
        res.json({ message: 'Student deleted' }); 
    } catch (error) { 
        res.status(500).json({ error: 'Failed to delete student' });     } 
}); 
 
//  Start the server 
 app.listen(port, () => { 
    console.log(`Server running at http://localhost:${port}`); }); 
 
