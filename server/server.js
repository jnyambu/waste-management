// server.js - Backend Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-wastage-tracker';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Waste Entry Schema
const wasteEntrySchema = new mongoose.Schema({
  foodItem: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Fruits & Vegetables', 'Grains & Bakery', 'Dairy', 'Meat & Fish', 'Prepared Food', 'Other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.1
  },
  reason: {
    type: String,
    required: true,
    enum: ['Spoiled', 'Overcooked', 'Excess', 'Disliked', 'Other']
  },
  notes: {
    type: String,
    trim: true
  },
  userId: {
    type: String,
    default: 'default-user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const WasteEntry = mongoose.model('WasteEntry', wasteEntrySchema);

// Routes

// GET all waste entries
app.get('/api/waste-entries', async (req, res) => {
  try {
    const entries = await WasteEntry.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waste entries',
      error: error.message
    });
  }
});

// GET single waste entry
app.get('/api/waste-entries/:id', async (req, res) => {
  try {
    const entry = await WasteEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Waste entry not found'
      });
    }
    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waste entry',
      error: error.message
    });
  }
});

// POST create new waste entry
app.post('/api/waste-entries', async (req, res) => {
  try {
    const { foodItem, category, quantity, reason, notes } = req.body;

    // Validation
    if (!foodItem || !category || !quantity || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const newEntry = new WasteEntry({
      foodItem,
      category,
      quantity,
      reason,
      notes: notes || ''
    });

    const savedEntry = await newEntry.save();

    res.status(201).json({
      success: true,
      message: 'Waste entry created successfully',
      data: savedEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating waste entry',
      error: error.message
    });
  }
});

// PUT update waste entry
app.put('/api/waste-entries/:id', async (req, res) => {
  try {
    const { foodItem, category, quantity, reason, notes } = req.body;

    const updatedEntry = await WasteEntry.findByIdAndUpdate(
      req.params.id,
      { foodItem, category, quantity, reason, notes },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Waste entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Waste entry updated successfully',
      data: updatedEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating waste entry',
      error: error.message
    });
  }
});

// DELETE waste entry
app.delete('/api/waste-entries/:id', async (req, res) => {
  try {
    const deletedEntry = await WasteEntry.findByIdAndDelete(req.params.id);

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Waste entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Waste entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting waste entry',
      error: error.message
    });
  }
});

// GET statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const entries = await WasteEntry.find();
    
    const totalWaste = entries.reduce((sum, entry) => sum + entry.quantity, 0);
    const totalEntries = entries.length;
    const avgWaste = totalEntries > 0 ? totalWaste / totalEntries : 0;
    const carbonImpact = totalWaste * 2.5;

    // Group by category
    const byCategory = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.quantity;
      return acc;
    }, {});

    // Group by reason
    const byReason = entries.reduce((acc, entry) => {
      acc[entry.reason] = (acc[entry.reason] || 0) + entry.quantity;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalWaste: parseFloat(totalWaste.toFixed(2)),
        totalEntries,
        avgWaste: parseFloat(avgWaste.toFixed(2)),
        carbonImpact: parseFloat(carbonImpact.toFixed(2)),
        byCategory,
        byReason
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Food Wastage Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});