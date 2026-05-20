require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB, saveMessage } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve your frontend files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// API: Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API: Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, phone, service, message } = req.body;
    
    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, error: 'Full name, email, and message are required.' });
    }

    await saveMessage({ fullName, email, phone, service, message });
    res.status(200).json({ success: true, message: 'Message received successfully!' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: 'Failed to save message.' });
  }
});

// Initialize DB and start server
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running: http://localhost:${PORT}`);
      console.log(`📦 Frontend served from /public`);
    });
  })
  .catch(err => console.error('❌ DB Init Failed:', err));