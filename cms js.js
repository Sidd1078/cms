const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (make sure you have MongoDB installed and running)
mongoose.connect('mongodb://localhost/contentdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Content schema and model
const contentSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Content = mongoose.model('Content', contentSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API endpoints for content management

// Create content
app.post('/api/content', async (req, res) => {
  try {
    const { title, body } = req.body;
    const newContent = new Content({ title, body });
    await newContent.save();
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ error: 'Could not create content.' });
  }
});

// Get all content
app.get('/api/content', async (req, res) => {
  try {
    const contents = await Content.find();
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch content.' });
  }
});

// Update content by ID
app.put('/api/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const updatedContent = await Content.findByIdAndUpdate(id, { title, body }, { new: true });
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: 'Could not update content.' });
  }
});

// Delete content by ID
app.delete('/api/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Content.findByIdAndRemove(id);
    res.json({ message: 'Content deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete content.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
